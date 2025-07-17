import { z } from "zod";
import fetch from 'node-fetch';
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from 'url';
import { server } from "./server.js";
import {addIntegrationAcceleratorTools} from "./tools/ia/index.js";

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add this type definition near the top of the file
type WorldpayResponse = {
    outcome: string;
    transactionReference: string;
  };

  // Add this type definition near the top with the other types
  type Payment = {
    timestamp: string;
    transactionReference: string;
    transactionType: string;
    authorizationType: string;
    entity: string;
    value: {
      currency: string;
      amount: number;
    };
  };

  // Add with other type definitions
  type QueryResponse = {
    _embedded: {
      payments: Payment[];
    };
  };



  // Payment tool schema
  const paymentSchema = {
    cardHolderName: z.string(),
    cardNumber: z.string(),
    expiryMonth: z.number().min(1).max(12),
    expiryYear: z.number(),
    cvc: z.string(),
    amount: z.number(),
    currency: z.string().default("GBP"),
    // Basic billing address fields
    address1: z.string(),
    city: z.string(),
    postalCode: z.string(),
    countryCode: z.string()
  };

  const checkoutFormSchema = {
    checkoutId: z.string(),
    framework: z.enum(["web", "react"]),
  }

  const paymentGenerateSchema = {
    method: z.enum(["card"]),
    instrument: z.enum(["session"]),
    features: z.array(z.enum(["3ds", "fraud", "payfac", "recurring", "installments","moto","autoSettlement","checkout","tokens","cards","applePay","googlePay","subscriptions"])),
    language: z.enum(["node"]),
  }

  const paymentQuerySchema = {
    startDate: z.string(),
    endDate: z.string(),
    pageSize: z.number().optional().default(20),
    currency: z.string().optional(),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
    last4Digits: z.string().optional().refine(val => val?.length === 4 && /^\d{4}$/.test(val), {
      message: "last4Digits must be exactly 4 digits"
    }),
    entityReferences: z.string().optional(),
    receivedEvents: z.string().optional()
  }

  // Add payment tool
  server.tool("makePayment",
    paymentSchema,
    async (params) => {
      try {
        const paymentRequest = {
          transactionReference: `TR-${Date.now()}`,
          merchant: {
            entity: "default"
          },
          instruction: {
            method: "card",
            paymentInstrument: {
              type: "plain",
              cardHolderName: params.cardHolderName,
              cardNumber: params.cardNumber,
              expiryDate: {
                month: params.expiryMonth,
                year: params.expiryYear
              },
              billingAddress: {
                address1: params.address1,
                city: params.city,
                postalCode: params.postalCode,
                countryCode: params.countryCode
              },
              cvc: params.cvc
            },
            narrative: {
              line1: "MCP Payment"
            },
            value: {
              currency: params.currency,
              amount: params.amount
            }
          }
        };

        // Make request to Worldpay API
        const response = await fetch('https://try.access.worldpay.com/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`).toString('base64')}`,
            'WP-Api-Version': '2024-06-01'
          },
          body: JSON.stringify(paymentRequest)
        });

        const result = await response.json() as WorldpayResponse;

        // Return formatted response
        return {
          content: [{
            type: "text",
            text: `Payment ${result.outcome}: Transaction Reference ${result.transactionReference}`
          }]
        };
      } catch (error) {
        return {
          isError: true,
          content: [{
            type: "text",
            text: `Payment failed: ${(error as Error).message}`
          }]
        };
      }
    }
  );

  // Add the query tool after the makePayment tool
  server.tool("queryPayments",
    {
      startDate: z.string(),
      endDate: z.string(),
      pageSize: z.number().optional().default(20),
      currency: z.string().optional(),
    },
    async (params) => {
      try {
        const queryParams = new URLSearchParams({
          startDate: params.startDate,
          endDate: params.endDate,
          pageSize: params.pageSize.toString(),
          ...(params.currency && { currency: params.currency })
        });

        const response = await fetch(
          `https://try.access.worldpay.com/paymentQueries/payments?${queryParams}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/vnd.worldpay.payment-queries-v1.hal+json',
              'Authorization': `Basic ${Buffer.from(`${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`).toString('base64')}`
            }
          }
        );

        const result = await response.json() as QueryResponse;
        const payments = result._embedded?.payments || [];

        // Create table header
        const table = [
          "| Date | Reference | Type | Auth Type | Currency | Amount |",
          "|------|-----------|------|-----------|----------|---------|"
        ];

        // Add each payment as a row
        payments.forEach((payment: Payment) => {
          const date = new Date(payment.timestamp).toLocaleDateString();
          table.push(
            `| ${date} | ${payment.transactionReference} | ${payment.transactionType} | ${payment.authorizationType} | ${payment.value.currency} | ${payment.value.amount} |`
          );
        });

        return {
          content: [{
            type: "text",
            text: table.join('\n')
          }]
        };
      } catch (error) {
        return {
          isError: true,
          content: [{
            type: "text",
            text: `Query failed: ${(error as Error).message}`
          }]
        };
      }
    }
  );


  server.tool("generatePaymentServerCode",
    paymentGenerateSchema,
    async (params) => {
      try {

          const response = await fs.readFile(path.join(__dirname, 'templates/examples/payment_api_response.json'), 'utf8');

          let component;
          if (params.method === "card" && params.instrument === "session" && params.language === "node") {
            component = await fs.readFile(path.join(__dirname, 'templates/code/cp_session_payment_node.js'), 'utf8');
          } else {
            throw new Error("Unsupported combination of parameters");
          }

        return {
          content: [
            {
              type: "text",
              text: "Add this to the server to allow it to make payments using the Worldpay API:",
              mimeType: "text/plain"
            },
            {
              type: "text",
              text: component,
              mimeType: "text/javascript"
            },
            {
              type: "text",
              text: "The following is an example of the response from the Worldpay PaymentsAPI, use this to model any response handling in the server:",
              mimeType: "text/plain"
            },
            {
              type: "text",
              text: response,
              mimeType: "text/json"
            }
          ]
        };
      } catch (error) {
        return {
          content: [{
            isError: true,
            type: "text",
            text: `Server code generation failed: ${(error as Error).message}`
          }]
        };
      }
    }
  );

  server.tool("generatePaymentQuery",
    paymentQuerySchema,
    async (params) => {
      try {

        const docs = await fs.readFile(path.join(__dirname, 'templates/md/payment_query_docs.md'), 'utf8');
        const response = await fs.readFile(path.join(__dirname, 'templates/examples/payment_query_response.json'), 'utf8');

        return {
          content: [{
            type: "text",
            text: "The following is a guide on how to query the Payment Queries API by date range:",
            mimeType: "text/plain"
          },
          {
            type: "text",
            text: docs,
            mimeType: "text/markdown"
          },
          {
            type: "text",
            text: "Here are some example of the api calls you can make with different parameters:\n \
            https://try.access.worldpay.com/paymentQueries/payments?startDate={startDate}&endDate={endDate}&pageSize={pageSize}\n \
            https://try.access.worldpay.com/paymentQueries/payments?startDate={startDate}&endDate={endDate}&pageSize={pageSize}&currency={currency}\n \
            https://try.access.worldpay.com/paymentQueries/payments?startDate={startDate}&endDate={endDate}&pageSize={pageSize}&minAmount={minAmount}&maxAmount={maxAmount}\n \
            https://try.access.worldpay.com/paymentQueries/payments?startDate={startDate}&endDate={endDate}&pageSize={pageSize}&last4Digits={last4Digits}\n \
            https://try.access.worldpay.com/paymentQueries/payments?startDate={startDate}&endDate={endDate}&pageSize={pageSize}&entityReferences={entityReferences}\n \
            https://try.access.worldpay.com/paymentQueries/payments?startDate={startDate}&endDate={endDate}&pageSize={pageSize}&receivedEvents={receivedEvents}\n \
            ",
            mimeType: "text/markdown"
          },
          {
            type: "text",
            text: "The following is an example of the response from the Worldpay Payment Queries API, use this to model any response handling in the server:",
            mimeType: "text/json"
          },
          {
            type: "text",
            text: response,
            mimeType: "text/json"
          }
        ]
        };
      } catch (error) {
        return {
          content: [{
            isError: true,
            type: "text",
            text: `Payment query generation failed: ${(error as Error).message}`
          }]
        };
      }
    }
  );

  // Generate checkout form tool
  server.tool("generateCheckoutForm",
    checkoutFormSchema,
    async (params) => {
      try {
        const component = params.framework === "web"
          ? await fs.readFile(path.join(__dirname, 'templates/code/checkout_form.html'), 'utf8')
          : await fs.readFile(path.join(__dirname, 'templates/code/react_form.txt'), 'utf8')

        const styling = params.framework === "web"
          ? await fs.readFile(path.join(__dirname, 'templates/code/web_css.css'), 'utf8')
          : await fs.readFile(path.join(__dirname, 'templates/code/react_css.css'), 'utf8')

        const js = params.framework === "web"
          ? await fs.readFile(path.join(__dirname, 'templates/code/web_js.js'), 'utf8')
          : "There is no additional JavaScript required for React, as the component handles everything internally.";

        return {
          content: [
            {
              type: "text",
              text: "Add this to a new checkout component:",
              mimeType: "text/plain"
            },
            {
              type: "text",
              text: component,
              mimeType: "text/html"
            },
            {
              type: "text",
              text: "\nAdd to the a CSS file and reference in the checkout component:",
              mimeType: "text/plain"
            },
            {
              type: "text",
              text: styling,
              mimeType: "text/css"
            },
            {
              type: "text",
              text: "\nAdd this to a new javsacript file and reference in the checkout component:",
              mimeType: "text/plain"
            },
            {
              type: "text",
              text: js,
              mimeType: "text/js"
            }
          ]
        };
      } catch (error) {
        return {
          content: [{
            isError: true,
            type: "text",
            text: `Checkout creation failed: ${(error as Error).message}`
          }]
        };
      }
    }
  );

addIntegrationAcceleratorTools(server)

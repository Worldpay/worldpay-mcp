import {logger} from "@/utils/logger";
import {
  accountPayoutQuerySchema,
  delegateTokenSchema,
  manageSchema,
  paymentDateQuerySchema,
  paymentSchema,
  paymentTxnRefQuerySchema
} from "@/schemas/schemas";
import {RegisteredTool} from '@modelcontextprotocol/sdk/server/mcp.js';

import {z} from "zod";
import {
  BillingAddress,
  CardPaymentsInstruction,
  PaymentRequest,
  PaymentsCardOnFileCustomerAgreement,
  PaymentsResponse201,
  SessionPaymentInstrument,
  TokenCreation,
  TokenPaymentInstrument
} from "@/types/payments";
import {WorldpayMCPConfig} from "@/worldpay-mcp-server";

const QUERY_API_PATH = "/paymentQueries/payments";
const PAYMENTS_API_PATH = '/api/payments';
const DELEGATE_TOKEN_PATH = "/sessions/agentic_commerce/delegate_payment";

export class WorldpayAPI {
  private config: WorldpayMCPConfig;

  constructor(config: WorldpayMCPConfig) {
    this.config = config
  }

  private getBasicAuth(): string {
    if (!this.config.username || !this.config.password) {
      throw new Error("Username and password required for Basic auth");
    }
    const token = Buffer.from(`${this.config.username}:${this.config.password}`, "utf8").toString("base64");
    return `Basic ${token}`;
  }

  async callQueryAPIWithParams(queryParams: URLSearchParams): Promise<any> {
    return this.callQueryAPI(
      `${this.config.baseUrl}${QUERY_API_PATH}?${queryParams}`
    );
  }

  async callQueryAPI(path: string): Promise<any> {
    logger.info(`Calling GET ${path}`);

    const basicAuth = this.getBasicAuth()
    const response = await fetch(path, {
      method: "GET",
      headers: {
        Accept: "application/vnd.worldpay.payment-queries-v1.hal+json",
        Authorization: basicAuth,
      },
    });

    if (response.status != 200) {
      throw new Error(
        `Payment Query failed with status ${response.status}: ${JSON.stringify(
          await response.json()
        )}`
      );
    }

    const result: any = await response.json();
    if (result._embedded) {
      logger.info(
        `Query successful: ${result._embedded.payments.length} payments found.`
      );
      return result._embedded?.payments || [];
    } else {
      logger.info("Query successful, payment found.");
      return result
    }
  }

  // Add SDK methods here
  async queryPaymentsByIdHandler(paymentId: any) {
    return this.callQueryAPI(
      `${this.config.baseUrl}${QUERY_API_PATH}/${paymentId}`
    );
  }

  async queryPaymentsByDate(
    params: z.infer<typeof paymentDateQuerySchema>
  ): Promise<RegisteredTool> {
    let queryParams = new URLSearchParams({
      startDate: params.startDate ? params.startDate : "",
      endDate: params.endDate ? params.endDate : "",
      pageSize: params.pageSize ? params.pageSize.toString() : "",
    });
    return this.callQueryAPIWithParams(queryParams);
  }

  async queryPaymentsByTxRefHandler(
    params: z.infer<typeof paymentTxnRefQuerySchema>
  ) {
    let queryParams = new URLSearchParams({
      transactionReference: params.transactionReference
        ? params.transactionReference
        : ""
    });
    return this.callQueryAPIWithParams(queryParams);
  }

  async managePayment(params: z.infer<typeof manageSchema>) {
    logger.info(
      `Calling POST ${params.commandHref} API`
    );
    const basicAuth = this.getBasicAuth()
    const response = await fetch(params.commandHref, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
        "WP-Api-Version": "2024-06-01",
      },
    });

    const result = await response.json();

    if (response.status != 201 && response.status != 202) {
      throw new Error(
        `Payment failed with status ${response.status}: ${JSON.stringify(
          result
        )}`
      );
    }

    logger.info('Payment command successful');
    return result
  }

  async takeGuestPayment(params: z.infer<typeof paymentSchema>) {
    let paymentRequest: PaymentRequest = this.createRequest(params);

    logger.info(
      `Calling POST ${this.config.baseUrl}${
        PAYMENTS_API_PATH
      } API with params: ${JSON.stringify(params)}`
    );

    const basicAuth = this.getBasicAuth()

    const response = await fetch(
      `${this.config.baseUrl}${PAYMENTS_API_PATH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: basicAuth,
          "WP-Api-Version": "2024-06-01",
        },
        body: JSON.stringify(paymentRequest),
      }
    );

    logger.info(`Response CorrelationId: ${response.headers.get("wp-correlationid")}`);

    if (response.status != 201 && response.status != 202) {
      throw new Error(
        `Payment failed with status ${response.status}: ${JSON.stringify(
          await response.json()
        )}`
      );
    }

    const result = (await response.json()) as PaymentsResponse201;

    logger.info(`Payment outcome: ${result.outcome}`);
    return result
  }


  createRequest(params: z.infer<typeof paymentSchema>): PaymentRequest {
    let billingAddress: BillingAddress = {
      address1: params.address1,
      city: params.city,
      postalCode: params.postalCode,
      countryCode: params.countryCode,
    } as BillingAddress;

    let paymentInstrument: TokenPaymentInstrument | SessionPaymentInstrument;
    if (params.sessionHref) {
      paymentInstrument = {
        type: "checkout",
        cardHolderName: params.cardHolderName,
        sessionHref: params.sessionHref,
        billingAddress: billingAddress,
      } as SessionPaymentInstrument;
    } else if (params.tokenHref) {
      paymentInstrument = {
        type: "token",
        href: params.tokenHref,
        cvc: params.cvc,
        cvcSessionHref: params.cvcSessionHref
      } as TokenPaymentInstrument;
    } else {
      throw new Error("Either sessionHref or tokenHref must be provided");
    }

    let instruction: CardPaymentsInstruction = {
      method: "card",
      paymentInstrument: paymentInstrument,
      narrative: {line1: "MCP Payment"},
      value: {
        currency: params.currency,
        amount: params.amount,
      },
    } as CardPaymentsInstruction;

    let paymentRequest: PaymentRequest = {
      transactionReference: `TR${Date.now()}`,
      merchant: {entity: `${this.config.merchantEntity}`},
      channel: "moto",
      instruction: instruction,
    } as PaymentRequest;

    if (params.storeCard) {
      let cit: PaymentsCardOnFileCustomerAgreement = {
        type: "cardOnFile",
        storedCardUsage: "first",
      };
      paymentRequest.instruction.customerAgreement = cit;
    }

    if (params.createToken) {
      let token: TokenCreation = {
        type: "worldpay",
      };
      paymentRequest.instruction.tokenCreation = token;
    }
    return paymentRequest;
  }

  async queryAccountPayouts(params: z.infer<typeof accountPayoutQuerySchema>) {
    const entries: [string, string][] = Object.entries(params)
      .filter(([key, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [key, String(value)]);

    if (this.config.merchantEntity) {
      entries.push(["entity", this.config.merchantEntity]);
    }
    const queryParams = new URLSearchParams(entries);

    return this.callQueryAPIWithParams(queryParams);
  }

  async createDelegateToken(args: z.infer<typeof delegateTokenSchema>) {
   
    logger.info(
      `Calling POST ${this.config.baseUrl}${
        DELEGATE_TOKEN_PATH}`
    );
    const basicAuth = this.getBasicAuth()

    const response = await fetch(
      `${this.config.baseUrl}${DELEGATE_TOKEN_PATH}`,
      {
        method: "POST",
        headers: {
          Authorization: basicAuth,
          "Content-Type": "application/json",
          "API-Version": "2025-09-29",
          Accept: "application/json",
        },
        body: JSON.stringify(args),
      }
    );

    const result = await response.json();

    if (response.status != 201) {
      throw new Error(
        `Creating a Delegate Token failed with status ${response.status}: ${JSON.stringify(
          result
        )}`
      );
    }

    logger.info(`Created a Delegate Token successfully`);

    return result;
  }
}

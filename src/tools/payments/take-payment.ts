
import { z } from "zod";
import { components } from "../../types/payments-api";

export const paymentSchema = z.object({
  cardHolderName: z.string(),
  cardNumber: z.string(),
  expiryMonth: z.number().min(1).max(12),
  expiryYear: z.number(),
  cvc: z.string(),
  amount: z.number(),
  currency: z.string().default("GBP"),
  address1: z.string(),
  city: z.string(),
  postalCode: z.string(),
  countryCode: z.string(),
  storeCard: z.boolean().default(false),
  createToken: z.boolean().default(false)
});

export async function takePaymentWithWorldpayHandler(params: z.infer<typeof paymentSchema>) {

  type PaymentRequest = components["schemas"]["PaymentRequest"];
  type PaymentsCardOnFileCustomerAgreement = components["schemas"]["PaymentsCardOnFileCustomerAgreement"];
  type TokenCreation = components["schemas"]["TokenCreation"];
  type CardPaymentsInstruction = components["schemas"]["CardPaymentsInstruction"];
  type PaymentsCardPlainPaymentInstrument = components["schemas"]["PaymentsCardPlainPaymentInstrument"];

  let paymentInstrument: PaymentsCardPlainPaymentInstrument = {
    type: "plain",
    cardNumber: params.cardNumber,
    cardHolderName: params.cardHolderName,
    expiryDate: {
      year: params.expiryYear,
      month: params.expiryMonth
    },
    cvc: params.cvc,
    billingAddress: {
      address1: params.address1,
      city: params.city,
      postalCode: params.postalCode,
      countryCode: params.countryCode
    }
  } as PaymentsCardPlainPaymentInstrument;

  let instruction: CardPaymentsInstruction = {
    method: "card",
    paymentInstrument: paymentInstrument,
    narrative: { line1: "MCP Payment" },
    value: {
      currency: params.currency,
      amount: params.amount
    }
  } as CardPaymentsInstruction;

  let paymentRequest: PaymentRequest = {
      transactionReference: `TR${Date.now()}`,
      merchant: { entity: "default" },
      channel: "moto",
      instruction: instruction
     
    } as PaymentRequest;


  if (params.storeCard) {
    let cit: PaymentsCardOnFileCustomerAgreement = {
      type: "cardOnFile",
      storedCardUsage: "first"
    };
    paymentRequest.instruction.customerAgreement = cit;
  }

  if (params.createToken) {
    let token: TokenCreation = {
      type: "worldpay"
    }
    paymentRequest.instruction.tokenCreation = token;
  }

  try {
    

    const response = await fetch('https://try.access.worldpay.com/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`).toString('base64')}`,
        'WP-Api-Version': '2024-06-01'
      },
      body: JSON.stringify(paymentRequest)
    });

    const result = await response.json();
    
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify(result)
      }]
    };
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text" as const,
        text: `Payment failed: ${(error as Error).message}`
      }]
    };
  }
}
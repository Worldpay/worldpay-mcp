import { z } from "zod";
import {
  BillingAddress,
  CardPaymentsInstruction,
  PaymentRequest,
  PaymentsCardOnFileCustomerAgreement,
  PaymentsResponse201,
  SessionPaymentInstrument,
  TokenCreation,
} from "../../types/payments";
import { paymentSchema } from "../../schemas/schemas";
import { logger } from "../../server.js";

const PAYMENTS_API_PATH = '/api/payments';

export async function takePayment(
  params: z.infer<typeof paymentSchema>
) {
  try {
    let paymentRequest: PaymentRequest = createRequest(params);

    logger.info(
      `Calling POST ${process.env.WORLDPAY_URL}${
        PAYMENTS_API_PATH
      } API with params: ${JSON.stringify(params)}`
    );

    const response = await fetch(
      `${process.env.WORLDPAY_URL}${PAYMENTS_API_PATH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`
          ).toString("base64")}`,
          "WP-Api-Version": "2024-06-01",
        },
        body: JSON.stringify(paymentRequest),
      }
    );

    if (response.status != 201 && response.status != 202) {
      throw new Error(
        `Payment failed with status ${response.status}: ${JSON.stringify(
          await response.json()
        )}`
      );
    }

    const result = (await response.json()) as PaymentsResponse201;

    logger.info(`Payment outcome: ${result.outcome}`);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result),
        },
      ],
    };
  } catch (error) {
    logger.error(`Payment error: ${(error as Error).message}`);
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: `Payment failed: ${(error as Error).message}`,
        },
      ],
    };
  }
}

function createRequest(params: z.infer<typeof paymentSchema>): PaymentRequest {
  let billingAddress: BillingAddress = {
    address1: params.address1,
    city: params.city,
    postalCode: params.postalCode,
    countryCode: params.countryCode,
  } as BillingAddress;

  let paymentInstrument: SessionPaymentInstrument = {
    type: "checkout",
    cardHolderName: params.cardHolderName,
    sessionHref: params.sessionHref,
    billingAddress: billingAddress,
  } as SessionPaymentInstrument;

  let instruction: CardPaymentsInstruction = {
    method: "card",
    paymentInstrument: paymentInstrument,
    narrative: { line1: "MCP Payment" },
    value: {
      currency: params.currency,
      amount: params.amount,
    },
  } as CardPaymentsInstruction;

  let paymentRequest: PaymentRequest = {
    transactionReference: `TR${Date.now()}`,
    merchant: { entity: "default" },
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

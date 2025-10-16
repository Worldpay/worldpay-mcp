import { z } from "zod";
import { hppSchema } from "../../schemas/schemas";
import { hppTransaction } from "../../types/hpp";
import { logger } from "../../server.js";
const HOSTED_PAYMENTS_PATH = "/payment_pages";

export async function createHPPTransation(params: z.infer<typeof hppSchema>) {
  let transaction: hppTransaction = {
    transactionReference: `TR${Date.now()}`,
    merchant: { entity: `${process.env.MERCHANT_ENTITY}` },
    expiry: 3600,
    narrative: { line1: "MCP Payment" },
    value: {
      amount: params.amount,
      currency: params.currency,
    },
  } as hppTransaction;

  try {

    logger.info(
      `Calling POST ${process.env.WORLDPAY_URL}${
        HOSTED_PAYMENTS_PATH
      } API with params: ${JSON.stringify(params)}`
    );

    const response = await fetch(
      `${process.env.WORLDPAY_URL}${HOSTED_PAYMENTS_PATH}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`
          ).toString("base64")}`,
          "Content-Type": "application/vnd.worldpay.payment_pages-v1.hal+json",
          Accept: "application/vnd.worldpay.payment_pages-v1.hal+json",
        },
        body: JSON.stringify(transaction),
      }
    );

    const result = await response.json();

    if (response.status != 200) {
      throw new Error(
        `Hosted payment transaction failed with status ${response.status}: ${JSON.stringify(
          result
        )}`
      );
    }

    logger.info(`Hosted payment transaction created successfully: ${result.url}`);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result),
        },
      ],
    };
  } catch (error) {
    logger.error(`Hosted error: ${(error as Error).message}`);
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: `Hosted Payment failed: ${(error as Error).message}`,
        },
      ],
    };
  }
}

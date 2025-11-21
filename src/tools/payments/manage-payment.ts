import { z } from "zod";
import { manageSchema } from "@/schemas/schemas";
import { logger } from "@/server";
import {MCPResponse} from "@/utils/mcp-response";

export async function managePayment(
  params: z.infer<typeof manageSchema>
) {
  try {

    logger.info(
      `Calling POST ${params.commandHref} API`
    );

    const response = await fetch(params.commandHref, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`
        ).toString("base64")}`,
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

    return {
      content: [
        MCPResponse.text(result)
      ],
    };
  } catch (error) {
    logger.error(`Payment error: ${(error as Error).message}`);
    return {
      isError: true,
      content: [
        MCPResponse.text(`Payment command failed: ${(error as Error).message}`)
      ],
    };
  }
}

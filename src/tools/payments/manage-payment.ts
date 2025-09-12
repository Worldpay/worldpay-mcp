import { z } from "zod";
import { manageSchema } from "../../schemas/schemas";

export async function managePaymentWithWorldpayHandler(
  params: z.infer<typeof manageSchema>
) {
  try {

    console.log(
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

    console.log('Payment command successful');
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result),
        },
      ],
    };
  } catch (error) {
    console.log(`Payment error: ${(error as Error).message}`);
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: `Payment command failed: ${(error as Error).message}`,
        },
      ],
    };
  }
}

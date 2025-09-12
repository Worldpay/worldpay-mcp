import { z } from "zod";
import { actionSchema } from "../../schemas/schemas";

export async function actionPaymentWithWorldpayHandler(
  params: z.infer<typeof actionSchema>
) {
  try {

    console.log(
      `Calling POST ${params.actionHref} API`
    );

    const response = await fetch(params.actionHref, {
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

    console.log('Payment action successful');
    
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
          text: `Payment action failed: ${(error as Error).message}`,
        },
      ],
    };
  }
}

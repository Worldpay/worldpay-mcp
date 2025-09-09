
import { z } from "zod";

export const actionSchema = z.object({
  actionName: z.string(),
  actionHref: z.string(),
});

export async function actionPaymentWithWorldpayHandler(params: z.infer<typeof actionSchema>) {

  try {

    const response = await fetch(params.actionHref, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`).toString('base64')}`,
        'WP-Api-Version': '2024-06-01'
      }
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
        text: `Payment action failed: ${(error as Error).message}`
      }]
    };
  }
}
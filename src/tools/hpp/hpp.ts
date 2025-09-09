
import { z } from "zod";
import { components } from "../../types/hpp";

export const hppSchema = z.object({
  amount: z.number(),
  currency: z.string().default("GBP")
});

export async function createHPPTransation(params: z.infer<typeof hppSchema>) {

  type hppTransaction = components["schemas"]["Transaction"];

  let transaction: hppTransaction = {
    transactionReference: `TR${Date.now()}`,
    merchant: { entity: "default" },
    expiry: 3600,
    narrative: { line1: "MCP Payment" },
    value: {
      amount: params.amount,
      currency: params.currency
    },
    threeDS:{
      type: "disabled"
    }

  } as hppTransaction;
  
  try {
    

    const response = await fetch('https://try.access.worldpay.com/payment_pages', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`).toString('base64')}`,
        'Content-Type': 'application/vnd.worldpay.payment_pages-v1.hal+json',
        'Accept': 'application/vnd.worldpay.payment_pages-v1.hal+json'
      },
      body: JSON.stringify(transaction)
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
        text: `Hosted Payment failed: ${(error as Error).message}`
      }]
    };
  }
}
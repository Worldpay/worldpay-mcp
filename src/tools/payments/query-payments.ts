import { z } from "zod";

export const paymentQuerySchema = 
    z.object({

    startDate: z.string().optional().describe("Start date for the query in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)"),
    endDate: z.string().optional().describe("End date for the query in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)"),
    pageSize: z.number().optional().default(20),
    transactionReference: z.string().optional().describe("Transaction reference to filter payments by specific transaction, if provided do not pass in other parameters"),
    })


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



/**
 * Handler for the TakePaymentWithWorldpay tool. Register this with server.registerTool in your main server file.
 */
export async function queryPaymentsWithWorldpayHandler(params: z.infer<typeof paymentQuerySchema>) {
  try {

    let queryParams = new URLSearchParams();
    if (params.transactionReference)  {
      queryParams = new URLSearchParams({
        transactionReference: params.transactionReference
      });
    } else {
      queryParams = new URLSearchParams({
        startDate: params.startDate ? params.startDate : '',
        endDate: params.endDate ? params.endDate : '',
        pageSize: params.pageSize ? params.pageSize.toString() : ''
      });
    }
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
        return {
            content: [{
                type: "text" as const,
                text: JSON.stringify(payments)
            }]
        };
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text" as const,
        text: `Query failed: ${(error as Error).message}`
      }]
    };
  }
}


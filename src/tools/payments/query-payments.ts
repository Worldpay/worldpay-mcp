import { z } from "zod";
import { QueryResponse } from "../../types/payments";
import { paymentQuerySchema } from "../../schemas/schemas";

export async function queryPaymentsWithWorldpayHandler(
  params: z.infer<typeof paymentQuerySchema>
) {
  try {
    let queryParams = new URLSearchParams();
    if (params.transactionReference) {
      queryParams = new URLSearchParams({
        transactionReference: params.transactionReference,
      });
    } else {
      queryParams = new URLSearchParams({
        startDate: params.startDate ? params.startDate : "",
        endDate: params.endDate ? params.endDate : "",
        pageSize: params.pageSize ? params.pageSize.toString() : "",
      });
    }

    console.log(
      `Calling GET ${process.env.WORLDPAY_URL}${
        process.env.QUERY_API_PATH
      } API with params: ${JSON.stringify(params)}`
    );

    const response = await fetch(
      `${process.env.WORLDPAY_URL}${process.env.QUERY_API_PATH}?${queryParams}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.worldpay.payment-queries-v1.hal+json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`
          ).toString("base64")}`,
        },
      }
    );

    if (response.status != 200) {
      throw new Error(
        `Payment Query failed with status ${response.status}: ${JSON.stringify(
          await response.json()
        )}`
      );
    }

    const result = (await response.json()) as QueryResponse;
    console.log(`Query successful: ${result._embedded.payments.length} payments found.`);
    
    const payments = result._embedded?.payments || [];
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(payments),
        },
      ],
    };
  } catch (error) {
    console.log(`Query error: ${(error as Error).message}`);
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: `Query failed: ${(error as Error).message}`,
        },
      ],
    };
  }
}

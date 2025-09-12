import { z } from "zod";
import { QueryResponse } from "../../types/payments";
import {
  paymentDateQuerySchema,
  paymentIdQuerySchema,
  paymentTxnRefQuerySchema,
} from "../../schemas/schemas";

export async function queryPaymentsByDateWithWorldpayHandler(
  params: z.infer<typeof paymentDateQuerySchema>
) {
  let queryParams = new URLSearchParams({
    startDate: params.startDate ? params.startDate : "",
    endDate: params.endDate ? params.endDate : "",
    pageSize: params.pageSize ? params.pageSize.toString() : "",
  });
  return callQueryAPIWithParams(queryParams);
}

export async function queryPaymentsByTxRefHandler(
  params: z.infer<typeof paymentTxnRefQuerySchema>
) {
  let queryParams = new URLSearchParams({
    transactionReference: params.transactionReference
      ? params.transactionReference
      : ""
  });
  return callQueryAPIWithParams(queryParams);
}

export async function queryPaymentsByIdHandler(
  params: z.infer<typeof paymentIdQuerySchema>
) {
  return callQueryAPI(
    `${process.env.WORLDPAY_URL}${process.env.QUERY_API_PATH}/${params.paymentId}`
  );
}

async function callQueryAPIWithParams(queryParams: URLSearchParams) {
  return callQueryAPI(
    `${process.env.WORLDPAY_URL}${process.env.QUERY_API_PATH}?${queryParams}`
  );
}

async function callQueryAPI(path: string) {
  try {
    console.log(`Calling GET ${path})}`);

    const response = await fetch(path, {
      method: "GET",
      headers: {
        Accept: "application/vnd.worldpay.payment-queries-v1.hal+json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`
        ).toString("base64")}`,
      },
    });

    if (response.status != 200) {
      throw new Error(
        `Payment Query failed with status ${response.status}: ${JSON.stringify(
          await response.json()
        )}`
      );
    }

    const result = await response.json();

    if (result._embedded) {
      console.log(
        `Query successful: ${result._embedded.payments.length} payments found.`
      );
      const payments = result._embedded?.payments || [];
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(payments),
          },
        ],
      };
    } else {
      console.log("Query successful, payment found.");
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
      };
    }


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

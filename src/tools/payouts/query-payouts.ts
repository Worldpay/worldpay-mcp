import { z } from "zod";
import { logger } from "../../server.js";
import { accountPayoutQuerySchema } from "../../schemas/schemas.js";

const QUERY_API_PATH = "/accountPayouts/events";

export async function queryAccountPayouts(
  params: z.infer<typeof accountPayoutQuerySchema>
) {
  const queryParams = new URLSearchParams();

  if (params.startDate) queryParams.set("startDate", params.startDate);
  if (params.endDate) queryParams.set("endDate", params.endDate);
  if (params.pageSize) queryParams.set("pageSize", params.pageSize.toString());
  if (params.narrative) queryParams.set("narrative", params.narrative);
  if (params.transactionReference)
    queryParams.set("transactionReference", params.transactionReference);
  if (params.accountNumber)
    queryParams.set("accountNumber", params.accountNumber);
  if (params.payoutInstrumentId)
    queryParams.set("payoutInstrumentId", params.payoutInstrumentId);
  if (params.payoutInstrumentReference)
    queryParams.set(
      "payoutInstrumentReference",
      params.payoutInstrumentReference
    );
  if (process.env.MERCHANT_ENTITY)
    queryParams.set("entity", process.env.MERCHANT_ENTITY);
  if (params.countryCode) queryParams.set("countryCode", params.countryCode);
  if (params.pageNumber)
    queryParams.set("pageNumber", params.pageNumber.toString());
  if (params.paymentState) queryParams.set("paymentState", params.paymentState);
  if (params.payeeName) queryParams.set("payeeName", params.payeeName);
  if (params.sourceCurrency)
    queryParams.set("sourceCurrency", params.sourceCurrency);
  if (params.sourceAmount)
    queryParams.set("sourceAmount", params.sourceAmount.toString());
  if (params.targetCurrency)
    queryParams.set("targetCurrency", params.targetCurrency);
  if (params.targetAmount)
    queryParams.set("targetAmount", params.targetAmount.toString());
  return callQueryAPIWithParams(queryParams);
}

async function callQueryAPIWithParams(queryParams: URLSearchParams) {
  try {
    logger.info(`Calling GET ${QUERY_API_PATH}?${queryParams}`);

    const response = await fetch(`${process.env.WORLDPAY_URL}${QUERY_API_PATH}?${queryParams}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "WP-Api-Version": "2025-01-01",
        Authorization: `Basic ${Buffer.from(
          `${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`
        ).toString("base64")}`,
      },
    });

    if (response.status != 200) {
      throw new Error(
        `Payout Query failed with status ${response.status}: ${JSON.stringify(
          await response.json()
        )}`
      );
    }

    const result = await response.json();

    if (result.items.length > 0) {
      logger.info(`Query successful: ${result.items.length} payout(s) found.`);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result.items),
          },
        ],
      };
    } else {
      logger.info("Query returned no payouts");
      return {
        content: [
          {
            type: "text" as const,
            text: "No payouts found for the given criteria.",
          },
        ],
      };
    }
  } catch (error) {
    logger.error(`Query error: ${(error as Error).message}`);
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

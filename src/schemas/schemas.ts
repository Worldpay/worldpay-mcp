import { z } from "zod";

export const hppSchema = z.object({
  amount: z.number(),
  currency: z.string().default("GBP"),
});

export const paymentSchema = z.object({
  cardHolderName: z.string(),
  sessionHref: z.string().describe("Sessions url from Checkout SDK"),
  amount: z.number(),
  currency: z.string().default("GBP"),
  address1: z.string(),
  city: z.string(),
  postalCode: z.string().optional(),
  countryCode: z.string(),
  storeCard: z.boolean().default(false),
  createToken: z.boolean().default(false),
});

export const paymentQuerySchema = z.object({
  startDate: z
    .string()
    .optional()
    .describe(
      "Start date for the query in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)"
    ),
  endDate: z
    .string()
    .optional()
    .describe(
      "End date for the query in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)"
    ),
  pageSize: z.number().optional().default(20),
  transactionReference: z
    .string()
    .optional()
    .describe(
      "Transaction reference to filter payments by specific transaction, if provided do not pass in other parameters"
    ),
});
export const actionSchema = z.object({
  actionName: z.string(),
  actionHref: z.string(),
});
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

export const tokenSchema = z.object({
  cardHolderName: z.string(),
  sessionHref: z.string().describe("Sessions url from Checkout SDK"),
  currency: z.string().default("GBP"),
  address1: z.string(),
  city: z.string(),
  postalCode: z.string(),
  countryCode: z.string().describe("ISO 3166-1 alpha-2 country code, upper case"),
  shopperId: z.string().optional(),
});

export const paymentDateQuerySchema = z.object({
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
});

export const paymentTxnRefQuerySchema = z.object({
  transactionReference: z
    .string()
    .optional()
    .describe(
      "Transaction reference to filter payments by"
    ),
    pageSize: z.number().optional().default(20),
});

export const paymentIdQuerySchema = z.object({
    paymentId: z
        .string()
        .optional()
        .describe("Payment ID to filter payments by")
});

export const manageSchema = z.object({
  commandName: z.string(),
  commandHref: z.string(),
});

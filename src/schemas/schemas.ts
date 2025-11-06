import { z } from "zod";

export const hppSchema = z.object({
  amount: z.number(),
  currency: z.string().default("GBP"),
});

export const paymentSchema = z.object({
  cardHolderName: z.string(),
  sessionHref: z.string().describe("Optional Sessions url from Checkout SDK (provide either a sessionHref or tokenHref, never both)").optional(),
  tokenHref: z.string().describe("Token url from stored card (provide either a sessionHref or tokenHref, never both)").optional(),
  cvc: z.string().describe("Optional CVC (Provide a value in cvcSessionHref or cvc, never both.)").optional(),
  cvcSessionHref: z.string().describe("Optional CVC session url from Checkout SDK (Provide a value in cvcSessionHref or cvc, never both. Only supply if using tokenHref)").optional(),
  amount: z.number(),
  currency: z.string().default("GBP"),
  address1: z.string(),
  city: z.string(),
  postalCode: z.string().optional(),
  countryCode: z.string(),
  storeCard: z.boolean().default(false),
  createToken: z.boolean().default(false),
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
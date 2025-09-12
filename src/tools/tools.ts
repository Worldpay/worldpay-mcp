import { server } from "../server.js";
import { takePaymentWithWorldpayHandler } from "./payments/take-payment.js";
import { queryPaymentsByDateWithWorldpayHandler, queryPaymentsByIdHandler, queryPaymentsByTxRefHandler } from "./payments/query-payments.js";
import { managePaymentWithWorldpayHandler } from "./payments/manage-payment.js";
import { createHPPTransation } from "./hpp/hpp.js";
import {
  manageSchema,
  hppSchema,
  paymentDateQuerySchema,
  paymentSchema,
  paymentTxnRefQuerySchema,
  paymentIdQuerySchema,
} from "../schemas/schemas.js";

server.registerTool(
  "takePaymentWithWorldpay",
  {
    title: "Take Payment with Worldpay",
    description: "Take a one time card payment using the Worldpay Payments API",
    inputSchema: paymentSchema.shape,
  },
  (params, _extra) => takePaymentWithWorldpayHandler(params)
);

server.registerTool(
  "managePaymentWithWorldpay",
  {
    title: "Manage Payment with Worldpay",
    description: "Perform following payment commands using action links",
    inputSchema: manageSchema.shape,
  },
  (params, _extra) => managePaymentWithWorldpayHandler(params)
);

server.registerTool(
  "queryPaymentsByDateWithWorldpay",
  {
    title: "Query Payments made with Worldpay by date range",
    description:
      "Query all payments within a given date and time range",
    inputSchema: paymentDateQuerySchema.shape,
  },
  (params, _extra) => queryPaymentsByDateWithWorldpayHandler(params)
);

server.registerTool(
  "queryPaymentsByTransactionReferenceWithWorldpay",
  {
    title: "Query Payments made with Worldpay by transaction reference",
    description:
      "Query all payments using a given transaction reference",
    inputSchema: paymentTxnRefQuerySchema.shape,
  },
  (params, _extra) => queryPaymentsByTxRefHandler(params)
);

server.registerTool(
  "queryPaymentIdWithWorldpay",
  {
    title: "Retrieve specific payment by payment Id",
    description:
      "Retrieve specific payment by payment Id",
    inputSchema: paymentIdQuerySchema.shape,
  },
  (params, _extra) => queryPaymentsByIdHandler(params)
);

server.registerTool(
  "createHostedPaymentTransaction",
  {
    title: "Create Hosted Payment",
    description:
      "Create a hosted payment page for a specific amount and currency",
    inputSchema: hppSchema.shape,
  },
  (params, _extra) => createHPPTransation(params)
);

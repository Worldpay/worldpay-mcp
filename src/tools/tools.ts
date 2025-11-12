import { server } from "../server.js";
import { takePayment } from "./payments/take-payment.js";
import {
  queryPaymentsByDate,
  queryPaymentsByIdHandler,
  queryPaymentsByTxRefHandler,
} from "./payments/query-payments.js";
import { managePayment } from "./payments/manage-payment.js";
import { createHPPTransation } from "./hpp/hpp.js";
import {
  manageSchema,
  hppSchema,
  paymentDateQuerySchema,
  paymentSchema,
  paymentTxnRefQuerySchema,
  paymentIdQuerySchema,
  accountPayoutQuerySchema,
} from "../schemas/schemas.js";
import { queryAccountPayouts } from "./payouts/query-payouts.js";

server.registerTool(
  "take_guest_payment",
  {
    title: "Take Guest Payment",
    description: "Take a guest payment using session or worldpay token",
    inputSchema: paymentSchema.shape,
  },
  (params, _extra) => takePayment(params)
);

server.registerTool(
  "create_worldpay_token",
  {
    title: "Create Worldpay Token without Payment",
    description:
      "Create a worldpay token using a session. The amount must be 0, storeCard must be true, and to avoid the PCI implications of storing card numbers set createToken to true.",
    inputSchema: paymentSchema.shape,
  },
  (params, _extra) => takePayment(params)
);

server.registerTool(
  "manage_payment",
  {
    title: "Manage Payment",
    description:
      "Perform actions on a payment after authorization such as refund, cancel and settle",
    inputSchema: manageSchema.shape,
  },
  (params, _extra) => managePayment(params)
);

server.registerTool(
  "query_payments_by_date",
  {
    title: "Query Payments made with Worldpay by date range",
    description: "Query all payments within a given date and time range",
    inputSchema: paymentDateQuerySchema.shape,
  },
  (params, _extra) => queryPaymentsByDate(params)
);

server.registerTool(
  "query_payments_by_transaction_reference",
  {
    title: "Query Payments made with Worldpay by transaction reference",
    description: "Query all payments using a given transaction reference",
    inputSchema: paymentTxnRefQuerySchema.shape,
  },
  (params, _extra) => queryPaymentsByTxRefHandler(params)
);

server.registerTool(
  "query_payment_by_id",
  {
    title: "Retrieve specific payment by payment Id",
    description: "Retrieve specific payment by payment Id",
    inputSchema: paymentIdQuerySchema.shape,
  },
  (params, _extra) => queryPaymentsByIdHandler(params)
);

server.registerTool(
  "create_hosted_payment",
  {
    title: "Create Hosted Payment",
    description: "Create a hosted payment page link to send to customers",
    inputSchema: hppSchema.shape,
  },
  (params, _extra) => createHPPTransation(params)
);

server.registerTool(
  "query_account_payouts",
  {
    title: "Query Account Payouts",
    description: "Query for payouts made through Worldpay",
    inputSchema: accountPayoutQuerySchema.shape,
  },
  (params, _extra) => queryAccountPayouts(params)
);

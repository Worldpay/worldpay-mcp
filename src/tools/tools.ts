import { server } from "../server.js";
import { takePaymentWithWorldpayHandler } from "./payments/take-payment.js";
import { queryPaymentsWithWorldpayHandler } from "./payments/query-payments.js";
import { managePaymentWithWorldpayHandler } from "./payments/manage-payment.js";
import { createHPPTransation } from "./hpp/hpp.js";
import {
  manageSchema,
  hppSchema,
  paymentQuerySchema,
  paymentSchema,
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
  "queryPaymentsWithWorldpay",
  {
    title: "Query Payments made with Worldpay",
    description:
      "Query all payments within a given date and time range, optionally filtered by currency",
    inputSchema: paymentQuerySchema.shape,
  },
  (params, _extra) => queryPaymentsWithWorldpayHandler(params)
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

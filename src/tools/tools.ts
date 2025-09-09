import { server } from "../server.js";
import { takePaymentWithWorldpayHandler, paymentSchema } from "./payments/take-payment.js";
import { paymentQuerySchema, queryPaymentsWithWorldpayHandler } from "./payments/query-payments.js";
import { actionSchema, actionPaymentWithWorldpayHandler } from "./payments/action-payment.js";
import { createHPPTransation, hppSchema } from "./hpp/hpp.js";

server.registerTool(
  "takePaymentWithWorldpay",
  {
    title: "Take Payment with Worldpay",
    description: "Take a one time card payment using the Worldpay Payments API",
    inputSchema: paymentSchema.shape
  },
  (params, _extra) => takePaymentWithWorldpayHandler(params)
);


server.registerTool(
  "actionPaymentWithWorldpay",
  {
    title: "Action Payment with Worldpay",
    description: "Perform following payment actions using action links",
    inputSchema: actionSchema.shape
  },
  (params, _extra) => actionPaymentWithWorldpayHandler(params)
);

server.registerTool(
  "queryPaymentsWithWorldpay",
  {
    title: "Query Payments made with Worldpay",
    description: "Query all payments within a given date and time range, optionally filtered by currency",
    inputSchema: paymentQuerySchema.shape
  },
  (params, _extra) => queryPaymentsWithWorldpayHandler(params)
);


server.registerTool(
  "createHostedPaymentTransaction",
  {
    title: "Create Hosted Payment",
    description: "Create a hosted payment page for a specific amount and currency",
    inputSchema: hppSchema.shape
  },
  (params, _extra) => createHPPTransation(params)
);


import {WorldpayAPI} from "@/api/worldpay";
import {MCPTool} from "@/tools/mcp-tool";
import {hppSchema} from "@/schemas/schemas";
import {z} from "zod";
import {hppTransaction} from "@/types/hpp";
import {logger} from "@/utils/logger";
import {MCPResponse, ToolCallResponse, ToolCallResponseError} from "@/utils/mcp-response";
import {CallToolResult} from "@modelcontextprotocol/sdk/types";

//TODO: this should live on the sdk WorldpayAPI
const HOSTED_PAYMENTS_PATH = "/payment_pages";

export class CreateHPPTransaction extends MCPTool {
  constructor(api: WorldpayAPI) {
    super(
      api,
      "create_hosted_payment",
      "Create Hosted Payment",
      "Create a hosted payment page link to send to customers",
      hppSchema.shape,
    );
  }

  async execute(args: z.infer<typeof hppSchema>): Promise<CallToolResult> {
    //TODO: move this logic to WorldpayAPI method
    let transaction: hppTransaction = {
      transactionReference: `TR${Date.now()}`,
      merchant: {entity: `${process.env.MERCHANT_ENTITY}`},
      expiry: 3600,
      narrative: {line1: "MCP Payment"},
      value: {
        amount: args.amount,
        currency: args.currency,
      },
    } as hppTransaction;

    try {

      logger.info(
        `Calling POST ${process.env.WORLDPAY_URL}${
          HOSTED_PAYMENTS_PATH
        } API with args: ${JSON.stringify(args)}`
      );

      const response = await fetch(
        `${process.env.WORLDPAY_URL}${HOSTED_PAYMENTS_PATH}`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`
            ).toString("base64")}`,
            "Content-Type": "application/vnd.worldpay.payment_pages-v1.hal+json",
            Accept: "application/vnd.worldpay.payment_pages-v1.hal+json",
          },
          body: JSON.stringify(transaction),
        }
      );

      const result = await response.json();

      if (response.status != 200) {
        throw new Error(
          `Hosted payment transaction failed with status ${response.status}: ${JSON.stringify(
            result
          )}`
        );
      }

      logger.info(`Hosted payment transaction created successfully`);

      return new ToolCallResponse(MCPResponse.text(result))
    } catch (error) {
      logger.error(`Hosted error: ${(error as Error).message}`);
      return new ToolCallResponseError(MCPResponse.text(`Hosted Payment failed: ${(error as Error).message}`))
    }
  }
}

import {WorldpayAPI} from "@/api/worldpay";
import {MCPTool} from "@/tools/mcp-tool";
import {paymentTxnRefQuerySchema} from "@/schemas/schemas";
import {z} from "zod";
import {logger} from "@/utils/logger";
import {MCPResponse, ToolCallResponse, ToolCallResponseError} from "@/utils/mcp-response";
import {CallToolResult} from "@modelcontextprotocol/sdk/types";

export class QueryPaymentByTxRef extends MCPTool {
  constructor(api: WorldpayAPI) {
    super(
      api,
      "query_payments_by_transaction_reference",
      "Query Payments made with Worldpay by transaction reference",
      "Query all payments using a given transaction reference",
      paymentTxnRefQuerySchema.shape,
    );
  }

  async execute(args: z.infer<typeof paymentTxnRefQuerySchema>): Promise<CallToolResult> {
    try {
      const response = await this.api.queryPaymentsByTxRefHandler(args);
      return new ToolCallResponse(MCPResponse.text(response))
    } catch (error) {
      logger.error(`Query error: ${(error as Error).message}`);
      return new ToolCallResponseError(MCPResponse.text(`Query failed: ${(error as Error).message}`))
    }
  }
}

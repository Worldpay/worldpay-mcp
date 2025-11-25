import {WorldpayAPI} from "@/api/worldpay";
import {MCPTool} from "@/tools/mcp-tool";
import {paymentDateQuerySchema} from "@/schemas/schemas";
import {z} from "zod";
import {logger} from "@/utils/logger";
import {MCPResponse, ToolCallResponse, ToolCallResponseError} from "@/utils/mcp-response";
import {CallToolResult} from "@modelcontextprotocol/sdk/types";

export class QueryPaymentByDate extends MCPTool {
  constructor(api: WorldpayAPI) {
    super(
      api,
      "query_payments_by_date",
      "Query Payments made with Worldpay by date range",
      "Query all payments within a given date and time range",
      paymentDateQuerySchema.shape,
    );
  }

  async execute(args: z.infer<typeof paymentDateQuerySchema>): Promise<CallToolResult> {
    try {
      const response = await this.api.queryPaymentsByDate(args);
      return new ToolCallResponse(MCPResponse.text(response))
    } catch (error) {
      logger.error(`Query error: ${(error as Error).message}`);
      return new ToolCallResponseError(MCPResponse.text(`Query failed: ${(error as Error).message}`))
    }
  }
}

import {WorldpayAPI} from "@/api/worldpay";
import {MCPTool} from "@/tools/mcp-tool";
import {paymentIdQuerySchema} from "@/schemas/schemas";
import {z} from "zod";
import {logger} from "@/utils/logger";
import {MCPResponse, ToolCallResponse, ToolCallResponseError} from "@/utils/mcp-response";
import {CallToolResult} from "@modelcontextprotocol/sdk/types";

export class QueryPaymentById extends MCPTool {
  constructor(api: WorldpayAPI) {
    super(
      api,
      "query_payment_by_id",
      "Retrieve specific payment by payment Id",
      "Retrieve specific payment by payment Id",
      paymentIdQuerySchema.shape,
    );
  }

  async execute(args: z.infer<typeof paymentIdQuerySchema>): Promise<CallToolResult> {
    try {
      const response = await this.api.queryPaymentsByIdHandler(args.paymentId);
      return new ToolCallResponse(MCPResponse.text(response))
    } catch (error) {
      logger.error(`Query error: ${(error as Error).message}`);
      return new ToolCallResponseError(MCPResponse.text(`Query failed: ${(error as Error).message}`))
    }
  }
}

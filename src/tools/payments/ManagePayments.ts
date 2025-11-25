import {WorldpayAPI} from "@/api/worldpay";
import {MCPTool} from "@/tools/mcp-tool";
import {manageSchema} from "@/schemas/schemas";
import {z} from "zod";
import {logger} from "@/utils/logger";
import {MCPResponse, ToolCallResponse, ToolCallResponseError} from "@/utils/mcp-response";
import {CallToolResult} from "@modelcontextprotocol/sdk/types";

export class ManagePayments extends MCPTool {
  constructor(api: WorldpayAPI) {
    super(
      api,
      "manage_payment",
      "Manage Payment",
      "Perform actions on a payment after authorization such as refund, cancel and settle",
      manageSchema.shape,
    );
  }

  async execute(args: z.infer<typeof manageSchema>): Promise<CallToolResult> {
    try {
      const response = await this.api.managePayment(args);
      return new ToolCallResponse(MCPResponse.text(response))
    } catch (error) {
      logger.error(`Payment error: ${(error as Error).message}`);
      return new ToolCallResponseError(MCPResponse.text(`Payment command failed: ${(error as Error).message}`))
    }
  }
}

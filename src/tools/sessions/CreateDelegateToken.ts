import {WorldpayAPI} from "@/api/worldpay";
import {MCPTool} from "@/tools/mcp-tool";
import {delegateTokenSchema} from "@/schemas/schemas";
import {MCPResponse, ToolCallResponse, ToolCallResponseError} from "@/utils/mcp-response";
import {logger} from "@/utils/logger";
import {CallToolResult} from "@modelcontextprotocol/sdk/types";
import {z} from "zod";

export class CreateDelegateToken extends MCPTool {
  constructor(api: WorldpayAPI) {
    super(
      api,
      "create_delegate_token",
      "Create Delegate Token",
      "Create a ACP delegate payment token for use in ACP checkout sessions",
      delegateTokenSchema.shape,
    );
  }

  async execute(args: z.infer<typeof delegateTokenSchema>): Promise<CallToolResult> {
    try {
      const response = await this.api.createDelegateToken(args);
      return new ToolCallResponse(MCPResponse.text(response))
    } catch (error) {
      logger.error(`Delegate token error: ${(error as Error).message}`);
      return new ToolCallResponseError(MCPResponse.text(`Delegate token failed: ${(error as Error).message}`));
    }
  }
}
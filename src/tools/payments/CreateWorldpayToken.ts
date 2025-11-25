import {WorldpayAPI} from "@/api/worldpay";
import {MCPTool} from "@/tools/mcp-tool";
import {paymentSchema} from "@/schemas/schemas";
import {z} from "zod";
import {logger} from "@/utils/logger";
import {MCPResponse, ToolCallResponse, ToolCallResponseError} from "@/utils/mcp-response";
import {CallToolResult} from "@modelcontextprotocol/sdk/types";

export class CreateWorldpayToken extends MCPTool {
  constructor(api: WorldpayAPI) {
    super(
      api,
      "create_worldpay_token",
      "Create Worldpay Token without Payment",
      "Create a worldpay token using a session. The amount must be 0, storeCard must be true, and to avoid the PCI implications of storing card numbers set createToken to true.",
      paymentSchema.shape,
    );
  }

  async execute(args: z.infer<typeof paymentSchema>): Promise<CallToolResult> {
    try {
      const response = await this.api.takeGuestPayment(args);
      return new ToolCallResponse(MCPResponse.text(response))
    } catch (error) {
      logger.error(`Payment error: ${(error as Error).message}`);
      return new ToolCallResponseError(MCPResponse.text(`Payment failed: ${(error as Error).message}`));
    }
  }
}

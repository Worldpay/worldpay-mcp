import {WorldpayAPI} from "@/api/worldpay";
import {MCPTool} from "@/tools/mcp-tool";
import {paymentSchema} from "@/schemas/schemas";
import {z} from "zod";
import {logger} from "@/utils/logger";
import {MCPResponse, ToolCallResponse, ToolCallResponseError} from "@/utils/mcp-response";
import {CallToolResult} from "@modelcontextprotocol/sdk/types";

export class TakeGuestPayment extends MCPTool {
  constructor(api: WorldpayAPI) {
    super(
      api,
      "take_guest_payment",
      "Take Guest Payment",
      "Take a guest payment using session or worldpay token",
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

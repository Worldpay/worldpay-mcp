import {WorldpayAPI} from "@/api/worldpay";
import {MCPTool} from "@/tools/mcp-tool";
import {z} from "zod";
import {logger} from "@/utils/logger";
import {MCPResponse, ToolCallResponse, ToolCallResponseError} from "@/utils/mcp-response";
import {CallToolResult} from "@modelcontextprotocol/sdk/types";
import {accountPayoutQuerySchema} from "@/schemas/schemas";

export class QueryAccountPayouts extends MCPTool {
  constructor(api: WorldpayAPI) {
    super(
      api,
      "query_account_payouts",
      "Query Account Payouts",
      "Query for payouts made through Worldpay",
      accountPayoutQuerySchema.shape,
    );
  }

  async execute(args: z.infer<typeof accountPayoutQuerySchema>): Promise<CallToolResult> {
    try {
      const response = await this.api.queryAccountPayouts(args);

      if (response.items.length > 0) {
        logger.info(`Query successful: ${response.items.length} payout(s) found.`);
        return new ToolCallResponse(MCPResponse.text(response))
      } else {
        logger.info("Query returned no payouts");
        return new ToolCallResponse(MCPResponse.text("No payouts found for the given criteria."))
      }
    } catch (error) {
      logger.error(`Payment error: ${(error as Error).message}`);
      return new ToolCallResponseError(MCPResponse.text(`Payment failed: ${(error as Error).message}`));
    }
  }
}

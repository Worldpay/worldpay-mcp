import {WorldpayAPI} from "@/api/worldpay";
import {MCPTool} from "@/tools/mcp-tool";
import {delegateTokenSchema} from "@/schemas/schemas";
import {z} from "zod";
import {logger} from "@/utils/logger";
import {MCPResponse, ToolCallResponse, ToolCallResponseError} from "@/utils/mcp-response";
import {CallToolResult} from "@modelcontextprotocol/sdk/types";
import type {components} from "@/types/sessions-api.d.ts";

//TODO: this should live on the sdk WorldpayAPI
const DELEGATE_TOKEN_PATH = "/sessions/agentic_commerce/delegate_payment";

type DelegatePaymentRequest = components["schemas"]["DelegatePaymentRequest"];

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
    //TODO: move this logic to WorldpayAPI method
    let request: DelegatePaymentRequest = {
      ...args
    } as DelegatePaymentRequest;

    try {

      logger.info(
        `Calling POST ${process.env.WORLDPAY_URL}${
          DELEGATE_TOKEN_PATH
        } API with args: ${JSON.stringify(args)}`
      );

      const response = await fetch(
        `${process.env.WORLDPAY_URL}${DELEGATE_TOKEN_PATH}`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`
            ).toString("base64")}`,
            "Content-Type": "application/json",
            "API-Version": "2025-09-29",
            Accept: "application/json",
          },
          body: JSON.stringify(request),
        }
      );

      const result = await response.json();

      if (response.status != 201) {
        throw new Error(
          `Creating a Delegate Token failed with status ${response.status}: ${JSON.stringify(
            result
          )}`
        );
      }

      logger.info(`Created a Delegate Token successfully`);

      return new ToolCallResponse(MCPResponse.text(result))
    } catch (error) {
      logger.error(`Delegate Token creation error: ${(error as Error).message}`);
      return new ToolCallResponseError(MCPResponse.text(`Delegate Token creation failed: ${(error as Error).message}`))
    }
  }
}

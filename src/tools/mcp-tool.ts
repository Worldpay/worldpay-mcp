import {WorldpayAPI} from "@/api/worldpay";
import {ZodRawShape} from "zod";
import {CallToolResult} from "@modelcontextprotocol/sdk/types";

export interface ToolDefinition {
  title?: string | undefined;
  description?: string | undefined;
  inputSchema?: ZodRawShape | undefined;
  outputSchema?: ZodRawShape | undefined;
  annotations?: {
    [x: string]: unknown;
    title?: string | undefined;
    readOnlyHint?: boolean | undefined;
    destructiveHint?: boolean | undefined;
    idempotentHint?: boolean | undefined;
    openWorldHint?: boolean | undefined;
  } | undefined;
  _meta?: Record<string, string> | undefined;
}

export interface Tool {
  getName(): string;

  getDefinition(): ToolDefinition;

  execute(args: any): Promise<CallToolResult>;
}

export abstract class MCPTool implements Tool {
  protected name: string;
  readonly title: string;
  readonly description: string;
  readonly inputSchema: ZodRawShape;
  protected api: WorldpayAPI;

  protected constructor(api: WorldpayAPI, name: string, title: string, description: string, inputSchema: ZodRawShape) {
    this.api = api;
    this.name = name;
    this.title = title;
    this.description = description;
    this.inputSchema = inputSchema;
  }

  getName(): string {
    return this.name;
  }

  getDefinition(): ToolDefinition {
    return {
      title: this.title,
      description: this.description,
      inputSchema: this.inputSchema,
    };
  }

  abstract execute(args: any): Promise<CallToolResult>;
}

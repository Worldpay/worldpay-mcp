import {CallToolResult, ContentBlock, TextContent} from "@modelcontextprotocol/sdk/types";

export class MCPResponse {
  /**
   * Create a TextContent item from data.
   * @param data the serializable object.
   * See: https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool-result
   */
  static text(data: unknown): TextContent {
    return {
      type: 'text',
      text: JSON.stringify(data),
    };
  }
}

export class ToolCallResponse implements CallToolResult{
  [x: string]: unknown;
  content: ContentBlock[];

  constructor(content: ContentBlock | ContentBlock[]) {
    this.content = Array.isArray(content) ? content : [content];
  }
}

export class ToolCallResponseError extends ToolCallResponse {
  isError?: boolean | undefined;

  constructor(content: ContentBlock | ContentBlock[]) {
    super(content);
    this.isError = true
  }
}

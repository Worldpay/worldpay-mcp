import {ContentAnnotations, TextContent} from "../types/mcp";

export class MCPResponse {
  /**
   * Create a TextContent item from data.
   * @param data the serializable object.
   * @param annotations Optional metadata describing audience, priority, etc.
   * See: https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool-result
   */
  static text(data: unknown, annotations?: ContentAnnotations): TextContent {
    return {
      type: 'text',
      text: JSON.stringify(data),
      annotations,
    };
  }
}

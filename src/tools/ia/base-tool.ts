// import {McpServer, RegisteredTool} from "@modelcontextprotocol/sdk/dist/esm/server/mcp.js";

import { McpServer, RegisteredTool } from '@modelcontextprotocol/sdk/server/mcp.js';

export abstract class BaseTool {
  static name: string;
  static description: string;
  static inputSchema: any;

  static register(server: McpServer): RegisteredTool {
    // @ts-ignore
    return server.tool(
      this.name,
      this.description,
      this.inputSchema,
      this.handle.bind(this)
    );
  }

  static async handle(
    params: any,
    extra?: any
  ): Promise<any> {
    throw new Error('handle() must be implemented in subclass');
  }
}

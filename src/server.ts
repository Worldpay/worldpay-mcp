import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Create an MCP server with all capabilities
export const server = new McpServer({
    name: "Worldpay",
    version: "1.0.0"
});
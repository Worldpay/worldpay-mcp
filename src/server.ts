import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import "dotenv/config";

export const server = new McpServer({
  name: "Worldpay",
  version: "1.0.0",
});

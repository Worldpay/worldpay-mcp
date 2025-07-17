import addTool_startTest from "./start-test.js";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StopTestTool} from "./stop-test.js";

export function addIntegrationAcceleratorTools(server: McpServer) {
  addTool_startTest();
  StopTestTool.register(server);
}

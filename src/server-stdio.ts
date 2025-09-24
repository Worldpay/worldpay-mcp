import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server.js";
import "./tools/tools.js";

const transport = new StdioServerTransport();
await server.connect(transport);

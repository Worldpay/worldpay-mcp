import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server.js";

import "./prompts.js";
import "./resources.js";
import "./tools.js";

// Connect using StdioServerTransport
const transport = new StdioServerTransport();
await server.connect(transport); 

import {WorldpayMCPServer} from "@/worldpay-mcp-server";
import {StdioTransport} from "@/transports/StdioTransport";

try {
  const server = new WorldpayMCPServer({
    name: "Worldpay",
    version: "1.0.0",
    baseUrl: process.env.WORLDPAY_URL!,
    username: process.env.WORLDPAY_USERNAME!,
    password: process.env.WORLDPAY_PASSWORD!,
    merchantEntity: process.env.MERCHANT_ENTITY!
  });
  const transport = new StdioTransport(server);
  await transport.connect();
} catch (error) {
  console.error('Failed to start Worldpay MCP STDIO server:', error);
  process.exit(1);
}

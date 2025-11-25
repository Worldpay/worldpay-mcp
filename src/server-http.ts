import {HTTPTransport} from "@/transports/HTTPTransport";
import {WorldpayMCPServer} from "@/worldpay-mcp-server";
import {logger} from "@/utils/logger";

try {
  const server = new WorldpayMCPServer({
    name: "Worldpay",
    version: "1.0.0",
    baseUrl: process.env.WORLDPAY_URL!,
    username: process.env.WORLDPAY_USERNAME!,
    password: process.env.WORLDPAY_PASSWORD!,
    merchantEntity: process.env.MERCHANT_ENTITY!
  });

  const transport = new HTTPTransport(3001, server);
  await transport.connect()
} catch (error) {
  logger.error('Failed to start Worldpay MCP HTTP server:', error);
  process.exit(1);
}

import {SSETransport} from "@/transports/SSETransport";
import {logger} from "@/utils/logger";

try {
  const server = new SSETransport();
  await server.connect();
} catch (error) {
  logger.error('Failed to start server:', error);
  process.exit(1);
}

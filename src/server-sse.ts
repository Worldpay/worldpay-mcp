import {SSETransport} from "@/transports/SSETransport";
import {logger} from "@/utils/logger";

try {
  const server = new SSETransport();
  await server.connect();
  logger.info('SSE server started successfully.');
} catch (error) {
  logger.error('Failed to start server:', error);
  process.exit(1);
}

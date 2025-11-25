import {SSETransport} from "@/transports/SSETransport";

try {
  const server = new SSETransport();
  await server.connect();
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

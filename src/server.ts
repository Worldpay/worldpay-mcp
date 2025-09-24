import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import "dotenv/config";
import winston from "winston";

const { combine, timestamp, prettyPrint } = winston.format;

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new winston.transports.File({
      filename: 'worldpay-mcp.log',
      level: 'info'
    })
  ],
});

export const server = new McpServer({
  name: "Worldpay",
  version: "1.0.0",
});

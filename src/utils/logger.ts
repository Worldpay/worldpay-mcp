import "dotenv/config";
import * as winston from 'winston';

const {combine, timestamp, prettyPrint} = winston.format;

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

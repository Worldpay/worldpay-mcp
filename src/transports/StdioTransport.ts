import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {ConnectableServerTransport} from "@/transports/ServerTransport";
import {WorldpayMCPServer} from "@/worldpay-mcp-server";
import {logger} from "@/utils/logger";

export class StdioTransport implements ConnectableServerTransport {

  private server;

  constructor(server: WorldpayMCPServer) {
    this.server = server;
  }

  public async connect(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport)
    logger.info(`Worldpay MCP STDIO server started successfully`);
  }
}


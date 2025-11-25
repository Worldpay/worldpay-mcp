import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {ConnectableServerTransport} from "@/transports/ServerTransport";


export class SSETransport implements ConnectableServerTransport {

  public async connect(): Promise<void> {
    const transport = new StdioServerTransport();
    await transport.start()
  }
}


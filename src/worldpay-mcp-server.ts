import {WorldpayAPI} from "@/api/worldpay";
import {CreateHPPTransaction} from "@/tools/hpp/CreateHPPTransaction";
import {CreateWorldpayToken} from "@/tools/payments/CreateWorldpayToken";
import {ManagePayments} from "@/tools/payments/ManagePayments";
import {QueryPaymentByDate} from "@/tools/payments/QueryPaymentByDate";
import {QueryPaymentById} from "@/tools/payments/QueryPaymentById";
import {QueryPaymentByTxRef} from "@/tools/payments/QueryPaymentByTxRef";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {TakeGuestPayment} from "@/tools/payments/TakeGuestPayment";
import {QueryAccountPayouts} from "@/tools/payouts/QueryAccountPayouts";

export interface WorldpayMCPConfig {
  name: string,
  version: string,
  merchantEntity: string;
  baseUrl: string;
  username: string;
  password: string;
}

export class WorldpayMCPServer extends McpServer {
  private readonly worldpayApi: WorldpayAPI;

  constructor(config: WorldpayMCPConfig) {
    super({name: config.name, version: config.version});
    this.worldpayApi = new WorldpayAPI(config);
    this.registerTools();
  }

  private registerTools() {
    //Define all available tools
    const tools = [
      new CreateHPPTransaction(this.worldpayApi),
      new TakeGuestPayment(this.worldpayApi),
      new CreateWorldpayToken(this.worldpayApi),
      new ManagePayments(this.worldpayApi),
      new QueryPaymentByDate(this.worldpayApi),
      new QueryPaymentById(this.worldpayApi),
      new QueryPaymentByTxRef(this.worldpayApi),
      new QueryAccountPayouts(this.worldpayApi)
    ];

    // Automatically register all tools
    tools.forEach(tool => {
      this.registerTool(tool.getName(), tool.getDefinition(), (args: any, extra: any) => tool.execute(args));
    });
  }
}

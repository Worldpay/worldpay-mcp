import express, {Application, NextFunction, Request, Response, Router} from "express";
import {randomUUID} from "node:crypto";
import {StreamableHTTPServerTransport} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {logger} from "@/utils/logger";
import {ConnectableServerTransport} from "@/transports/ServerTransport";
import {WorldpayMCPServer} from "@/worldpay-mcp-server";
import cors from 'cors';

export class HTTPTransport implements ConnectableServerTransport {
  private app: Application;
  private transports: Map<string, StreamableHTTPServerTransport>;
  private readonly port: number;
  private readonly server: WorldpayMCPServer;

  constructor(port: number = 3001, server: WorldpayMCPServer) {
    this.app = express();
    this.transports = new Map<string, StreamableHTTPServerTransport>();
    this.port = port;
    this.server = server;
  }

  public async connect(): Promise<void> {
    this.configureApp();
    this.registerRoutes();
    this.registerErrorHandler();


    const server = this.app.listen(this.port, () => {
      console.info(`Worldpay MCP HTTP server listening on port ${this.port}`);
    });

    server.on('error', (err) => {
      console.error(`HTTP server failed: ${err.message}`);
    });
  }

  private configureApp(): void {
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || "*",
      exposedHeaders: ["Mcp-Session-Id"],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization','mcp-session-id', 'last-event-id', 'mcp-protocol-version'],
    }));
    this.app.disable("x-powered-by");
    this.app.use(express.json());
    this.app.use(this.securityHeadersMiddleware());
  }

  private securityHeadersMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      res.setHeader(
        "Content-Security-Policy",
        [
          "default-src 'none'",
          "script-src 'none'",
          "style-src 'none'",
          "img-src 'none'",
          "font-src 'none'",
          "connect-src 'none'",
          "media-src 'none'",
          "object-src 'none'",
          "child-src 'none'",
          "frame-ancestors 'none'",
          "form-action 'none'",
          "base-uri 'none'",
        ].join("; ")
      );
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      res.setHeader("Referrer-Policy", "no-referrer");
      next();
    };
  }


  private registerRoutes(): void {
    const router = Router();
    router.post("/mcp", this.handlePost.bind(this));
    router.get("/mcp", this.handleSessionRequest.bind(this));
    router.delete("/mcp", this.handleSessionRequest.bind(this));
    this.app.use(router);
  }

  private async handlePost(req: Request, res: Response): Promise<void> {
    try {
      // Check for existing session ID
      const sessionId = req.headers["mcp-session-id"] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      if (sessionId && this.transports.get(sessionId)) {
        // Reuse existing transport
        transport = this.transports.get(sessionId)!;
      } else {
        // New initialization request
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sessionId) => {
            // Store the transport by session ID
            this.transports.set(sessionId, transport)
          },
        });

        // Clean up transport when closed
        transport.onclose = () => {
          if (transport.sessionId) {
            this.transports.delete(transport.sessionId)
          }
        };

        // Connect to the MCP server
        await this.server.connect(transport);
      }

      // Handle the request
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      logger.error("POST /mcp error", err);
      res.status(500).json({
        jsonrpc: "2.0",
        error: {code: -32603, message: "Internal Server Error"},
        id: null,
      });
    }
  }

  // Reusable handler for GET and DELETE requests
  handleSessionRequest = async (
    req: express.Request,
    res: express.Response
  ) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !this.transports.get(sessionId)) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }

    const transport = this.transports.get(sessionId)!;
    await transport.handleRequest(req, res);
  };


  private registerErrorHandler(): void {
    // Final error handler
    this.app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
      logger.error("Unhandled error", err);
      res.status(500).send("Unhandled Server Error");
    });
  }
}


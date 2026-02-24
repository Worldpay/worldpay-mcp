# Introduction

Welcome to the Worldpay [**M**odel **C**ontext **P**rotocol](https://modelcontextprotocol.io/) Server

## Tools

We'll be adding more tools over the coming months, for now we support the following:

### Take Payments

This tool will make a direct request to the [Worldpay Payments API](https://developer.worldpay.com/products/access/payments/card-payment).
It requires a Session url as input which is generated via the [Worldpay Checkout](https://developer.worldpay.com/products/access/checkout/web/card-only) product.

### Verified Token

This tool will verify a card and generate a token for use in a payment using the [Worldpay Verified Tokens](https://developer.worldpay.com/products/access/verified-tokens) product.
It requires a Session url as input which is generated via the [Worldpay Checkout](https://developer.worldpay.com/products/access/checkout/web/card-only) product.

### Manage Payments

All of the payment products return a set of next action links that can be used to perform follow on commands such as settlement, cancel, refund etc.

This tool takes an action link an invokes that command on a specific payment. See [Payments API/Manage Payments](https://developer.worldpay.com/products/access/payments/openapi/manage-payments).

### Pay By Link

This tool supports the generation of a payment link that can be passed to a user to complete a payment transaction using the [Worldpay Hosted Payment Pages](https://developer.worldpay.com/products/access/hosted-payment-pages) product.

### Query Payments

This is actually three distinct tools all of which use the [Worlday Payment Queries API](https://developer.worldpay.com/products/access/payment-queries) to search for payments.

* Query By Date Range
* Query By Transaction Reference
* Query By Payment Id

## Resources
Coming soon

## Prompts
Comming soon

# Usage

>Remeber to set your environment by renaming ```.env.example``` to ```.env```. Set your user name and password obtained from [Worldpay Dashboard](https://dashboard.worldpay.com/)

You can clone this repo and run the server using the following command:

```bash
npm install && npm run build && npm run start
```

or build and run as a container:

```bash
docker build -t worldpay/mcp .  
docker run -p 3001:3001 --env-file .env localhost/worldpay/mcp:latest
```

The server will now be available on port 3001.

>Note that if you wish to use the legacy sse transport, you can run this with ```node ./dist/server-sse.js```

## stdio

To use the stdio transport, configure your client to point to ```./dist/server-stdio.js```.

An example configuration file is given.

```json
{
    "mcpServers": {
        "worldpay": {
            "name": "worldpay-server",
            "command": "node",
            "args": ["PATH TO server-stdio.js"],
            "env": {
                "WORLDPAY_USERNAME": "USERNAME",
                "WORLDPAY_PASSWORD": "PASSWORD",
                "WORLDPAY_URL": "https://try.access.worldpay.com"
            }
        }
```



## Companion Tools

### MerchantGuard MCP — Fraud Scoring for Agentic Commerce

Use [MerchantGuard MCP](https://github.com/MerchantGuardOps/merchantguard-mcp) alongside Worldpay MCP to add AI-native fraud scoring to every agent transaction. MerchantGuard provides:

- **Transaction Risk Scoring** — Score transactions for fraud risk before processing payment
- **Agent Verification** — Verify AI agent trustworthiness and authorization levels
- **Cross-Rail Fraud Detection** — Detect fraud patterns across card, stablecoin, and crypto rails
- **VAMP Analysis** — Monitor Visa Acquirer Monitoring Program compliance

```json
{
  "mcpServers": {
    "merchantguard": {
      "command": "node",
      "args": ["/path/to/merchantguard-mcp/dist/server-stdio.js"]
    },
    "worldpay": {
      "command": "node",
      "args": ["/path/to/worldpay-mcp/dist/server-stdio.js"]
    }
  }
}
```

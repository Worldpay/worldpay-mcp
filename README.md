# Introduction

This is a simple MCP server for Worldpay Payment APIs.

It implements the [Model Context Protocol](https://modelcontextprotocol.io/) to take and query payments.

There are three versions of the server:

- `server-stdio.js` - a simple server that uses the `stdio` transport.
- `server-sse.js` - a server that uses the `SSE` transport.
- `server-http.js` - a sever that uses the `Streamable` transport.

# Installation

```bash
npm install
```

# Usage

Build the server distributions.

```bash
npm run build
```

# Configuration 

## stdio

An example JSON config file which can be used with tools such as Claude.

```json
{
    "mcpServers": {
        "worldpay": {
            "name": "worldpay-server",
            "command": "node",
            "args": ["PATH TO server-stdio.js"],
            "env": {
                "WORLDPAY_USERNAME": "USERNAME",
                "WORLDPAY_PASSWORD": "PASSWORD"
            }
        }
```

## ss + streamable

The sse server is configured using environment variables.
```bash
export WORLDPAY_USERNAME=USERNAME
export WORLDPAY_PASSWORD=PASSWORD
```

# Running the server

## sse 

Start server, defaults to port 3001.
```bash
node dist/server-sse.js
```

## streamable 

Start server, defaults to port 3001.
```bash
node dist/server-http.js
```
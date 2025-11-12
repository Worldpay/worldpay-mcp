# Introduction

Welcome to the Worldpay [**M**odel **C**ontext **P**rotocol](https://modelcontextprotocol.io/) Server

For detailed instructions, please visit our [developer documentation](https://developer.worldpay.com/products/ai/mcp).

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
                "WORLDPAY_URL": "https://try.access.worldpay.com",
                "MERCHANT_ENTITY": "default"
            }
        }
```


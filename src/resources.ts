import {ResourceTemplate} from "@modelcontextprotocol/sdk/server/mcp.js";
import fetch from 'node-fetch';
import path from "path";
import fs from "fs/promises";
import {fileURLToPath} from 'url';
import { server } from "./server.js";

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


server.resource(
    "worldpay-schemas",
    new ResourceTemplate("file://templates/api/schemas/{name}.yaml", {
        list: async () => {
            try {
                // Get a list of all yaml files in the schmeas directory
                const files = await fs.readdir(path.join(__dirname, `templates/api/schemas`));
                const mdFiles = files.filter(file => file.endsWith('.yaml'));

                // Map each file to a resource in the required format
                return {
                    resources: mdFiles.map(file => ({
                        uri: `file://templates/api/schemas/${file}`,
                        name: file.replace('.yaml', ''),
                        mimeType: 'text/yaml',
                        description: `Worldpay schema for ${file.replace('.yaml', '')}`
                    }))
                };
            } catch (error) {
                if (error instanceof Error) {
                    console.error(`Error listing schema files: ${error.message}`);
                }
                return {resources: []};
            }
        }
    }),
    async (uri, {name}) => {
        try {
            const content = await fs.readFile(path.join(__dirname, `templates/api/schemas/${name}.yaml`), 'utf8');

            return {
                contents: [{
                    uri: uri.href,
                    text: content,
                    mimeType: 'text/yaml'
                }]
            };
        } catch (error) {
            if (error instanceof Error) {
                return {
                    contents: [{
                        uri: uri.href,
                        text: `Error reading Worldpay payments api schemas ${name}: ${error.message}`,
                        mimeType: 'text/plain'
                    }],
                    isError: true
                };
            }
            throw error;
        }

    }
);

server.resource(
    "worldpay-endpoints",
    new ResourceTemplate("file://templates/api/paths/api_payments_linkData_{name}.yaml", {list: undefined}),
    async (uri, {name}) => {
        try {
            const content = await fs.readFile(path.join(__dirname, `templates/api/paths/api_payments_linkData_${name}.yaml`), 'utf8');

            return {
                contents: [{
                    uri: uri.href,
                    text: content,
                    mimeType: 'text/yaml'
                }]
            };
        } catch (error) {
            if (error instanceof Error) {
                return {
                    contents: [{
                        uri: uri.href,
                        text: `Error reading Worldpay payments api path ${name}: ${error.message}`,
                        mimeType: 'text/plain'
                    }],
                    isError: true
                };
            }
            throw error;
        }

    }
);

type MarkdownResource = {
    name: string,
    uri: string
}

const markdownResources: MarkdownResource[] = [
    {
        name: "Initiate a payment request",
        uri: "https://developer.worldpay.com/products/access/payments/openapi/payment/payment.md"
    },
    {
        name: "Query a payment",
        uri: "https://developer.worldpay.com/products/access/payments/openapi/manage-payments/queryevents.mdd"
    },
    {
        name: "Submit a payment settle request",
        uri: "https://developer.worldpay.com/products/access/payments/openapi/manage-payments/settle.md"
    },
    {
        name: "Submit a payment partial settle request",
        uri: "https://developer.worldpay.com/products/access/payments/openapi/manage-payments/partialsettle.md"
    },
    {
        name: "Submit a payment refund request",
        uri: "https://developer.worldpay.com/products/access/payments/openapi/manage-payments/refund.md"
    },
    {
        name: "Submit a payment partial refund request",
        uri: "https://developer.worldpay.com/products/access/payments/openapi/manage-payments/partialrefund.md"
    },
    {
        name: "Submit a payment cancel request",
        uri: "https://developer.worldpay.com/products/access/payments/openapi/manage-payments/cancel.md"
    },
    {
        name: "Card Payment",
        uri: "https://developer.worldpay.com/products/access/card-payments.md"
    },
    {
        name: "3ds API",
        uri: "https://developer.worldpay.com/products/access/3ds.md"
    }
]

markdownResources.forEach(resource => {
    server.resource(
        resource.name,
        resource.uri,
        async (uri: URL) => fetchMarkdownSpec(uri)
    )
})

server.resource(
    "worldpay-openapi",
    "https://developer.worldpay.com/_spec/products/access/payments/@20240601/openapi.yaml?download",
    async (uri) => {
        try {
            // Download the OpenAPI spec from the resource URI
            const response = await fetch(uri.href);

            if (!response.ok) {
                throw new Error(`Failed to fetch OpenAPI spec: ${response.status} ${response.statusText}`);
            }

            const content = await response.text();

            return {
                contents: [{
                    uri: uri.href,
                    text: content,
                    mimeType: 'text/yaml'
                }]
            };
        } catch (error) {
            if (error instanceof Error) {
                return {
                    contents: [{
                        uri: uri.href,
                        text: `Error downloading Worldpay OpenAPI spec: ${error.message}`,
                        mimeType: 'text/plain'
                    }],
                    isError: true
                };
            }
            throw error;
        }
    }
);

server.resource(
    "worldpay-guides",
    new ResourceTemplate("file://templates/guides/{name}.md", {
        list: async () => {
            try {
                // Get a list of all MD files in the guides directory
                const files = await fs.readdir(path.join(__dirname, `templates/guides`));
                const mdFiles = files.filter(file => file.endsWith('.md'));

                // Map each file to a resource in the required format
                return {
                    resources: mdFiles.map(file => ({
                        uri: `file://templates/guides/${file}`,
                        name: file.replace('.md', ''),
                        mimeType: 'text/markdown',
                        description: `Worldpay guide for ${file.replace('.md', '')}`
                    }))
                };
            } catch (error) {
                if (error instanceof Error) {
                    console.error(`Error listing guide files: ${error.message}`);
                }
                return {resources: []};
            }
        }
    }),
    async (uri, {name}) => {
        try {
            const content = await fs.readFile(path.join(__dirname, `templates/guides/${name}.md`), 'utf8');

            return {
                contents: [{
                    uri: uri.href,
                    text: content,
                    mimeType: 'text/markdown'
                }]
            };
        } catch (error) {
            if (error instanceof Error) {
                return {
                    contents: [{
                        uri: uri.href,
                        text: `Error reading Worldpay guide ${name}: ${error.message}`,
                        mimeType: 'text/plain'
                    }],
                    isError: true
                };
            }
            throw error;
        }

    }
);

server.resource(
    "worldpay-examples",
    new ResourceTemplate("file://templates/examples/{name}.json", {
        list: async () => {
            try {
                // Get a list of all JSON files in the guides directory
                const files = await fs.readdir(path.join(__dirname, `templates/examples`));
                const mdFiles = files.filter(file => file.endsWith('.json'));

                // Map each file to a resource in the required format
                return {
                    resources: mdFiles.map(file => ({
                        uri: `file://templates/examples/${file}`,
                        name: file.replace('.json', ''),
                        mimeType: 'text/json',
                        description: `Worldpay example for ${file.replace('.json', '')}`
                    }))
                };
            } catch (error) {
                if (error instanceof Error) {
                    console.error(`Error listing example files: ${error.message}`);
                }
                return {resources: []};
            }
        }
    }),
    async (uri, {name}) => {
        try {
            const content = await fs.readFile(path.join(__dirname, `templates/examples/${name}.json`), 'utf8');

            return {
                contents: [{
                    uri: uri.href,
                    text: content,
                    mimeType: 'text/json'
                }]
            };
        } catch (error) {
            if (error instanceof Error) {
                return {
                    contents: [{
                        uri: uri.href,
                        text: `Error reading Worldpay example ${name}: ${error.message}`,
                        mimeType: 'text/plain'
                    }],
                    isError: true
                };
            }
            throw error;
        }

    }
);


export async function fetchMarkdownSpec(uri: URL) {
    try {
        const response = await fetch(uri.href);
        if (!response.ok) {
            throw new Error(`Failed to fetch markdown spec: ${response.status} ${response.statusText}`);
        }
        const content = await response.text();
        return {
            contents: [{
                uri: uri.href,
                text: content,
                mimeType: 'text/markdown'
            }]
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                contents: [{
                    uri: uri.href,
                    text: `Error downloading Worldpay markdown spec: ${error.message}`,
                    mimeType: 'text/plain'
                }],
                isError: true
            };
        }
        throw error;
    }
}
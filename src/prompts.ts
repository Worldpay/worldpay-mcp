import { z } from "zod";
import { server } from "./server.js";

/**
 * This file contains prompts for the Worldpay MCP server.
 * These prompts guide users in building server-side implementations
 * of the Worldpay Payments API.
 */

server.registerPrompt(
  "worldpay-api-selection",
  {
    title: "Worldpay API Selection",
    description: "Select the right Worldpay API for you"
  },
  ({}) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "I want to build a server-side implementation using the Worldpay APIs. Please guide me through the process of selecting the appropriate API and features to implement."
        }
      },
      {
        role: "assistant",
        content: {
          type: "text",
          text: "Answer the following questions to help me guide you on the correct APIs to use. 1. Will you be using an external MPI for authentication (3rd party for 3ds data)"
        }
      }
    ]
  })
)

//workflow prompt  
server.registerPrompt(
  "worldpay-payments-api",
  {
    title: "Worldpay Payments API Server Implementation",
    description: "Create a server-side implementation of the Worldpay Payments API using the Worldpay MCP server tool.",
    argsSchema: {
      programmingLanguage: z.string().describe("Programming language and framework to use (e.g., 'node-express', 'java-spring')"),
    }
    
  },
  ({ programmingLanguage }) => ({
    messages: [
        { 
            role: "user", 
            content: { 
                type: "text", 
                text: `Create a server side implementation of the Worldpay Payments API using the following programming language: ${programmingLanguage}.
Use the Worldpay MCP server tool guidedServerGeneration. This tool requires input parameters to guide you on which featuress of the API to implement, 
do not default these value but ask the user for their preferences. 
                `
            } 
        }
    ]
  })
);

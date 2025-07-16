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
          text: `I want to build a server-side implementation using the Worldpay APIs to take payments.
                 Please guide me through the process of selecting the appropriate API and features to implement.`
        }
      },
      {
        role: "assistant",
        content: {
          type: "text",
          text: `Certainly! Please answer the following questions to help me guide you on the correct APIs to use:
                1. Will you be using an external MPI for authentication (3rd party for 3ds data)? 
                  - If yes, you need to use the Card Payments API. You can also use the modular 3ds API and use this in conjunction with the Card Payment API (see the "3ds API" named resource from the worldpay MCP server ).
                  - If no, you can use the Payments API which can orchestrate the 3ds flow for you.
                2. Will you require L2/L3 data support?
                  - If yes, you need to use the Card Payments API.
                  - If no, you can use the Payments API.
                3. Will you use Prime Routing?
                  - If yes, you need to use the Card Payments API.
                  - If no, you can use the Payments API.
                4. Will you require APMs as well as cards?
                  - If no, you need to use the Card Payment and APM Payment modular APIs.
                  - If no, you can use the Payments API.

                If you are using the Payments API, you can use the worldpay MCP tool "generatePaymentServerCode" to help you implement the required features.
                This tool requires input parameters to guide you on which features of the API to implement, do not default these values but ask the user for their preferences.
                
                If you are using the Card Payments API, you can use the worldpay MCP resource named "Card Payment".`
        }
      }
    ]
  })
)


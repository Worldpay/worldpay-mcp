import { z } from "zod";
import { server } from "./server.js";

/**
 * This file contains prompts for the Worldpay MCP server.
 * These prompts guide users in building server-side implementations
 * of the Worldpay Payments API.
 */

server.registerPrompt(
  "generate-payment-server-code",
  {
    title: "Generate Payment Server Code",
    description: "Generate server-side code for Worldpay Payments API"
  },
  ({})  => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Generate server-side code for the Worldpay Payments API using Node.js and Express, integrating the Worldpay MCP tool "generatePaymentServerCode" to implement required features. 
          Guide through the process of generating the code, ensuring exact output from the MCP tool is used. 
          Implement a new route in your existing Express application that accepts a session href as a payload, triggers the payment server code execution, and handles the payment flow.
          Ensure all new code is added to your existing application structure, with clear separation of concerns and proper error handling. 
          The route must expose an API endpoint callable by a frontend application, leveraging the generated payment server code for session-based payment processing.
          Make sure to take care of CORS to allow the frontend application to call the API endpoint.
          Load my Worldpay username and password from an .env file and use them for the payment server call.`
        }
      },
      {
        role: "assistant",
        content: {
          type: "text",
          text: `Sure! I will use the worldpay MCP tools and use their exact output.
                Once I have created the server side code, I will be able to call the "startTest" tool to monitor your integration, just let me know when you wish to run the test.
                I also have access to the worldpay MCP resources which have specific information on the APIs and how to use them, so I will refer to them when required.
                Once you are ready to proceed , let me know and I will start creating the server side code for you.
                I will be sure to add new code to your existing node express application as you requested.
                I will add a new route to your express application that can be called by a front end application.
                I will use cors middleware for express to allow the front end application to call the API endpoint.`  
        }
      }
    ]
  })  
)
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
          text: `I wish to build a server-side implementation using the Worldpay APIs to take payments.
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


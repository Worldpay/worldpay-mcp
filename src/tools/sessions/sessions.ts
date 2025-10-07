import { z } from "zod";
import { logger } from "../../server.js";
import { createSessionSchema } from "../../schemas/schemas.js";

const SESSIONS_API_PATH = "/sessions/apm";

export async function createPaymentSession(
  params: z.infer<typeof createSessionSchema>
) {
  try {

    let request = {
        identity: params.identity,
        ...params.payload
    }

    logger.info(
      `Calling POST ${
        process.env.WORLDPAY_URL
      }${SESSIONS_API_PATH} API with: ${JSON.stringify(request)}`
    );


    const response = await fetch(
      `${process.env.WORLDPAY_URL}${SESSIONS_API_PATH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/vnd.worldpay.sessions-v1.hal+json",
          Accept: "application/vnd.worldpay.sessions-v1.hal+json",
        },
        body: JSON.stringify(request),
      }
    );

    const result = await response.json();

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result),
        },
      ],
    };
  } catch (error) {
    logger.error(`Session error: ${(error as Error).message}`);
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: `Session creation failed: ${(error as Error).message}`,
        },
      ],
    };
  }
}
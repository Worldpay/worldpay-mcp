import { tokenSchema } from "../../schemas/schemas";
import type {
  CardCheckout,
  VerifiedTokensOneTimeRequest,
  BillingAddress,
  VerifiedTokenOneTime200Response,
  VerifiedTokenOneTime201Response,
  VerifiedTokenOneTime409Response,
} from "../../types/tokens.d.ts";
import { z } from "zod";
import { logger } from "../../server.js";

const TOKENS_API_PATH = "/verifiedTokens/oneTime";

export async function createOneTimeVerifiedTokenHandler(
  params: z.infer<typeof tokenSchema>
) {
  try {
    let tokenRequest: VerifiedTokensOneTimeRequest = createRequest(params);

    logger.info(
      `Calling POST ${
        process.env.WORLDPAY_URL
      }${TOKENS_API_PATH} API with params: ${JSON.stringify(params)}`
    );

    const response = await fetch(
      `${process.env.WORLDPAY_URL}${TOKENS_API_PATH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/vnd.worldpay.verified-tokens-v3.hal+json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.WORLDPAY_USERNAME}:${process.env.WORLDPAY_PASSWORD}`
          ).toString("base64")}`,
          Accept: "application/vnd.worldpay.verified-tokens-v3.hal+json",
        },
        body: JSON.stringify(tokenRequest),
      }
    );

    if (
      response.status != 200 &&
      response.status != 201 &&
      response.status != 206 &&
      response.status != 409
    ) {
      throw new Error(
        `Token creation failed with status ${response.status}: ${JSON.stringify(
          await response.json()
        )}`
      );
    }

    let result;
    let description = "";
    
    switch (response.status) {
      case 200:
        description =
          "The payload has been verified and a matching Token already exists. This does not include token meta data, which still may be different";
        result = (await response.json()) as VerifiedTokenOneTime200Response;
        break;
      case 201:
        description =
          "The payload has been verified and a Token has been created.";
        result = (await response.json()) as VerifiedTokenOneTime201Response;
        break;
      case 206:
        description =
          "The supplied payload could not be verified. An unverified token has been created/matched.";
        result = (await response.json()) as VerifiedTokenOneTime201Response;
        break;
      case 409:
        description =
          "The payload has been verified but a Token exists that conflicts with some of the details in the request.";
        result = (await response.json()) as VerifiedTokenOneTime409Response;
        break;
      default:
        description = "Unknown response";
        result = await response.json()
        break;
    }

    logger.info(description);

    return {
      content: [
        {
          type: "text" as const,
          text: description
        },
        {
          type: "text" as const,
          text: JSON.stringify(result),
        },
      ],
    };
  } catch (error) {
    logger.error(`Token error: ${(error as Error).message}`);
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: `Token creation failed: ${(error as Error).message}`,
        },
      ],
    };
  }
}

function createRequest(
  params: z.infer<typeof tokenSchema>
): VerifiedTokensOneTimeRequest {
  let billingAddress: BillingAddress = {
    address1: params.address1,
    city: params.city,
    postalCode: params.postalCode,
    countryCode: params.countryCode,
  } as BillingAddress;

  let paymentInstrument: CardCheckout = {
    type: "card/checkout",
    cardHolderName: params.cardHolderName,
    sessionHref: params.sessionHref,
    billingAddress: billingAddress,
  } as CardCheckout;

  let tokenRequest: VerifiedTokensOneTimeRequest = {
    description: `TR${Date.now()}`,
    merchant: { entity: "default" },
    paymentInstrument: paymentInstrument,
    verificationCurrency: params.currency,
    namespace: params.shopperId,
    narrative: { line1: "MCP Token Creation" },
  } as VerifiedTokensOneTimeRequest;

  return tokenRequest;
}

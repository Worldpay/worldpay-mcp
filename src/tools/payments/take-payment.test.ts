import * as takePayment from "./take-payment.js";

describe("take-payment tool", () => {
  it("should be defined", () => {
    expect(takePayment).toBeDefined();
  });
  it("should handle mocked fetch response in takePayment", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 201,
        headers: {
          get: (header:string) => {
            if (header.toLowerCase() === "wp-correlationid") return "mock-correlation-id";
            return undefined;
          },
        },
        json: () => Promise.resolve({ success: true, data: "mocked" }),
      })
    ) as jest.Mock;
    const dummyParams = {
      cardHolderName: "Bob",
      sessionHref: "https://mocked.endpoint/session",
      amount: 100,
      currency: "GBP",
      address1: "Street",
      city: "London",
      postalCode: "SW1A 1AA",
      countryCode: "GB",
      storeCard: false,
      createToken: false,
    }
    const result = await takePayment.takePayment(
      dummyParams
    );
  expect(result).not.toHaveProperty("isError", true);
    (global.fetch as jest.Mock).mockClear();
  });
});

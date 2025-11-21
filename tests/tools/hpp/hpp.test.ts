import {createHPPTransaction} from "@/tools/hpp/hpp";
import fetchMock from "fetch-mock";

describe("hpp tool", () => {
  beforeEach(() => {
    process.env.WORLDPAY_URL = "https://preprod.worldpay.com";
    process.env.WORLDPAY_USERNAME = "user";
    process.env.WORLDPAY_PASSWORD = "pass";
    process.env.MERCHANT_ENTITY = "merchant-123";
  });

  it("should handle mocked fetch response in createHPPTransaction", async () => {
    fetchMock.mockGlobal().post(
      "https://preprod.worldpay.com/payment_pages",
      {
        status: 200,
        body: { transactionReference: 'TR123', status: 'SUCCESS' },
      });

    const dummyParams =
      {amount: 100, currency: "GBP"};

    const result = await createHPPTransaction(dummyParams);
    console.log(JSON.stringify(result))
    expect(result).not.toHaveProperty("isError");
  });
});

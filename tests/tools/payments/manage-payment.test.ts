import {managePayment} from "@/tools/payments/manage-payment";
import fetchMock from "fetch-mock";

describe("manage-payment tool", () => {
  beforeEach(() => {
    process.env.WORLDPAY_URL = "https://preprod.worldpay.com";
    process.env.WORLDPAY_USERNAME = "user";
    process.env.WORLDPAY_PASSWORD = "pass";
    process.env.MERCHANT_ENTITY = "merchant-123";
  });

  it("should handle mocked fetch response in managePaymentWithWorldpayHandler", async () => {
    fetchMock.mockGlobal().post(
      "https://preprod.access.worldpay.com/mocked.endpoint",
      {
        status: 201,
        body: { action: "test", status: "SUCCESS" },
      });

    const dummyParams = {
      commandName: "test",
      commandHref: "https://preprod.access.worldpay.com/mocked.endpoint",
    };
    const result = await managePayment(
      dummyParams
    );
    expect(result).not.toHaveProperty("isError");
  });
});

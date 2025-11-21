import {takePayment} from "@/tools/payments/take-payment";
import fetchMock from "fetch-mock";

describe("take-payment tool", () => {
  beforeEach(() => {
    process.env.WORLDPAY_URL = "https://preprod.worldpay.com";
    process.env.WORLDPAY_USERNAME = "user";
    process.env.WORLDPAY_PASSWORD = "pass";
    process.env.MERCHANT_ENTITY = "merchant-123";
  });

  it("should handle mocked fetch response in takePayment", async () => {

    fetchMock.mockGlobal().post(
      "https://preprod.access.worldpay.com/paymentQueries/payments?startDate=2025-09-09T00%3A00%3A00Z&endDate=2025-09-09T23%3A59%3A59Z&pageSize=1",
      {
        status: 200,
        body: { success: true, data: "mocked" },
      });

    const dummyParams = {} as any;
    const result = await takePayment(
      dummyParams
    );
    expect(result).not.toHaveProperty("isError");
  });
});

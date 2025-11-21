import {queryPaymentsByDate} from "@/tools/payments/query-payments";
import fetchMock from "fetch-mock";

describe("query-payments tool", () => {
  beforeEach(() => {
    process.env.WORLDPAY_URL = "https://preprod.access.worldpay.com";
    process.env.WORLDPAY_USERNAME = "user";
    process.env.WORLDPAY_PASSWORD = "pass";
    process.env.MERCHANT_ENTITY = "merchant-123";
  });

  it("should handle mocked fetch response in queryPaymentsByDate", async () => {

    fetchMock.mockGlobal().get(
      "https://preprod.access.worldpay.com/paymentQueries/payments?startDate=2025-09-09T00%3A00%3A00Z&endDate=2025-09-09T23%3A59%3A59Z&pageSize=1",
      {
        status: 200,
        body: {
          _embedded: {
            payments: [{transactionReference: "TR123", status: "SUCCESS"}],
          },
        },
      });

    const dummyParams = {
      startDate: "2025-09-09T00:00:00Z",
      endDate: "2025-09-09T23:59:59Z",
      pageSize: 1,
    };
    const result = await queryPaymentsByDate(
      dummyParams
    );
    expect(result).not.toHaveProperty("isError");
  });
});

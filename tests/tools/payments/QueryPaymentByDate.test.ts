import fetchMock from "fetch-mock";
import {WorldpayAPI} from "@/api/worldpay";
import {QueryPaymentByDate} from "@/tools/payments/QueryPaymentByDate";

describe("QueryPaymentByDate tool", () => {
  let tool: QueryPaymentByDate;
  beforeEach(() => {
    const mockApi = new WorldpayAPI({
      name: "Worldpay",
      version: "1.0.0",
      baseUrl: "https://preprod.access.worldpay.com",
      username: "user",
      password: "pass",
      merchantEntity: "merchant-123"
    })
    tool = new QueryPaymentByDate(mockApi)
  })
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
    const result = await tool.execute(
      dummyParams
    );
    expect(result).not.toHaveProperty("isError");
  });
});

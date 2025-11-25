import fetchMock from "fetch-mock";
import {WorldpayAPI} from "@/api/worldpay";
import {QueryAccountPayouts} from "@/tools/payouts/QueryAccountPayouts";

describe("QueryAccountPayouts tool", () => {
  let tool: QueryAccountPayouts
  beforeEach(() => {
    const mockApi = new WorldpayAPI({
      name: "Worldpay",
      version: "1.0.0",
      baseUrl: "https://preprod.access.worldpay.com",
      username: "user",
      password: "pass",
      merchantEntity: "merchant-123"
    })
    tool = new QueryAccountPayouts(mockApi)
  })

  it("should handle mocked fetch response in managePaymentWithWorldpayHandler", async () => {
    fetchMock.mockGlobal().get(
      "https://preprod.access.worldpay.com/paymentQueries/payments?transactionReference=XYZ102025&pageSize=1&pageNumber=1&entity=merchant-123",
      {
        status: 200,
        body: {
          items: [
            { "paymentId": "51a448e5-4430-ee11-b58a-005056b48b8e",
              "paymentDatetime": "2023-08-01T08:24:44.443Z",
              "payeeName": "John Smith",
              "sourceCurrency": "ARS",
              "sourceAmount": 0,
              "targetCurrency": "ARS",
              "targetAmount": 1.05,
              "paymentState": "EXECUTED",
              "bankName": "Test Bank",
              "bankCode": "10 02 04",
              "iban": "GB29NWBK60161331926819",
              "channel": "WIRE,ACH SD",
              "routedChannel": "WIRE",
              "payoutRequestId": "PO000N65",
              "narrative": "XYZ102025",
              "transactionReference": "XYZ102025",
              "accountNumber": "45533882",
              "swiftBic": "BUKBGB22",
              "entity": "default",
              "countryCode": "AR",
            }],
        },
      });

    const dummyParams = {
      transactionReference: "XYZ102025",
      pageSize: 1,
      pageNumber: 1
    };

    const result = await tool.execute(
      dummyParams
    );
    expect(result).not.toHaveProperty("isError");
  });
});

import { queryAccountPayouts } from "./query-payouts.js";

describe("query-account-payouts tool", () => {
  it("should be defined", () => {
    expect(queryAccountPayouts).toBeDefined();
  });
  it("should handle mocked fetch response in queryAccountPayouts", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status:200,
        json: () =>
          Promise.resolve({
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
          }),
      })
    ) as jest.Mock;
    const dummyParams = {
      transactionReference: "XYZ102025",
      pageSize: 1,
      pageNumber: 1
    };
    const result = await queryAccountPayouts(dummyParams);

  expect(result).not.toHaveProperty("isError", true);
    (global.fetch as jest.Mock).mockClear();
  });
});

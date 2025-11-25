import fetchMock from "fetch-mock";
import {CreateHPPTransaction} from "@/tools/hpp/CreateHPPTransaction";
import {WorldpayAPI} from "@/api/worldpay";

describe("CreateHPPTransaction tool", () => {
  beforeEach(() => {
    process.env.WORLDPAY_URL = "https://preprod.access.worldpay.com";
    process.env.WORLDPAY_USERNAME = "user";
    process.env.WORLDPAY_PASSWORD = "pass";
    process.env.MERCHANT_ENTITY = "merchant-123";
  });

  let tool: CreateHPPTransaction
  beforeEach(() => {
    const mockApi = new WorldpayAPI({
      name: "Worldpay",
      version: "1.0.0",
      baseUrl: "https://preprod.access.worldpay.com",
      username: "user",
      password: "pass",
      merchantEntity: "merchant-123"
    })
    tool = new CreateHPPTransaction(mockApi)
  })

  it("should handle mocked fetch response in createHPPTransaction", async () => {
    fetchMock.mockGlobal().post(
      "https://preprod.access.worldpay.com/payment_pages",
      {
        status: 200,
        body: {transactionReference: 'TR123', status: 'SUCCESS'},
      });

    const dummyParams =
      {amount: 100, currency: "GBP"};

    const result = await tool.execute(dummyParams);
    expect(result).not.toHaveProperty("isError");
  });
});

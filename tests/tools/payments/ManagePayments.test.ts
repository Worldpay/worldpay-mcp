import fetchMock from "fetch-mock";
import {WorldpayAPI} from "@/api/worldpay";
import {ManagePayments} from "@/tools/payments/ManagePayments";

describe("ManagePayments tool", () => {
  let tool: ManagePayments
  beforeEach(() => {
    const mockApi = new WorldpayAPI({
      name: "Worldpay",
      version: "1.0.0",
      baseUrl: "https://preprod.access.worldpay.com",
      username: "user",
      password: "pass",
      merchantEntity: "merchant-123"
    })
    tool = new ManagePayments(mockApi)
  })

  it("should handle mocked fetch response in managePaymentWithWorldpayHandler", async () => {
    fetchMock.mockGlobal().post(
      "https://preprod.access.worldpay.com/mocked.endpoint",
      {
        status: 201,
        body: {action: "test", status: "SUCCESS"},
      });

    const dummyParams = {
      commandName: "test",
      commandHref: "https://preprod.access.worldpay.com/mocked.endpoint",
    };
    const result = await tool.execute(
      dummyParams
    );
    expect(result).not.toHaveProperty("isError");
  });
});

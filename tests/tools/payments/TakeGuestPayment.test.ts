import fetchMock from "fetch-mock";
import {WorldpayAPI} from "@/api/worldpay";
import {TakeGuestPayment} from "@/tools/payments/TakeGuestPayment";

describe("TakeGuestPayment tool", () => {
  let tool: TakeGuestPayment
  beforeEach(() => {
    const mockApi = new WorldpayAPI({
      name: "Worldpay",
      version: "1.0.0",
      baseUrl: "https://preprod.access.worldpay.com",
      username: "user",
      password: "pass",
      merchantEntity: "merchant-123"
    })
    tool = new TakeGuestPayment(mockApi)
  })

  it("should handle mocked fetch response in takePayment", async () => {

    fetchMock.mockGlobal().post(
      "https://preprod.access.worldpay.com/api/payments",
      {
        status: 201,
        body: {outcome: "authorized", success: true, data: "mocked"},
        headers: {"wp-correlationid": "test-correlation-id"}
      }
    );

    const dummyParams = {
      address1: "221b Baker St",
      city: "London",
      postalCode: "EC4N 8AF",
      countryCode: "GB",
      cardHolderName: "John Doe",
      sessionHref: "https://try.access.worldpay.com/sessions/1234xyz",
      currency: "GBP",
      amount: 1000,
      storeCard: false,
      createToken: false
    };

    const result = await tool.execute(dummyParams);
    expect(result).not.toHaveProperty("isError");
    expect(result.content[0].text).toContain("authorized");
  });
});

import * as actionPayment from "./action-payment";

describe("action-payment tool", () => {
  it("should be defined", () => {
    expect(actionPayment).toBeDefined();
  });
  it("should handle mocked fetch response in actionPaymentWithWorldpayHandler", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ action: "test", status: "SUCCESS" }),
      })
    ) as jest.Mock;
    const dummyParams = {
      actionName: "test",
      actionHref: "https://mocked.endpoint",
    };
    const result = await actionPayment.actionPaymentWithWorldpayHandler(
      dummyParams
    );
    expect(result).not.toHaveProperty("isError");
    (global.fetch as jest.Mock).mockClear();
  });
});

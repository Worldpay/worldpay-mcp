import {managePayment} from "@/tools/payments/manage-payment";

describe("manage-payment tool", () => {
  it("should handle mocked fetch response in managePaymentWithWorldpayHandler", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ action: "test", status: "SUCCESS" }),
      })
    ) as jest.Mock;
    const dummyParams = {
      commandName: "test",
      commandHref: "https://mocked.endpoint",
    };
    const result = await managePayment(
      dummyParams
    );
    expect(result).not.toHaveProperty("isError");
    (global.fetch as jest.Mock).mockClear();
  });
});

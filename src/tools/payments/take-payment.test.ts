import { stat } from "fs";
import * as takePayment from "./take-payment";

describe("take-payment tool", () => {
  it("should be defined", () => {
    expect(takePayment).toBeDefined();
  });
  it("should handle mocked fetch response in takePaymentWithWorldpayHandler", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: "mocked" }),
      })
    ) as jest.Mock;
    const dummyParams = {} as any;
    const result = await takePayment.takePaymentWithWorldpayHandler(
      dummyParams
    );
    expect(result).not.toHaveProperty("isError");
    (global.fetch as jest.Mock).mockClear();
  });
});

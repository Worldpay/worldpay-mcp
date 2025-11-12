import * as hpp from "./hpp.js";

describe("hpp tool", () => {
  it("should be defined", () => {
    expect(hpp).toBeDefined();
  });
  it("should handle mocked fetch response in createHPPTransation", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({ transactionReference: "TR123", status: "SUCCESS" }),
      })
    ) as jest.Mock;
    const dummyParams = { amount: 100, currency: "GBP" };
    const result = await hpp.createHPPTransation(dummyParams);
  expect(result).not.toHaveProperty("isError", true);
    (global.fetch as jest.Mock).mockClear();
  });
});

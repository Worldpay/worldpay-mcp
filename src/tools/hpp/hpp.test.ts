import * as hpp from "./hpp";

describe("hpp tool", () => {
  it("should be defined", () => {
    expect(hpp).toBeDefined();
  });
  it("should handle mocked fetch response in createHPPTransation", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ transactionReference: "TR123", status: "SUCCESS" }),
      })
    ) as jest.Mock;
    const dummyParams = { amount: 100, currency: "GBP" };
    const result = await hpp.createHPPTransation(dummyParams);
    expect(result).not.toHaveProperty("isError");
    (global.fetch as jest.Mock).mockClear();
  });
});

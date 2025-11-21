import {createHPPTransaction} from "@/tools/hpp/hpp";

describe("hpp tool", () => {
  it("should handle mocked fetch response in createHPPTransaction", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ transactionReference: "TR123", status: "SUCCESS" }),
      })
    ) as jest.Mock;
    const dummyParams = { amount: 100, currency: "GBP" };
    const result = await createHPPTransaction(dummyParams);
    expect(result).not.toHaveProperty("isError");
  });
});

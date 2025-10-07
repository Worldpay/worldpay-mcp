import * as tokens from "./tokens";

describe("tokens tool", () => {
  it("should be defined", () => {
    expect(tokens.createOneTimeVerifiedToken).toBeDefined();
  });
  it("should handle mocked fetch response in createOneTimeVerifiedToken", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: "mocked" }),
      })
    ) as jest.Mock;
    const dummyParams = {} as any;
    const result = await tokens.createOneTimeVerifiedToken(
      dummyParams
    );
    expect(result).not.toHaveProperty("isError");
    (global.fetch as jest.Mock).mockClear();
  });
});

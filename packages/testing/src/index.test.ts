import { describe, expect, it } from "vitest";
import { FakeAIProvider } from "./index";

describe("FakeAIProvider", () => {
  it("returns deterministic fake output", async () => {
    await expect(new FakeAIProvider().execute()).resolves.toEqual({
      status: "success",
      output: "fake-output",
    });
  });
});

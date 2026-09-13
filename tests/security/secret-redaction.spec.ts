import { describe, expect, it } from "vitest";
import { redactSecrets } from "../../packages/contracts/src";

describe("redactSecrets", () => {
  it("redacts common secret fields", () => {
    const result = redactSecrets("token=abc123 api_key=secret password=hunter2 normal=value");

    expect(result).toBe("token=[REDACTED] api_key=[REDACTED] password=[REDACTED] normal=value");
  });
});

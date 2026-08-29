import { describe, expect, it } from "vitest";
import type { AtlasPreloadApi } from "../../packages/contracts/src";

describe("AtlasPreloadApi", () => {
  it("contains only the approved Task 004 foundation surfaces", () => {
    const allowedTopLevelKeys: Array<keyof AtlasPreloadApi> = ["app", "settings", "jobs"];

    expect(allowedTopLevelKeys).toEqual(["app", "settings", "jobs"]);
  });
});

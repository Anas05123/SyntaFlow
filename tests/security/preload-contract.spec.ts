import { describe, expect, it } from "vitest";
import type { AtlasPreloadApi } from "../../packages/contracts/src";

describe("AtlasPreloadApi", () => {
  it("contains only the foundation app health surface", () => {
    const allowedTopLevelKeys: Array<keyof AtlasPreloadApi> = ["app"];

    expect(allowedTopLevelKeys).toEqual(["app"]);
  });
});

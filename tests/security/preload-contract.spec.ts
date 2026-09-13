import { describe, expect, it } from "vitest";
import type { CoreDeskPreloadApi } from "../../packages/contracts/src";

describe("CoreDeskPreloadApi", () => {
  it("contains only the approved foundation and CoreDesk AI surfaces", () => {
    const allowedTopLevelKeys: Array<keyof CoreDeskPreloadApi> = [
      "app",
      "settings",
      "jobs",
      "coredeskAi",
    ];

    expect(allowedTopLevelKeys).toEqual(["app", "settings", "jobs", "coredeskAi"]);
  });
});

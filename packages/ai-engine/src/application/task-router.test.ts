import { describe, expect, it } from "vitest";
import { TaskRouter } from "./task-router";

describe("TaskRouter", () => {
  it("routes the structured task deterministically", () => {
    const router = new TaskRouter();

    expect(router.route("structured-output")).toEqual({
      id: "structured-output.v1",
      task: "structured-output",
      capability: "structured-output",
      prompt: {
        id: "atlas.foundation.structured-output",
        version: "1.0.0",
      },
    });
    expect(router.route("structured-output")).toBe(router.route("structured-output"));
  });

  it("rejects unknown tasks with a safe error", () => {
    expect(() => new TaskRouter().route("unknown-task")).toThrowError(
      "The requested AI task is not supported.",
    );
  });
});

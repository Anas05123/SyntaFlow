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
        id: "coredesk.foundation.structured-output",
        version: "1.0.0",
      },
    });
    expect(router.route("structured-output")).toBe(router.route("structured-output"));
  });

  it("routes CoreDesk AI deterministically to the production prompt", () => {
    const router = new TaskRouter();
    expect(router.route("coredesk-assistant")).toEqual({
      id: "coredesk-assistant.v1",
      task: "coredesk-assistant",
      capability: "structured-output",
      prompt: { id: "coredesk.ai.assistant", version: "1.0.0" },
    });
    expect(router.route("coredesk-assistant")).toBe(router.route("coredesk-assistant"));
  });

  it("rejects unknown tasks with a safe error", () => {
    expect(() => new TaskRouter().route("unknown-task")).toThrowError(
      "The requested AI task is not supported.",
    );
  });
});

import { describe, expect, it } from "vitest";
import { createFoundationPromptRegistry } from "./prompt-registry";

describe("PromptRegistry", () => {
  it("retrieves the registered prompt and its versioned contract", () => {
    const prompt = createFoundationPromptRegistry().get({
      id: "atlas.foundation.structured-output",
      version: "1.0.0",
    });

    expect(prompt).toMatchObject({
      id: "atlas.foundation.structured-output",
      version: "1.0.0",
      expectedOutput: {
        kind: "structured",
      },
    });
    expect(prompt.systemInstructions).toContain("structured result");
    expect(prompt.template).toContain("input.instruction");
  });

  it("rejects an unknown prompt without exposing registry internals", () => {
    expect(() =>
      createFoundationPromptRegistry().get({
        id: "unknown.prompt",
        version: "9.9.9",
      }),
    ).toThrowError("The requested AI prompt is not registered.");
  });
});

import { describe, expect, it } from "vitest";
import { createFoundationPromptRegistry } from "./prompt-registry";

describe("PromptRegistry", () => {
  it("retrieves the registered prompt and its versioned contract", () => {
    const prompt = createFoundationPromptRegistry().get({
      id: "coredesk.foundation.structured-output",
      version: "1.0.0",
    });

    expect(prompt).toMatchObject({
      id: "coredesk.foundation.structured-output",
      version: "1.0.0",
      expectedOutput: {
        kind: "structured",
      },
    });
    expect(prompt.systemInstructions).toContain("structured result");
    expect(prompt.template).toContain("input.instruction");
  });

  it("registers exactly the explicitly versioned CoreDesk assistant output shape", () => {
    const registry = createFoundationPromptRegistry();
    const prompt = registry.get({ id: "coredesk.ai.assistant", version: "1.0.0" });
    expect(prompt.systemInstructions).toContain("CoreDesk AI");
    expect(
      prompt.expectedOutput.schema.safeParse({ kind: "structured", value: { text: "Hello" } })
        .success,
    ).toBe(true);
    for (const value of [
      { answer: "wrong" },
      { text: 5 },
      { text: "Hello", diagnostics: "private" },
      { text: "x".repeat(32_001) },
    ]) {
      expect(prompt.expectedOutput.schema.safeParse({ kind: "structured", value }).success).toBe(
        false,
      );
    }
    expect(() => registry.get({ id: "coredesk.ai.assistant", version: "2.0.0" })).toThrow();
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

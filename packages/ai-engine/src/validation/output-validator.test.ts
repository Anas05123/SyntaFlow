import { describe, expect, it } from "vitest";
import { createFoundationPromptRegistry } from "../prompts/prompt-registry";
import { OutputValidator } from "./output-validator";

const prompt = createFoundationPromptRegistry().get({
  id: "atlas.foundation.structured-output",
  version: "1.0.0",
});

describe("OutputValidator", () => {
  it("accepts output that matches the prompt contract", () => {
    const output = {
      kind: "structured",
      value: {
        summary: "Foundation validated",
      },
    };

    expect(new OutputValidator().validate(prompt, output)).toEqual(output);
  });

  it("rejects malformed output with a safe validation error", () => {
    expect(() =>
      new OutputValidator().validate(prompt, {
        kind: "structured",
        value: "not-an-object",
      }),
    ).toThrowError("The AI provider returned an invalid structured result.");
  });
});

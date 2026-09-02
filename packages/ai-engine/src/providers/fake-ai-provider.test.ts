import { describe, expect, it } from "vitest";
import { ContextBuilder } from "../context/context-builder";
import { createFoundationPromptRegistry } from "../prompts/prompt-registry";
import { FakeAiProvider } from "./fake-ai-provider";
import type { ProviderRequest } from "./ai-provider";

function createRequest(): ProviderRequest {
  return {
    task: "structured-output",
    capability: "structured-output",
    input: {
      instruction: "  Summarize the supplied record  ",
      data: {
        score: 8,
        business: "Atlas Clinic",
      },
    },
    context: new ContextBuilder().build({
      locale: "en",
      facts: {
        source: "fixture",
      },
    }),
    options: {
      privacyMode: "local-only",
      qualityMode: "balanced",
      timeoutMs: 30_000,
    },
    prompt: createFoundationPromptRegistry().get({
      id: "atlas.foundation.structured-output",
      version: "1.0.0",
    }),
  };
}

describe("FakeAiProvider", () => {
  it("returns the same structured output for the same request", async () => {
    const provider = new FakeAiProvider();
    const request = createRequest();

    const first = await provider.execute(request);
    const second = await provider.execute(request);

    expect(first).toEqual(second);
    expect(first).toMatchObject({
      kind: "structured",
      value: {
        task: "structured-output",
        instruction: "Summarize the supplied record",
        context: {
          locale: "en",
          facts: {
            source: "fixture",
          },
        },
      },
    });
  });
});

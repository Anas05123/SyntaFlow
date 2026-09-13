import { describe, expect, it } from "vitest";
import { createFakeAiEngine } from "../testing";

const request = {
  task: "structured-output",
  input: {
    instruction: "Produce a deterministic result",
    data: {
      recordId: "fixture-1",
    },
  },
  context: {
    locale: "en",
    facts: {
      approved: true,
    },
  },
  options: {
    privacyMode: "local-only",
    qualityMode: "fast",
    timeoutMs: 5_000,
  },
} as const;

describe("DefaultAiEngine", () => {
  it("accepts valid fake-provider output as a typed result", async () => {
    const result = await createFakeAiEngine().execute(request);

    expect(result).toMatchObject({
      status: "success",
      metadata: {
        task: "structured-output",
        routeId: "structured-output.v1",
        prompt: {
          id: "coredesk.foundation.structured-output",
          version: "1.0.0",
        },
        provider: {
          id: "fake-ai-provider",
        },
      },
      error: null,
    });
  });

  it("normalizes malformed provider output", async () => {
    const result = await createFakeAiEngine({ providerMode: "malformed-output" }).execute(request);

    if (result.status !== "failed") {
      throw new Error("Expected the malformed output to fail.");
    }
    expect(result.error).toEqual({
      code: "AI_OUTPUT_INVALID",
      message: "The AI provider returned an invalid structured result.",
      category: "provider",
      retryable: true,
    });
  });

  it("normalizes provider exceptions without leaking raw diagnostics", async () => {
    const result = await createFakeAiEngine({ providerMode: "failure" }).execute(request);

    if (result.status !== "failed") {
      throw new Error("Expected the provider failure to be normalized.");
    }
    expect(result.error).toEqual({
      code: "AI_PROVIDER_FAILED",
      message: "The AI provider could not complete the request.",
      category: "provider",
      retryable: true,
    });
    expect(JSON.stringify(result)).not.toContain("fake-provider-private-diagnostic");
  });
});

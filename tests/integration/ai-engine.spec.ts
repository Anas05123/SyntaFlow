import { describe, expect, it } from "vitest";
import type { AiEngineRequest } from "../../packages/ai-engine/src";
import { createFakeAiEngine } from "../../packages/ai-engine/src/testing";

describe("AI Engine foundation integration", () => {
  it("executes the complete deterministic foundation path", async () => {
    const request: AiEngineRequest = {
      task: "structured-output",
      input: {
        instruction: "Summarize the approved fixture",
        data: {
          score: 9,
          business: "Atlas Studio",
        },
      },
      context: {
        locale: "  en-MY  ",
        facts: {
          " source ": "  integration-test  ",
          approved: true,
        },
      },
      options: {
        privacyMode: "local-only",
        qualityMode: "balanced",
        timeoutMs: 10_000,
      },
    };

    const result = await createFakeAiEngine().execute(request);

    expect(result).toEqual({
      status: "success",
      content: {
        kind: "structured",
        value: {
          task: "structured-output",
          prompt: {
            id: "atlas.foundation.structured-output",
            version: "1.0.0",
          },
          instruction: "Summarize the approved fixture",
          data: {
            business: "Atlas Studio",
            score: 9,
          },
          context: {
            locale: "en-MY",
            facts: {
              approved: true,
              source: "integration-test",
            },
          },
          options: {
            privacyMode: "local-only",
            qualityMode: "balanced",
            timeoutMs: 10_000,
          },
        },
      },
      metadata: {
        task: "structured-output",
        routeId: "structured-output.v1",
        prompt: {
          id: "atlas.foundation.structured-output",
          version: "1.0.0",
        },
        provider: {
          id: "fake-ai-provider",
        },
        options: {
          privacyMode: "local-only",
          qualityMode: "balanced",
          timeoutMs: 10_000,
        },
      },
      error: null,
    });
  });
});

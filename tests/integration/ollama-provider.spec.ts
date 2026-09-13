import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AiEngineRequest } from "../../packages/ai-engine/src";
import { createOllamaRuntime } from "../../packages/ai-engine/src/ollama";

const request: AiEngineRequest = {
  task: "structured-output",
  input: {
    instruction: "Summarize the deterministic integration fixture",
    data: {
      recordId: "ollama-integration-1",
    },
  },
  context: {
    locale: "en-MY",
    facts: {
      source: "loopback-server",
    },
  },
  options: {
    privacyMode: "local-only",
    qualityMode: "balanced",
    timeoutMs: 1_000,
  },
};

let server: Server | undefined;
let baseUrl = "";
let generatedContent = JSON.stringify({
  kind: "structured",
  value: {
    summary: "Local transport accepted",
  },
});

beforeAll(async () => {
  server = createServer((incomingRequest, response) => {
    incomingRequest.resume();
    response.setHeader("content-type", "application/json");

    if (incomingRequest.url === "/api/tags") {
      response.end(
        JSON.stringify({
          models: [{ name: "coredesk-test:latest" }],
        }),
      );
      return;
    }

    if (incomingRequest.url === "/api/generate" && incomingRequest.method === "POST") {
      response.end(
        JSON.stringify({
          model: "coredesk-test:latest",
          response: generatedContent,
          done: true,
        }),
      );
      return;
    }

    response.statusCode = 404;
    response.end(JSON.stringify({ error: "not found" }));
  });

  await new Promise<void>((resolve, reject) => {
    if (!server) {
      reject(new Error("Expected the loopback server to be initialized."));
      return;
    }
    const onError = (error: Error): void => reject(error);
    server.once("error", onError);
    server.listen(0, "127.0.0.1", () => {
      server?.off("error", onError);
      resolve();
    });
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Expected the loopback server to have a TCP address.");
  }
  baseUrl = "http://127.0.0.1:" + (address as AddressInfo).port;
});

afterAll(async () => {
  if (!server) return;
  await new Promise<void>((resolve, reject) => {
    server?.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
});

describe("Ollama provider loopback integration", () => {
  it("checks connectivity and executes through the complete AI Engine path", async () => {
    generatedContent = JSON.stringify({
      kind: "structured",
      value: {
        summary: "Local transport accepted",
      },
    });
    const runtime = createOllamaRuntime({
      model: "coredesk-test",
      baseUrl,
    });

    await expect(runtime.checkHealth()).resolves.toEqual({
      status: "available",
      reason: "ready",
      model: "coredesk-test",
      modelAvailable: true,
    });

    const result = await runtime.engine.execute(request);
    expect(result).toMatchObject({
      status: "success",
      content: {
        kind: "structured",
        value: {
          summary: "Local transport accepted",
        },
      },
      metadata: {
        provider: {
          id: "ollama",
        },
      },
      error: null,
    });
  });

  it("routes malformed model content through the existing Output Validator", async () => {
    generatedContent = "not-json-model-output";
    const runtime = createOllamaRuntime({
      model: "coredesk-test",
      baseUrl,
    });

    const result = await runtime.engine.execute(request);

    expect(result).toMatchObject({
      status: "failed",
      content: null,
      error: {
        code: "AI_OUTPUT_INVALID",
        message: "The AI provider returned an invalid structured result.",
        category: "provider",
        retryable: true,
      },
    });
    expect(JSON.stringify(result)).not.toContain("not-json-model-output");
  });
});

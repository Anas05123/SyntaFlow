import { describe, expect, it, vi } from "vitest";
import { ContextBuilder } from "../../context/context-builder";
import { createFoundationPromptRegistry } from "../../prompts/prompt-registry";
import type { ProviderRequest } from "../ai-provider";
import { ProviderAdapter } from "../provider-adapter";
import { DEFAULT_OLLAMA_BASE_URL, OllamaProvider, type OllamaFetch } from "./ollama-provider";

function createRequest(timeoutMs = 1_000): ProviderRequest {
  return {
    task: "structured-output",
    capability: "structured-output",
    input: {
      instruction: "Summarize the supplied record",
      data: {
        business: "Atlas Studio",
        score: 9,
      },
    },
    context: new ContextBuilder().build({
      locale: "en-MY",
      facts: {
        source: "fixture",
      },
    }),
    options: {
      privacyMode: "local-only",
      qualityMode: "balanced",
      timeoutMs,
    },
    prompt: createFoundationPromptRegistry().get({
      id: "atlas.foundation.structured-output",
      version: "1.0.0",
    }),
  };
}

function jsonResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

function abortablePendingFetch(privateDiagnostic: string): OllamaFetch {
  return (_input, init) =>
    new Promise<Response>((_resolve, reject) => {
      init.signal?.addEventListener("abort", () => reject(new Error(privateDiagnostic)), {
        once: true,
      });
    });
}

function stalledResponseBodyFetch(privateDiagnostic: string): OllamaFetch {
  return (_input, init) =>
    Promise.resolve(
      new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            init.signal?.addEventListener(
              "abort",
              () => controller.error(new Error(privateDiagnostic)),
              { once: true },
            );
          },
        }),
      ),
    );
}

describe("OllamaProvider", () => {
  it("uses the safe default endpoint and sends a non-streaming JSON request", async () => {
    const fetchMock = vi.fn<OllamaFetch>(() =>
      Promise.resolve(
        jsonResponse({
          response: JSON.stringify({
            kind: "structured",
            value: {
              summary: "Fixture accepted",
            },
          }),
        }),
      ),
    );
    const provider = new OllamaProvider({ model: "atlas-test" }, { fetch: fetchMock });

    await expect(provider.execute(createRequest())).resolves.toEqual({
      kind: "structured",
      value: {
        summary: "Fixture accepted",
      },
    });

    const call = fetchMock.mock.calls[0];
    if (!call) throw new Error("Expected the mocked transport to be called.");
    const [url, init] = call;
    if (typeof init.body !== "string") {
      throw new Error("Expected the Ollama request body to be serialized JSON.");
    }
    const body = JSON.parse(init.body) as {
      readonly model: string;
      readonly stream: boolean;
      readonly format: string;
      readonly prompt: string;
    };

    expect(url.toString()).toBe(DEFAULT_OLLAMA_BASE_URL + "/api/generate");
    expect(init.method).toBe("POST");
    expect(init.redirect).toBe("error");
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(body).toMatchObject({
      model: "atlas-test",
      stream: false,
      format: "json",
    });
    expect(body.prompt).toContain("Summarize the supplied record");
    expect(body.prompt).toContain("Atlas Studio");
  });

  it("accepts configurable loopback origins and rejects unsafe endpoint shapes", async () => {
    const fetchMock = vi.fn<OllamaFetch>(() =>
      Promise.resolve(
        jsonResponse({
          response: JSON.stringify({ kind: "structured", value: {} }),
        }),
      ),
    );
    const provider = new OllamaProvider(
      {
        model: "atlas-test",
        baseUrl: "http://localhost:22441/",
      },
      { fetch: fetchMock },
    );

    await provider.execute(createRequest());
    expect(fetchMock.mock.calls[0]?.[0].toString()).toBe("http://localhost:22441/api/generate");

    const unsafeBaseUrls = [
      "http://example.com:11434",
      "http://127.0.0.1.example.com:11434",
      "ftp://127.0.0.1:11434",
      "http://user:password@127.0.0.1:11434",
      "http://127.0.0.1:11434/proxy",
      "http://127.0.0.1:11434?target=remote",
      "http://127.0.0.1:11434#fragment",
      "http://127.0.0.1:11434?",
      "http://127.0.0.1:11434#",
      "http://127.0.0.1:11434/path/..",
      "http://127.0.0.1:11434/%2e%2e",
      "http://127.0.0.1:11434/./",
      "http://127.0.0.1:11434\\",
      "http://@127.0.0.1:11434",
      "http://127.0.0.\n1:11434",
      "http://[::ffff:127.0.0.1]:11434",
    ];

    for (const baseUrl of unsafeBaseUrls) {
      expect(() => new OllamaProvider({ model: "atlas-test", baseUrl })).toThrowError(
        "The Ollama provider configuration is invalid.",
      );
    }
  });

  it("rejects invalid model and health timeout configuration safely", () => {
    expect(() => new OllamaProvider({ model: "" })).toThrowError(
      "The Ollama provider configuration is invalid.",
    );
    expect(() => new OllamaProvider({ model: "atlas test" })).toThrowError(
      "The Ollama provider configuration is invalid.",
    );
    expect(() => new OllamaProvider({ model: "atlas-test", healthTimeoutMs: 0 })).toThrowError(
      "The Ollama provider configuration is invalid.",
    );
  });

  it("reports ready and missing-model health without exposing the model list", async () => {
    const readyProvider = new OllamaProvider(
      { model: "atlas-test" },
      {
        fetch: () =>
          Promise.resolve(
            jsonResponse({
              models: [{ name: "atlas-test:latest", digest: "private-model-digest" }],
            }),
          ),
      },
    );
    const missingProvider = new OllamaProvider(
      { model: "missing-model" },
      {
        fetch: () => Promise.resolve(jsonResponse({ models: [{ name: "another-model:latest" }] })),
      },
    );

    const ready = await readyProvider.checkHealth();
    const missing = await missingProvider.checkHealth();

    expect(ready).toEqual({
      status: "available",
      reason: "ready",
      model: "atlas-test",
      modelAvailable: true,
    });
    expect(missing).toEqual({
      status: "degraded",
      reason: "model-unavailable",
      model: "missing-model",
      modelAvailable: false,
    });
    expect(JSON.stringify(ready)).not.toContain("private-model-digest");
  });

  it("normalizes connectivity failures into a sanitized unavailable health result", async () => {
    const provider = new OllamaProvider(
      { model: "atlas-test" },
      {
        fetch: () => Promise.reject(new Error("private-connection-diagnostic")),
      },
    );

    const health = await provider.checkHealth();

    expect(health).toEqual({
      status: "unavailable",
      reason: "connection-failed",
      model: "atlas-test",
      modelAvailable: false,
    });
    expect(JSON.stringify(health)).not.toContain("private-connection-diagnostic");
  });

  it("aborts health checks at the configured bound", async () => {
    const provider = new OllamaProvider(
      {
        model: "atlas-test",
        healthTimeoutMs: 5,
      },
      {
        fetch: abortablePendingFetch("private-health-timeout-diagnostic"),
      },
    );

    const health = await provider.checkHealth();

    expect(health).toEqual({
      status: "unavailable",
      reason: "timed-out",
      model: "atlas-test",
      modelAvailable: false,
    });
    expect(JSON.stringify(health)).not.toContain("private-health-timeout-diagnostic");
  });

  it("maps request timeouts through the provider adapter to a safe engine fault", async () => {
    const provider = new OllamaProvider(
      { model: "atlas-test" },
      {
        fetch: abortablePendingFetch("private-request-timeout-diagnostic"),
      },
    );
    const adapter = new ProviderAdapter(provider);

    await expect(adapter.execute(createRequest(5))).rejects.toMatchObject({
      safeError: {
        code: "AI_PROVIDER_TIMEOUT",
        message: "The AI provider request timed out.",
        category: "provider",
        retryable: true,
      },
    });
  });

  it("keeps the request timeout active while consuming the response body", async () => {
    const provider = new OllamaProvider(
      { model: "atlas-test" },
      {
        fetch: stalledResponseBodyFetch("private-body-timeout-diagnostic"),
      },
    );

    await expect(new ProviderAdapter(provider).execute(createRequest(5))).rejects.toMatchObject({
      safeError: {
        code: "AI_PROVIDER_TIMEOUT",
        message: "The AI provider request timed out.",
        category: "provider",
        retryable: true,
      },
    });
  });

  it("maps unavailable and provider HTTP failures without leaking response details", async () => {
    const unavailableProvider = new OllamaProvider(
      { model: "atlas-test" },
      {
        fetch: () => Promise.reject(new Error("private-network-diagnostic")),
      },
    );
    const failedProvider = new OllamaProvider(
      { model: "atlas-test" },
      {
        fetch: () => Promise.resolve(new Response("private-provider-response", { status: 500 })),
      },
    );

    await expect(
      new ProviderAdapter(unavailableProvider).execute(createRequest()),
    ).rejects.toMatchObject({
      safeError: {
        code: "AI_PROVIDER_UNAVAILABLE",
        message: "The AI provider is unavailable.",
        category: "provider",
        retryable: true,
      },
    });
    await expect(
      new ProviderAdapter(failedProvider).execute(createRequest()),
    ).rejects.toMatchObject({
      safeError: {
        code: "AI_PROVIDER_FAILED",
        message: "The AI provider could not complete the request.",
        category: "provider",
        retryable: true,
      },
    });
  });
});

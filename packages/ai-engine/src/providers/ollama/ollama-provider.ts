import { z } from "zod";
import { AiEngineFault } from "../../domain/engine-error";
import type { AiProvider, ProviderRequest } from "../ai-provider";
import { ProviderFault } from "../provider-fault";

export const DEFAULT_OLLAMA_BASE_URL = "http://127.0.0.1:11434";

const defaultHealthTimeoutMs = 2_000;
const maximumHealthTimeoutMs = 10_000;
const maximumResponseCharacters = 1_000_000;
const localHostnames = new Set(["127.0.0.1", "localhost", "[::1]"]);
const modelNamePattern = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/;

const generateResponseSchema = z
  .object({
    response: z.string(),
  })
  .passthrough();

const tagsResponseSchema = z
  .object({
    models: z.array(
      z
        .object({
          model: z.string().optional(),
          name: z.string().optional(),
          remote_model: z.string().nullish(),
          remote_host: z.string().nullish(),
        })
        .passthrough(),
    ),
  })
  .passthrough();

export interface OllamaProviderConfig {
  readonly model: string;
  readonly baseUrl?: string;
  readonly healthTimeoutMs?: number;
}

export type OllamaHealth =
  | {
      readonly status: "available";
      readonly reason: "ready";
      readonly model: string;
      readonly modelAvailable: true;
    }
  | {
      readonly status: "degraded";
      readonly reason: "model-unavailable";
      readonly model: string;
      readonly modelAvailable: false;
    }
  | {
      readonly status: "unavailable";
      readonly reason: "connection-failed" | "timed-out" | "provider-failed";
      readonly model: string;
      readonly modelAvailable: false;
    };

export type OllamaFetch = (input: URL, init: RequestInit) => Promise<Response>;

export interface OllamaProviderDependencies {
  readonly fetch?: OllamaFetch;
}

interface NormalizedOllamaProviderConfig {
  readonly model: string;
  readonly baseUrl: string;
  readonly healthTimeoutMs: number;
}

interface OllamaHttpResponse {
  readonly ok: boolean;
  readonly status: number;
  readonly body: unknown;
}

export class OllamaProvider implements AiProvider {
  readonly id = "ollama";
  readonly #model: string;
  readonly #baseUrl: string;
  readonly #healthTimeoutMs: number;
  readonly #fetch: OllamaFetch;

  constructor(config: OllamaProviderConfig, dependencies: OllamaProviderDependencies = {}) {
    const normalizedConfig = normalizeConfig(config);
    this.#model = normalizedConfig.model;
    this.#baseUrl = normalizedConfig.baseUrl;
    this.#healthTimeoutMs = normalizedConfig.healthTimeoutMs;
    this.#fetch = dependencies.fetch ?? defaultFetch;
  }

  supports(capability: ProviderRequest["capability"]): boolean {
    return capability === "structured-output";
  }

  async execute(request: ProviderRequest): Promise<unknown> {
    const response = await this.#requestJson(
      "api/generate",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(createGenerateRequest(this.#model, request)),
      },
      request.options.timeoutMs,
    );

    if (!response.ok) {
      throw failureForStatus(response.status);
    }

    const envelope = generateResponseSchema.safeParse(response.body);
    if (!envelope.success) {
      throw new ProviderFault("failed");
    }

    return parseGeneratedContent(envelope.data.response);
  }

  async checkHealth(): Promise<OllamaHealth> {
    try {
      const response = await this.#requestJson(
        "api/tags",
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
        this.#healthTimeoutMs,
      );

      if (!response.ok) {
        return unavailableHealth(this.#model, healthReasonForStatus(response.status));
      }

      const envelope = tagsResponseSchema.safeParse(response.body);
      if (!envelope.success) {
        return unavailableHealth(this.#model, "provider-failed");
      }

      const modelAvailable = envelope.data.models.some(
        (candidate) =>
          !candidate.remote_model &&
          !candidate.remote_host &&
          (modelMatches(this.#model, candidate.model) || modelMatches(this.#model, candidate.name)),
      );

      if (!modelAvailable) {
        return {
          status: "degraded",
          reason: "model-unavailable",
          model: this.#model,
          modelAvailable: false,
        };
      }

      return {
        status: "available",
        reason: "ready",
        model: this.#model,
        modelAvailable: true,
      };
    } catch (error: unknown) {
      return unavailableHealth(this.#model, healthReasonForError(error));
    }
  }

  async #requestJson(
    path: string,
    init: RequestInit,
    timeoutMs: number,
  ): Promise<OllamaHttpResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await this.#fetch(new URL(path, this.#baseUrl + "/"), {
        ...init,
        redirect: "error",
        signal: controller.signal,
      });
      return {
        ok: response.ok,
        status: response.status,
        body: response.ok ? await readJsonResponse(response) : null,
      };
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        throw new ProviderFault("timeout");
      }
      if (error instanceof ProviderFault) {
        throw error;
      }
      throw new ProviderFault("unavailable");
    } finally {
      clearTimeout(timeout);
    }
  }
}

const defaultFetch: OllamaFetch = (input, init) => globalThis.fetch(input, init);

function normalizeConfig(config: OllamaProviderConfig): NormalizedOllamaProviderConfig {
  if (
    !config ||
    typeof config.model !== "string" ||
    (config.baseUrl !== undefined && typeof config.baseUrl !== "string") ||
    (config.healthTimeoutMs !== undefined && typeof config.healthTimeoutMs !== "number")
  ) {
    throw configurationFault();
  }

  const model = normalizeOllamaModel(config.model);
  const healthTimeoutMs = config.healthTimeoutMs ?? defaultHealthTimeoutMs;

  if (
    !Number.isInteger(healthTimeoutMs) ||
    healthTimeoutMs < 1 ||
    healthTimeoutMs > maximumHealthTimeoutMs
  ) {
    throw configurationFault();
  }

  return {
    model,
    baseUrl: normalizeOllamaBaseUrl(config.baseUrl ?? DEFAULT_OLLAMA_BASE_URL),
    healthTimeoutMs,
  };
}

export function normalizeOllamaModel(value: string): string {
  const model = value.trim();
  if (!modelNamePattern.test(model) || /(?:^|[-:])cloud(?:$|:)/i.test(model))
    throw configurationFault();
  return model;
}

export function normalizeOllamaBaseUrl(baseUrl: string): string {
  // Check the original shape before URL parsing can erase paths or empty suffixes.
  if (!/^https?:\/\/(?:127\.0\.0\.1|localhost|\[::1\])(?::[0-9]{1,5})?\/?$/i.test(baseUrl.trim())) {
    throw configurationFault();
  }
  let parsed: URL;
  try {
    parsed = new URL(baseUrl.trim());
  } catch {
    throw configurationFault();
  }

  const isLocalHostname = localHostnames.has(parsed.hostname.toLowerCase());
  const hasSafeProtocol = parsed.protocol === "http:" || parsed.protocol === "https:";
  const hasRootPath = parsed.pathname === "/";
  const hasNoCredentials = !parsed.username && !parsed.password;
  const hasNoSuffix = !parsed.search && !parsed.hash;

  if (!isLocalHostname || !hasSafeProtocol || !hasRootPath || !hasNoCredentials || !hasNoSuffix) {
    throw configurationFault();
  }

  return parsed.origin;
}

function configurationFault(): AiEngineFault {
  return new AiEngineFault({
    code: "AI_OPTIONS_INVALID",
    message: "The Ollama provider configuration is invalid.",
    category: "validation",
    retryable: false,
  });
}

function createGenerateRequest(model: string, request: ProviderRequest): object {
  const requestContext = {
    task: request.task,
    prompt: {
      id: request.prompt.id,
      version: request.prompt.version,
    },
    input: request.input,
    context: request.context,
    options: {
      privacyMode: request.options.privacyMode,
      qualityMode: request.options.qualityMode,
    },
  };

  return {
    model,
    system: request.prompt.systemInstructions,
    prompt: [
      request.prompt.template,
      'Return JSON only with the exact outer shape {"kind":"structured","value":{...}}.',
      "Request:",
      JSON.stringify(requestContext),
    ].join("\n\n"),
    stream: false,
    format: "json",
  };
}

async function readJsonResponse(response: Response): Promise<unknown> {
  let body: string;
  try {
    body = await response.text();
  } catch {
    throw new ProviderFault("failed");
  }

  if (!body || body.length > maximumResponseCharacters) {
    throw new ProviderFault("failed");
  }

  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new ProviderFault("failed");
  }
}

function parseGeneratedContent(response: string): unknown {
  try {
    return JSON.parse(response) as unknown;
  } catch {
    return response;
  }
}

function failureForStatus(status: number): ProviderFault {
  if (status === 408 || status === 504) {
    return new ProviderFault("timeout");
  }
  if (status === 404 || status === 503) {
    return new ProviderFault("unavailable");
  }
  return new ProviderFault("failed");
}

function healthReasonForStatus(status: number): "timed-out" | "provider-failed" {
  return status === 408 || status === 504 ? "timed-out" : "provider-failed";
}

function healthReasonForError(
  error: unknown,
): "connection-failed" | "timed-out" | "provider-failed" {
  if (error instanceof ProviderFault) {
    if (error.kind === "unavailable") return "connection-failed";
    if (error.kind === "timeout") return "timed-out";
  }
  return "provider-failed";
}

function unavailableHealth(
  model: string,
  reason: "connection-failed" | "timed-out" | "provider-failed",
): OllamaHealth {
  return {
    status: "unavailable",
    reason,
    model,
    modelAvailable: false,
  };
}

function modelMatches(configuredModel: string, candidate: string | undefined): boolean {
  if (!candidate) return false;
  return candidate === configuredModel || candidate === configuredModel + ":latest";
}

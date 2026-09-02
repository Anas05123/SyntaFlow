import type { JsonObject, JsonValue } from "../domain/contracts";
import type { AiProvider, ProviderRequest } from "./ai-provider";

export type FakeAiProviderMode = "success" | "malformed-output" | "failure";

export class FakeAiProvider implements AiProvider {
  readonly id = "fake-ai-provider";

  constructor(private readonly mode: FakeAiProviderMode = "success") {}

  supports(capability: ProviderRequest["capability"]): boolean {
    return capability === "structured-output";
  }

  execute(request: ProviderRequest): Promise<unknown> {
    if (this.mode === "failure") {
      return Promise.reject(new Error("fake-provider-private-diagnostic"));
    }

    if (this.mode === "malformed-output") {
      return Promise.resolve({
        kind: "structured",
        value: "malformed",
      });
    }

    return Promise.resolve({
      kind: "structured",
      value: {
        task: request.task,
        prompt: {
          id: request.prompt.id,
          version: request.prompt.version,
        },
        instruction: request.input.instruction.trim(),
        data: normalizeJsonObject(request.input.data),
        context: {
          locale: request.context.locale,
          facts: normalizeJsonObject(request.context.facts),
        },
        options: {
          privacyMode: request.options.privacyMode,
          qualityMode: request.options.qualityMode,
          timeoutMs: request.options.timeoutMs,
        },
      },
    });
  }
}

function normalizeJsonObject(value: Readonly<Record<string, JsonValue>>): JsonObject {
  const normalized: Record<string, JsonValue> = {};
  const entries = Object.entries(value).sort(([left], [right]) => compareKeys(left, right));

  for (const [key, entryValue] of entries) {
    normalized[key] = normalizeJsonValue(entryValue);
  }

  return normalized;
}

function normalizeJsonValue(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return (value as readonly JsonValue[]).map((item) => normalizeJsonValue(item));
  }
  if (value !== null && typeof value === "object") {
    return normalizeJsonObject(value as JsonObject);
  }
  return value;
}

function compareKeys(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

import type { AiRequestContext, JsonPrimitive } from "../domain/contracts";
import { AiEngineFault } from "../domain/engine-error";

export interface NormalizedAiContext {
  readonly locale: string;
  readonly facts: Readonly<Record<string, JsonPrimitive>>;
}

export class ContextBuilder {
  build(context: AiRequestContext | undefined): NormalizedAiContext {
    const locale = context?.locale?.trim() || "en";
    const facts: Record<string, JsonPrimitive> = {};
    const entries = Object.entries(context?.facts ?? {})
      .map(([key, value]) => [key.trim(), normalizeFact(value)] as const)
      .sort(([left], [right]) => compareKeys(left, right));

    for (const [key, value] of entries) {
      if (!key || Object.prototype.hasOwnProperty.call(facts, key)) {
        throw new AiEngineFault({
          code: "AI_CONTEXT_INVALID",
          message: "The supplied AI context could not be normalized.",
          category: "validation",
          retryable: false,
        });
      }
      facts[key] = value;
    }

    return {
      locale,
      facts,
    };
  }
}

function normalizeFact(value: JsonPrimitive): JsonPrimitive {
  return typeof value === "string" ? value.trim() : value;
}

function compareKeys(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

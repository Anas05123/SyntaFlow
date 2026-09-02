import type { z } from "zod";
import type { AiEngineContent } from "../domain/contracts";
import { AiEngineFault } from "../domain/engine-error";
import type { PromptReference } from "../application/task-router";
import { aiEngineContentSchema } from "../validation/ai-content-schema";

export interface PromptDefinition {
  readonly id: string;
  readonly version: string;
  readonly systemInstructions: string;
  readonly template: string;
  readonly expectedOutput: {
    readonly kind: "structured";
    readonly schema: z.ZodType<AiEngineContent>;
  };
}

const foundationStructuredPrompt: PromptDefinition = Object.freeze({
  id: "atlas.foundation.structured-output",
  version: "1.0.0",
  systemInstructions:
    "Return one structured result that matches the registered output contract. Do not include provider diagnostics.",
  template:
    "Follow input.instruction using only input.data and the explicitly supplied normalized context.",
  expectedOutput: Object.freeze({
    kind: "structured",
    schema: aiEngineContentSchema,
  }),
});

export class PromptRegistry {
  readonly #definitions = new Map<string, PromptDefinition>();

  constructor(definitions: readonly PromptDefinition[]) {
    for (const definition of definitions) {
      const key = promptKey(definition);
      if (this.#definitions.has(key)) {
        throw new AiEngineFault({
          code: "AI_ENGINE_FAILED",
          message: "The AI prompt registry contains a duplicate definition.",
          category: "system",
          retryable: false,
        });
      }
      this.#definitions.set(key, definition);
    }
  }

  get(reference: PromptReference): PromptDefinition {
    const definition = this.#definitions.get(promptKey(reference));
    if (!definition) {
      throw new AiEngineFault({
        code: "AI_PROMPT_NOT_FOUND",
        message: "The requested AI prompt is not registered.",
        category: "not-found",
        retryable: false,
      });
    }
    return definition;
  }
}

export function createFoundationPromptRegistry(): PromptRegistry {
  return new PromptRegistry([foundationStructuredPrompt]);
}

function promptKey(reference: PromptReference): string {
  return reference.id + "@" + reference.version;
}

import { z } from "zod";
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
  id: "coredesk.foundation.structured-output",
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

const coredeskAssistantPrompt: PromptDefinition = Object.freeze({
  id: "coredesk.ai.assistant",
  version: "1.0.0",
  systemInstructions:
    'You are CoreDesk AI, a professional local assistant. Answer the user clearly and concisely. Be honest about uncertainty and never claim to access files, tools, or the internet. Return only JSON with the shape {"kind":"structured","value":{"text":"your plain-text answer"}}. Do not include provider diagnostics.',
  template:
    "Answer input.instruction. Put the complete answer in value.text, using plain text without Markdown formatting.",
  expectedOutput: Object.freeze({
    kind: "structured",
    schema: z
      .object({
        kind: z.literal("structured"),
        value: z.object({ text: z.string().max(32_000) }).strict(),
      })
      .strict(),
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
  return new PromptRegistry([foundationStructuredPrompt, coredeskAssistantPrompt]);
}

function promptKey(reference: PromptReference): string {
  return reference.id + "@" + reference.version;
}

import type { AiEngineContent } from "../domain/contracts";
import { AiEngineFault } from "../domain/engine-error";
import type { PromptDefinition } from "../prompts/prompt-registry";

export class OutputValidator {
  validate(prompt: PromptDefinition, providerOutput: unknown): AiEngineContent {
    const result = prompt.expectedOutput.schema.safeParse(providerOutput);
    if (!result.success) {
      throw new AiEngineFault({
        code: "AI_OUTPUT_INVALID",
        message: "The AI provider returned an invalid structured result.",
        category: "provider",
        retryable: true,
      });
    }
    return result.data;
  }
}

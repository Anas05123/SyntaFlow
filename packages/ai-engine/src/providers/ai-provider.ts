import type {
  AiPrivacyMode,
  AiQualityMode,
  AiTask,
  StructuredOutputInput,
} from "../domain/contracts";
import type { AiProviderCapability } from "../application/task-router";
import type { NormalizedAiContext } from "../context/context-builder";
import type { PromptDefinition } from "../prompts/prompt-registry";

export interface NormalizedAiRequestOptions {
  readonly privacyMode: AiPrivacyMode;
  readonly qualityMode: AiQualityMode;
  readonly timeoutMs: number;
}

export interface ProviderRequest {
  readonly task: AiTask;
  readonly capability: AiProviderCapability;
  readonly input: StructuredOutputInput;
  readonly context: NormalizedAiContext;
  readonly options: NormalizedAiRequestOptions;
  readonly prompt: PromptDefinition;
}

export interface AiProvider {
  readonly id: string;
  supports(capability: AiProviderCapability): boolean;
  execute(request: ProviderRequest): Promise<unknown>;
}

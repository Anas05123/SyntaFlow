import { DefaultAiEngine } from "./application/default-ai-engine";
import { TaskRouter } from "./application/task-router";
import { ContextBuilder } from "./context/context-builder";
import type { AiEngine } from "./domain/contracts";
import { createFoundationPromptRegistry } from "./prompts/prompt-registry";
import { FakeAiProvider, type FakeAiProviderMode } from "./providers/fake-ai-provider";
import { ProviderAdapter } from "./providers/provider-adapter";
import { OutputValidator } from "./validation/output-validator";

export interface FakeAiEngineOptions {
  readonly providerMode?: FakeAiProviderMode;
}

export function createFakeAiEngine(options: FakeAiEngineOptions = {}): AiEngine {
  return new DefaultAiEngine(
    new TaskRouter(),
    new ContextBuilder(),
    createFoundationPromptRegistry(),
    new ProviderAdapter(new FakeAiProvider(options.providerMode)),
    new OutputValidator(),
  );
}

export { FakeAiProvider };
export type { FakeAiProviderMode };

import { DefaultAiEngine } from "./application/default-ai-engine";
import { TaskRouter } from "./application/task-router";
import { ContextBuilder } from "./context/context-builder";
import type { AiEngine } from "./domain/contracts";
import { createFoundationPromptRegistry } from "./prompts/prompt-registry";
import {
  OllamaProvider,
  type OllamaHealth,
  type OllamaProviderConfig,
} from "./providers/ollama/ollama-provider";
import { ProviderAdapter } from "./providers/provider-adapter";
import { OutputValidator } from "./validation/output-validator";

export interface OllamaRuntime {
  readonly engine: AiEngine;
  checkHealth(): Promise<OllamaHealth>;
}

export function createOllamaRuntime(config: OllamaProviderConfig): OllamaRuntime {
  const provider = new OllamaProvider(config);
  const engine = new DefaultAiEngine(
    new TaskRouter(),
    new ContextBuilder(),
    createFoundationPromptRegistry(),
    new ProviderAdapter(provider),
    new OutputValidator(),
  );

  return Object.freeze({
    engine,
    checkHealth: () => provider.checkHealth(),
  });
}

export {
  DEFAULT_OLLAMA_BASE_URL,
  normalizeOllamaBaseUrl,
  normalizeOllamaModel,
} from "./providers/ollama/ollama-provider";
export type { OllamaHealth, OllamaProviderConfig } from "./providers/ollama/ollama-provider";

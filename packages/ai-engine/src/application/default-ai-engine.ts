import type {
  AiEngine,
  AiEngineRequest,
  AiEngineResult,
  AiRequestOptions,
} from "../domain/contracts";
import { normalizeAiEngineError, AiEngineFault } from "../domain/engine-error";
import type { ContextBuilder } from "../context/context-builder";
import type { PromptRegistry } from "../prompts/prompt-registry";
import type { NormalizedAiRequestOptions } from "../providers/ai-provider";
import type { ProviderAdapter } from "../providers/provider-adapter";
import type { OutputValidator } from "../validation/output-validator";
import type { TaskRouter } from "./task-router";

const defaultTimeoutMs = 30_000;
const maximumTimeoutMs = 120_000;

export class DefaultAiEngine implements AiEngine {
  constructor(
    private readonly router: TaskRouter,
    private readonly contextBuilder: ContextBuilder,
    private readonly promptRegistry: PromptRegistry,
    private readonly providerAdapter: ProviderAdapter,
    private readonly outputValidator: OutputValidator,
  ) {}

  async execute(request: AiEngineRequest): Promise<AiEngineResult> {
    try {
      const route = this.router.route(request.task);
      const context = this.contextBuilder.build(request.context);
      const prompt = this.promptRegistry.get(route.prompt);
      const options = normalizeOptions(request.options);
      const providerExecution = await this.providerAdapter.execute({
        task: route.task,
        capability: route.capability,
        input: request.input,
        context,
        options,
        prompt,
      });
      const content = this.outputValidator.validate(prompt, providerExecution.output);

      return {
        status: "success",
        content,
        metadata: {
          task: route.task,
          routeId: route.id,
          prompt: {
            id: prompt.id,
            version: prompt.version,
          },
          provider: {
            id: providerExecution.providerId,
          },
          options,
        },
        error: null,
      };
    } catch (error: unknown) {
      return {
        status: "failed",
        content: null,
        metadata: {
          task: request.task,
        },
        error: normalizeAiEngineError(error),
      };
    }
  }
}

function normalizeOptions(options: AiRequestOptions | undefined): NormalizedAiRequestOptions {
  const timeoutMs = options?.timeoutMs ?? defaultTimeoutMs;
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > maximumTimeoutMs) {
    throw new AiEngineFault({
      code: "AI_OPTIONS_INVALID",
      message: "The AI request options are invalid.",
      category: "validation",
      retryable: false,
    });
  }

  return {
    privacyMode: options?.privacyMode ?? "local-only",
    qualityMode: options?.qualityMode ?? "balanced",
    timeoutMs,
  };
}

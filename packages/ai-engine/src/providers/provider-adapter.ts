import { AiEngineFault } from "../domain/engine-error";
import type { AiProvider, ProviderRequest } from "./ai-provider";
import { ProviderFault } from "./provider-fault";

export interface ProviderExecution {
  readonly providerId: string;
  readonly output: unknown;
}

export class ProviderAdapter {
  constructor(private readonly provider: AiProvider) {}

  async execute(request: ProviderRequest): Promise<ProviderExecution> {
    let isSupported = false;
    try {
      isSupported = this.provider.supports(request.capability);
    } catch (error: unknown) {
      throw providerFailure(error);
    }

    if (!isSupported) {
      throw new AiEngineFault({
        code: "AI_PROVIDER_UNAVAILABLE",
        message: "No AI provider supports the requested capability.",
        category: "provider",
        retryable: true,
      });
    }

    try {
      return {
        providerId: this.provider.id,
        output: await this.provider.execute(request),
      };
    } catch (error: unknown) {
      throw providerFailure(error);
    }
  }
}

function providerFailure(error?: unknown): AiEngineFault {
  if (error instanceof ProviderFault) {
    if (error.kind === "unavailable") {
      return new AiEngineFault({
        code: "AI_PROVIDER_UNAVAILABLE",
        message: "The AI provider is unavailable.",
        category: "provider",
        retryable: true,
      });
    }

    if (error.kind === "timeout") {
      return new AiEngineFault({
        code: "AI_PROVIDER_TIMEOUT",
        message: "The AI provider request timed out.",
        category: "provider",
        retryable: true,
      });
    }
  }

  return new AiEngineFault({
    code: "AI_PROVIDER_FAILED",
    message: "The AI provider could not complete the request.",
    category: "provider",
    retryable: true,
  });
}

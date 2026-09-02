import { AiEngineFault } from "../domain/engine-error";
import type { AiProvider, ProviderRequest } from "./ai-provider";

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
    } catch {
      throw providerFailure();
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
    } catch {
      throw providerFailure();
    }
  }
}

function providerFailure(): AiEngineFault {
  return new AiEngineFault({
    code: "AI_PROVIDER_FAILED",
    message: "The AI provider could not complete the request.",
    category: "provider",
    retryable: true,
  });
}

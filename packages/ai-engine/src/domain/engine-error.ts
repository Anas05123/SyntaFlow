import type { AiEngineError } from "./contracts";

export class AiEngineFault extends Error {
  readonly safeError: AiEngineError;

  constructor(safeError: AiEngineError) {
    super(safeError.message);
    this.name = "AiEngineFault";
    this.safeError = safeError;
  }
}

export function normalizeAiEngineError(error: unknown): AiEngineError {
  if (error instanceof AiEngineFault) {
    return { ...error.safeError };
  }

  return {
    code: "AI_ENGINE_FAILED",
    message: "The AI request failed safely.",
    category: "system",
    retryable: false,
  };
}

export type JsonPrimitive = string | number | boolean | null;

export interface JsonObject {
  readonly [key: string]: JsonValue;
}

export type JsonValue = JsonPrimitive | JsonObject | readonly JsonValue[];

export type AiTask = "structured-output";
export type AiPrivacyMode = "local-only" | "external-approved";
export type AiQualityMode = "fast" | "balanced" | "quality";

export interface StructuredOutputInput {
  readonly instruction: string;
  readonly data: JsonObject;
}

export interface AiRequestContext {
  readonly locale?: string;
  readonly facts?: Readonly<Record<string, JsonPrimitive>>;
}

export interface AiRequestOptions {
  readonly privacyMode?: AiPrivacyMode;
  readonly qualityMode?: AiQualityMode;
  readonly timeoutMs?: number;
}

export interface AiEngineRequest {
  readonly task: AiTask;
  readonly input: StructuredOutputInput;
  readonly context?: AiRequestContext;
  readonly options?: AiRequestOptions;
}

export interface AiEngineContent {
  readonly kind: "structured";
  readonly value: JsonObject;
}

export type AiEngineErrorCode =
  | "AI_TASK_UNSUPPORTED"
  | "AI_CONTEXT_INVALID"
  | "AI_OPTIONS_INVALID"
  | "AI_PROMPT_NOT_FOUND"
  | "AI_PROVIDER_UNAVAILABLE"
  | "AI_PROVIDER_FAILED"
  | "AI_OUTPUT_INVALID"
  | "AI_ENGINE_FAILED";

export interface AiEngineError {
  readonly code: AiEngineErrorCode;
  readonly message: string;
  readonly category: "validation" | "not-found" | "provider" | "system";
  readonly retryable: boolean;
}

export interface AiEngineSuccessMetadata {
  readonly task: AiTask;
  readonly routeId: string;
  readonly prompt: {
    readonly id: string;
    readonly version: string;
  };
  readonly provider: {
    readonly id: string;
  };
  readonly options: {
    readonly privacyMode: AiPrivacyMode;
    readonly qualityMode: AiQualityMode;
    readonly timeoutMs: number;
  };
}

export interface AiEngineSuccess {
  readonly status: "success";
  readonly content: AiEngineContent;
  readonly metadata: AiEngineSuccessMetadata;
  readonly error: null;
}

export interface AiEngineFailure {
  readonly status: "failed";
  readonly content: null;
  readonly metadata: {
    readonly task: string;
  };
  readonly error: AiEngineError;
}

export type AiEngineResult = AiEngineSuccess | AiEngineFailure;

export interface AiEngine {
  execute(request: AiEngineRequest): Promise<AiEngineResult>;
}

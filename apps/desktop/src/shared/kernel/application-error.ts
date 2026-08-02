export type ApplicationErrorCategory =
  "validation" | "permission" | "not-found" | "conflict" | "provider" | "security" | "system";

export class AtlasApplicationError extends Error {
  readonly code: string;
  readonly category: ApplicationErrorCategory;
  readonly retryable: boolean;
  readonly userAction?: string;

  constructor(input: {
    code: string;
    message: string;
    category: ApplicationErrorCategory;
    retryable: boolean;
    userAction?: string;
  }) {
    super(input.message);
    this.name = "AtlasApplicationError";
    this.code = input.code;
    this.category = input.category;
    this.retryable = input.retryable;
    if (input.userAction) {
      this.userAction = input.userAction;
    }
  }
}

export interface SafeApplicationError {
  code: string;
  message: string;
  category: ApplicationErrorCategory;
  retryable: boolean;
  userAction?: string;
}

export function toSafeApplicationError(error: unknown): SafeApplicationError {
  if (error instanceof AtlasApplicationError) {
    return {
      code: error.code,
      message: error.message,
      category: error.category,
      retryable: error.retryable,
      ...(error.userAction ? { userAction: error.userAction } : {}),
    };
  }

  return {
    code: "ATLAS_SYSTEM_ERROR",
    message: "The operation failed safely.",
    category: "system",
    retryable: false,
  };
}

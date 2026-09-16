import { z } from "zod";
import type { CoreDeskAiGenerateInput, CoreDeskAiResult, CoreDeskAiStatus } from "./ai";
export * from "./ai";
export * from "./redact-secrets";
export * from "./integrations";
export * from "./auth";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  appName: z.literal("CoreDesk"),
  version: z.string().min(1),
  services: z.object({
    appDataPath: z.enum(["healthy", "degraded", "unavailable"]),
    settings: z.enum(["healthy", "degraded", "unavailable"]),
    logger: z.enum(["healthy", "degraded", "unavailable"]),
    jobs: z.enum(["healthy", "degraded", "unavailable"]),
    migrations: z.enum(["healthy", "degraded", "unavailable"]),
    database: z.enum(["healthy", "degraded", "unavailable"]),
  }),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const settingsSchema = z.object({
  themeMode: z.enum(["system", "light", "dark"]),
  logLevel: z.enum(["debug", "info", "warn", "error", "security"]),
  ollamaBaseUrl: z.string().max(256).url(),
  ollamaModel: z.string().trim().max(200),
  defaultAIPrivacyMode: z.enum(["local-only", "external-approved"]),
  appDataPathDisplay: z.string().min(1),
});

export const settingsUpdateSchema = settingsSchema.partial().strict();

export type SafeSettings = z.infer<typeof settingsSchema>;

export const jobRecordSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  state: z.enum(["queued", "running", "completed", "failed", "cancelled"]),
  progress: z.number().min(0).max(100),
  attempts: z.number().int().min(0),
  maxAttempts: z.number().int().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  error: z
    .object({
      code: z.string().min(1),
      message: z.string().min(1),
      category: z.enum([
        "validation",
        "permission",
        "not-found",
        "conflict",
        "provider",
        "security",
        "system",
      ]),
      retryable: z.boolean(),
      userAction: z.string().optional(),
    })
    .optional(),
});

export const jobsResponseSchema = z.object({
  jobs: z.array(jobRecordSchema),
});

export type JobRecord = z.infer<typeof jobRecordSchema>;
export type JobsResponse = z.infer<typeof jobsResponseSchema>;

export interface CoreDeskPreloadApi {
  coredeskAi: {
    getStatus(): Promise<CoreDeskAiStatus>;
    generate(input: CoreDeskAiGenerateInput): Promise<CoreDeskAiResult>;
  };
  app: {
    health(): Promise<HealthResponse>;
  };
  settings: {
    read(): Promise<SafeSettings>;
    update(patch: Partial<SafeSettings>): Promise<SafeSettings>;
  };
  jobs: {
    list(): Promise<JobsResponse>;
  };
}

export type ApplicationErrorCategory =
  "validation" | "permission" | "not-found" | "conflict" | "provider" | "security" | "system";

export interface ApplicationError {
  code: string;
  message: string;
  category: ApplicationErrorCategory;
  retryable: boolean;
  userAction?: string;
}

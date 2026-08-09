import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  appName: z.literal("AI Agency OS"),
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

export interface AtlasPreloadApi {
  app: {
    health(): Promise<HealthResponse>;
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

import { z } from "zod";

export const COREDESK_AI_PROMPT_MAX_CHARACTERS = 12_000;
export const COREDESK_AI_RESPONSE_MAX_CHARACTERS = 32_000;

export const coredeskAiGenerateInputSchema = z
  .object({
    prompt: z
      .string()
      .max(COREDESK_AI_PROMPT_MAX_CHARACTERS)
      .trim()
      .min(1)
      .refine((value) =>
        [...value].every((character) => {
          const code = character.charCodeAt(0);
          return (code >= 32 && code !== 127) || code === 9 || code === 10 || code === 13;
        }),
      ),
  })
  .strict();

export const coredeskAiStatusSchema = z
  .object({
    status: z.enum(["unconfigured", "unavailable", "model-unavailable", "ready", "error"]),
  })
  .strict();

export const coredeskAiFailureCodeSchema = z.enum([
  "invalid-prompt",
  "unconfigured",
  "unavailable",
  "model-unavailable",
  "provider-failed",
  "invalid-output",
  "empty-response",
  "busy",
  "error",
]);

export const coredeskAiResultSchema = z.discriminatedUnion("status", [
  z
    .object({
      status: z.literal("success"),
      text: z.string().trim().min(1).max(COREDESK_AI_RESPONSE_MAX_CHARACTERS),
    })
    .strict(),
  z.object({ status: z.literal("failed"), code: coredeskAiFailureCodeSchema }).strict(),
]);

export type CoreDeskAiGenerateInput = z.infer<typeof coredeskAiGenerateInputSchema>;
export type CoreDeskAiStatus = z.infer<typeof coredeskAiStatusSchema>;
export type CoreDeskAiResult = z.infer<typeof coredeskAiResultSchema>;
export type CoreDeskAiFailureCode = z.infer<typeof coredeskAiFailureCodeSchema>;

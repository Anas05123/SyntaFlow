import { z } from "zod";
import type { AiEngineContent, JsonObject, JsonValue } from "../domain/contracts";

const jsonPrimitiveSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([jsonPrimitiveSchema, z.array(jsonValueSchema), z.record(z.string(), jsonValueSchema)]),
);

export const jsonObjectSchema: z.ZodType<JsonObject> = z.record(z.string(), jsonValueSchema);

export const aiEngineContentSchema: z.ZodType<AiEngineContent> = z
  .object({
    kind: z.literal("structured"),
    value: jsonObjectSchema,
  })
  .strict();

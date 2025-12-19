import { BaseEntitySchema } from "./base_schema.js";
import { z } from "zod";

export const UseCaseSchema = BaseEntitySchema.extend({
    type: z.literal("use_case"),
    primaryActor: z.string(),
    mainFlow: z.array(z.string())
});

export type UseCase = z.infer<typeof UseCaseSchema>;
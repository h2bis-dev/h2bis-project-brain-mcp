import { BaseEntitySchema } from "./base_schema.js";
import { z } from "zod";

export const FeatureSchema = BaseEntitySchema.extend({
    // MongoDB auto-generated field (optional for validation)
    _id: z.any().optional(),

    type: z.literal("feature"),
    businessValue: z.string(),
    acceptanceCriteria: z.array(z.string())
});

export type Feature = z.infer<typeof FeatureSchema>;
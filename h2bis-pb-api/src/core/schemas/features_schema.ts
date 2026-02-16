import { z } from "zod";

// Base Entity Schema definition inline since base_schema.ts was removed
const BaseEntitySchema = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string(),
    status: z.object({
        lifecycle: z.string().optional()
    }).optional(),
    tags: z.array(z.string()).optional(),
    audit: z.object({
        createdAt: z.date().optional(),
        updatedAt: z.date().optional()
    }).optional()
});

export const FeatureSchema = BaseEntitySchema.extend({
    // MongoDB auto-generated field (optional for validation)
    _id: z.any().optional(),

    type: z.literal("feature"),
    businessValue: z.string(),
    acceptanceCriteria: z.array(z.string())
});

export type Feature = z.infer<typeof FeatureSchema>;
import { z } from "zod";

export const BaseEntitySchema = z.object({
    type: z.string(),          // discriminator
    key: z.string(),
    name: z.string(),
    description: z.string(),

    status: z.object({
        lifecycle: z.enum([
            "idea",
            "planned",
            "in_development",
            "ai_generated",
            "human_reviewed",
            "completed"
        ]),
        reviewedByHuman: z.boolean(),
        generatedByAI: z.boolean()
    }).strict(),

    relationships: z.array(
        z.object({
            type: z.string(),
            targetType: z.string(),
            targetKey: z.string()
        }).strict()
    ).default([]),

    scope: z.object({
        frontend: z.boolean(),
        backend: z.boolean(),
        services: z.boolean()
    }).strict()
}).strict();

export type BaseEntity = z.infer<typeof BaseEntitySchema>;
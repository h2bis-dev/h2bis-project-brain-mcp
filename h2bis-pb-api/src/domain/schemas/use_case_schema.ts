import { BaseEntitySchema } from "./base_schema.js";
import { z } from "zod";

const AcceptanceCriteriaSchema = z.array(z.string());

const FlowSchema = z.object({
    name: z.string(),
    steps: z.array(z.string()),
    type: z.enum(["main", "alternative", "error"]).default("main")
});

const DataCollectionSchema = z.object({
    name: z.string(),
    purpose: z.string(),
    operations: z.array(
        z.enum(["CREATE", "READ", "UPDATE", "DELETE"])
    )
});

const TechnicalSurfaceSchema = z.object({
    backend: z.object({
        repos: z.array(z.string()),
        endpoints: z.array(z.string()).default([]),
        collections: z.array(DataCollectionSchema).default([])
    }).strict(),

    frontend: z.object({
        repos: z.array(z.string()),
        routes: z.array(z.string()).default([]),
        components: z.array(z.string()).default([])
    }).strict()
});

const AIMetadataSchema = z.object({
    estimatedComplexity: z.enum(["low", "medium", "high"]),
    implementationRisk: z.array(z.string()).default([]),
    suggestedOrder: z.number().optional(),
    testStrategy: z.array(z.string()).default([]),
    nonFunctionalRequirements: z.array(z.string()).default([]),
    normativeMode: z.boolean().optional(),
    insufficiencyReasons: z.array(z.string()).optional(),
    // Skip LLM validation (use with caution - validation runs by default)
    skipValidation: z.boolean().optional()
});

/* ---------- Helper Functions for Defaults ---------- */

/**
 * Create default AI metadata for backward compatibility
 * Estimates complexity as "medium" by default
 */
export const createDefaultAIMetadata = () => ({
    estimatedComplexity: "medium" as const,
    implementationRisk: [],
    testStrategy: [],
    nonFunctionalRequirements: []
});

/**
 * Create default audit information
 * @param user - Username to attribute creation/update to (defaults to "system")
 */
export const createDefaultAudit = (user: string = "system") => ({
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: user,
    updatedBy: user
});

/* ---------- Use Case Schema ---------- */

export const HandlerSchema = z.object({
    // MongoDB auto-generated field (optional for validation)
    _id: z.any().optional(),

    type: z.literal("use_case"),
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

    businessValue: z.string(),

    primaryActor: z.string(),

    acceptanceCriteria: AcceptanceCriteriaSchema,

    flows: z.array(FlowSchema),

    technicalSurface: TechnicalSurfaceSchema,

    relationships: z.array(
        z.object({
            type: z.enum([
                "depends_on",
                "extends",
                "implements",
                "conflicts_with",
                "related_to"
            ]),
            targetType: z.string(),
            targetKey: z.string(),
            reason: z.string().optional()
        })
    ).default([]),

    implementationRisk: z.array(z.object({
        rule: z.string(),
        normative: z.boolean().default(false)
    })).default([]),

    tags: z.array(z.string()).default([]),

    // Normative flag: if true, system will reject generation if metadata is incomplete
    normative: z.boolean().default(false),

    // Optional with defaults for backward compatibility
    aiMetadata: AIMetadataSchema.optional().default(createDefaultAIMetadata),

    // Optional with defaults for backward compatibility
    audit: z.object({
        createdAt: z.date(),
        updatedAt: z.date(),
        createdBy: z.string(),
        updatedBy: z.string()
    }).optional().default(createDefaultAudit)
}).strict();

/* ---------- Type Exports ---------- */

export type Handler = z.infer<typeof HandlerSchema>;
export type AIMetadata = z.infer<typeof AIMetadataSchema>;
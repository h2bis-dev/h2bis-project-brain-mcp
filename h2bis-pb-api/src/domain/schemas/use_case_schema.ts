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

const FunctionalRequirementsSchema = z.object({
    must: z.array(z.string()).default([]),
    should: z.array(z.string()).default([]),
    wont: z.array(z.string()).default([])
});

const ScopeSchema = z.object({
    inScope: z.array(z.string()).default([]),
    outOfScope: z.array(z.string()).default([]),
    assumptions: z.array(z.string()).default([]),
    constraints: z.array(z.string()).default([])
});

const DomainEntityFieldSchema = z.object({
    name: z.string(),
    type: z.string(),
    required: z.boolean(),
    constraints: z.array(z.string()).default([])
});

const DomainEntitySchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    fields: z.array(DomainEntityFieldSchema).default([])
});

const DomainModelSchema = z.object({
    entities: z.array(DomainEntitySchema).default([])
});

const InterfaceEndpointSchema = z.object({
    method: z.string(),
    path: z.string(),
    request: z.string().optional(),
    response: z.string().optional()
});

const InterfacesSchema = z.object({
    type: z.enum(["REST", "GraphQL", "Event", "UI"]),
    endpoints: z.array(InterfaceEndpointSchema).default([]),
    events: z.array(z.string()).default([])
});

const ErrorHandlingSchema = z.object({
    knownErrors: z.array(z.object({
        condition: z.string(),
        expectedBehavior: z.string()
    })).default([])
});

const ArchitectureSchema = z.object({
    style: z.enum(["layered", "clean", "hexagonal", "event-driven"]),
    patterns: z.array(z.string()).default([])
});

const TechnologyConstraintsSchema = z.object({
    backend: z.string().optional(),
    frontend: z.string().optional(),
    database: z.string().optional(),
    messaging: z.string().optional(),
    auth: z.string().optional()
});

const ConfigurationSchema = z.object({
    envVars: z.array(z.string()).default([]),
    featureFlags: z.array(z.string()).default([])
});

const QualitySchema = z.object({
    testTypes: z.array(z.enum(["unit", "integration", "e2e", "security"])).default([]),
    performanceCriteria: z.array(z.string()).default([]),
    securityConsiderations: z.array(z.string()).default([])
});

const AIDirectivesSchema = z.object({
    generationLevel: z.enum(["skeleton", "partial", "full"]),
    overwritePolicy: z.enum(["never", "ifEmpty", "always"])
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
            "completed",
            // Keeping existing but adding requested ones just in case needed in future, 
            // though user asked to keep existing.
            // "approved", "in_progress", "implemented" - omitted as per user request
        ]),
        reviewedByHuman: z.boolean(),
        generatedByAI: z.boolean()
    }).strict(),

    stakeholders: z.array(z.string()).optional(),

    businessValue: z.string(),

    primaryActor: z.string(),

    functionalRequirements: FunctionalRequirementsSchema.optional(),

    scope: ScopeSchema.optional(),

    domainModel: DomainModelSchema.optional(),

    interfaces: InterfacesSchema.optional(),

    errorHandling: ErrorHandlingSchema.optional(),

    architecture: ArchitectureSchema.optional(),

    technologyConstraints: TechnologyConstraintsSchema.optional(),

    configuration: ConfigurationSchema.optional(),

    quality: QualitySchema.optional(),

    aiDirectives: AIDirectivesSchema.optional(),

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
export type FunctionalRequirements = z.infer<typeof FunctionalRequirementsSchema>;
export type Scope = z.infer<typeof ScopeSchema>;
export type DomainModel = z.infer<typeof DomainModelSchema>;
export type Interfaces = z.infer<typeof InterfacesSchema>;
export type ErrorHandling = z.infer<typeof ErrorHandlingSchema>;
export type Architecture = z.infer<typeof ArchitectureSchema>;
export type AIDirectives = z.infer<typeof AIDirectivesSchema>;
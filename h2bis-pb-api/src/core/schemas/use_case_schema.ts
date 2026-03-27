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
        repos: z.array(z.string()).default([]),
        endpoints: z.array(z.string()).default([]),
        collections: z.array(DataCollectionSchema).default([])
    }).strict(),

    frontend: z.object({
        repos: z.array(z.string()).default([]),
        routes: z.array(z.string()).default([]),
        components: z.array(z.string()).default([])
    }).strict()
});

const ServiceInterfaceSchema = z.object({
    serviceId: z.string(),
    serviceName: z.string(),
    serviceType: z.string(),
    interfaceType: z.enum(["REST", "GraphQL", "Event", "UI"]),
    endpoints: z.array(z.object({
        method: z.string(),
        path: z.string(),
        request: z.string().optional(),
        response: z.string().optional()
    })).default([]),
    events: z.array(z.string()).default([])
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

/* ---------- Use Case Schema ---------- */

export const UseCaseSchema = z.object({
    _id: z.any().optional(),

    // Foreign key to project
    projectId: z.string(),

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
    }).default({
        lifecycle: "idea",
        reviewedByHuman: false,
        generatedByAI: false
    }),

    stakeholders: z.array(z.string()).optional(),

    businessValue: z.string(),

    primaryActor: z.string(),

    functionalRequirements: FunctionalRequirementsSchema.optional(),

    scope: ScopeSchema.optional(),

    interfaces: InterfacesSchema.optional(),

    errorHandling: ErrorHandlingSchema.optional(),

    quality: QualitySchema.optional(),

    aiDirectives: AIDirectivesSchema.optional(),

    acceptanceCriteria: AcceptanceCriteriaSchema.default([]),

    flows: z.array(FlowSchema).default([]),

    technicalSurface: TechnicalSurfaceSchema.default({
        backend: { repos: [], endpoints: [], collections: [] },
        frontend: { repos: [], routes: [], components: [] }
    }),

    serviceInterfaces: z.array(ServiceInterfaceSchema).optional().default([]),

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
    aiMetadata: AIMetadataSchema.optional().default({
        estimatedComplexity: "medium",
        implementationRisk: [],
        testStrategy: [],
        nonFunctionalRequirements: []
    }),

    // Audit trail (Created/Updated timestamps)
    audit: z.object({
        createdAt: z.date(),
        updatedAt: z.date(),
        createdBy: z.string(),
        updatedBy: z.string()
    }).optional()
}).strict();

/* ---------- Type Exports ---------- */


export type UseCase = z.infer<typeof UseCaseSchema>;
export type AIMetadata = z.infer<typeof AIMetadataSchema>;
export type FunctionalRequirements = z.infer<typeof FunctionalRequirementsSchema>;
export type Scope = z.infer<typeof ScopeSchema>;
export type Interfaces = z.infer<typeof InterfacesSchema>;
export type ErrorHandling = z.infer<typeof ErrorHandlingSchema>;

/* ---------- Factories ---------- */

export type CreateUseCaseProps = Partial<UseCase>;

/**
 * Factory function to create a standardized Use Case object
 * Relies on Zod Schema for defaults to keep logic simple and centralized.
 */
export const createUseCase = (props: CreateUseCaseProps, userId: string = "system"): UseCase => {
    // 1. Prepare minimal required fields that Zod requires (if not provided in props)
    const defaults = {
        projectId: "", // Must be provided by caller
        type: "use_case" as const,
        key: "",
        name: "",
        description: "",
        businessValue: "",
        primaryActor: "",
        audit: {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userId,
            updatedBy: userId
        }
    };

    // 2. Merge and parse
    // usage of 'parse' ensures the Output object strictly adheres to UseCaseSchema
    return UseCaseSchema.parse({
        ...defaults,
        ...props
    });
};

import { z } from "zod";

/* ---------- Relationship Schema ---------- */

export const RelationshipSchema = z.object({
    type: z.enum([
        "depends_on",
        "extends",
        "compatible_with",
        "conflicts_with",
        "shares_data_with",
        "shares_api_with"
    ]),
    targetKey: z.string(),
    reason: z.string().optional()
});

/* ---------- Capability Node Schema ---------- */

export const CapabilityNodeSchema = z.object({
    id: z.string(),
    kind: z.enum(["use_case", "feature", "service", "data_entity"]),

    intent: z.object({
        userGoal: z.string(),
        systemResponsibility: z.string(),
        businessValue: z.string()
    }),

    behavior: z.object({
        acceptanceCriteria: z.array(z.string()),
        flows: z.array(z.object({
            name: z.string(),
            steps: z.array(z.string()),
            type: z.enum(["main", "alternative", "error"]).default("main")
        }))
    }),

    realization: z.object({
        frontend: z.object({
            routes: z.array(z.string()),
            components: z.array(z.string())
        }).optional(),

        backend: z.object({
            endpoints: z.array(z.string()),
            services: z.array(z.string())
        }).optional(),

        data: z.array(z.object({
            name: z.string(),
            purpose: z.string(),
            operations: z.array(z.enum(["CREATE", "READ", "UPDATE", "DELETE"]))
        })).optional()
    }),

    dependencies: z.array(z.object({
        on: z.string(),
        type: z.enum(["hard", "soft"]),
        reason: z.string()
    })).default([]),

    aiHints: z.object({
        complexityScore: z.number().min(1).max(10), // 1–10
        recommendedChunking: z.array(z.string()).default([]),
        failureModes: z.array(z.string()).default([]),
        testFocusAreas: z.array(z.string()).default([])
    }),
    lifecycle: z.object({
        status: z.string(),
        maturity: z.enum(["draft", "stable", "deprecated"])
    }),

    tags: z.array(z.string()).default([]),

    responsibilityAnnotations: z.array(z.object({
        responsibility: z.string(),
        origin: z.enum(["explicit", "derived", "recommended"]),
        traceability: z.string().optional(), // quote / section / reason
        reviewRequired: z.boolean().default(false),
        scope: z.enum(["in_scope", "adjacent", "out_of_scope"]).default("in_scope")
    })).min(0),

    recommendations: z.array(z.object({
        category: z.enum([
            "security",
            "performance",
            "maintainability",
            "scalability",
            "testing"
        ]),
        suggestion: z.string(),
        rationale: z.string(),
        basedOn: z.string(), // what triggered it
        requiresHumanApproval: z.literal(true)
    })).optional(),

    intentIntegrity: z.object({
        modifiedFromSource: z.boolean().default(false),
        modificationReason: z.string().optional(),
        approvedByHuman: z.boolean().default(false)
    }).optional(),

    confidenceBreakdown: z.object({
        clarity: z.enum(["high", "medium", "low"]),
        completeness: z.enum(["high", "medium", "low"]),
        ambiguityLevel: z.enum(["low", "medium", "high"])
    }).optional(),

    // NEW: Implementation progress tracking
    implementation: z.object({
        status: z.enum([
            "not_started",
            "in_progress",
            "code_complete",
            "tests_complete",
            "docs_complete",
            "deployed"
        ]),
        completionPercentage: z.number().min(0).max(100),
        lastUpdated: z.date(),
        blockers: z.array(z.string()).default([])
    }).optional(),

    // NEW: Intent Analysis from LLM (for traceability and verification)
    intentAnalysis: z.object({
        userGoal: z.string(),
        systemResponsibilities: z.array(z.string()),
        businessContext: z.string(),
        technicalComponents: z.object({
            frontend: z.object({
                routes: z.array(z.string()),
                components: z.array(z.string())
            }),
            backend: z.object({
                endpoints: z.array(z.string()),
                services: z.array(z.string())
            }),
            data: z.array(z.object({
                entity: z.string(),
                operations: z.array(z.enum(["CREATE", "READ", "UPDATE", "DELETE"]))
            }))
        }),
        assumptions: z.array(z.string()),
        ambiguities: z.array(z.string()),
        missingInformation: z.array(z.string()),
        securityConsiderations: z.array(z.string()),
        confidenceLevel: z.enum(["high", "medium", "low"]),
        extractedAt: z.date(),
        llmModel: z.string(),
        promptVersion: z.string()
    }).optional(),

    // NEW: Review workflow for human oversight
    review: z.object({
        status: z.enum(["pending", "approved", "rejected", "revision_requested"]),
        requiredReason: z.string().optional(),  // Why review is needed
        reviewedBy: z.string().optional(),
        reviewedAt: z.date().optional(),
        feedback: z.string().optional(),
        corrections: z.object({
            userGoal: z.string().optional(),
            systemResponsibilities: z.array(z.string()).optional(),
            businessContext: z.string().optional()
        }).optional()
    }).optional(),

    // NEW: Source traceability
    sourceUseCaseId: z.string().optional(),
    transformedAt: z.date().optional(),

    // Schema version for migration support
    schemaVersion: z.number().default(1)
}).strict();

/* ---------- Type Exports ---------- */

export type CapabilityNode = z.infer<typeof CapabilityNodeSchema>;
export type Relationship = z.infer<typeof RelationshipSchema>;
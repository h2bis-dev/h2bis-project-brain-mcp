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

    // NEW: Artifact linkage for LLM development support
    artifacts: z.object({
        source: z.array(z.object({
            path: z.string(),
            type: z.enum(["class", "function", "module", "component"]),
            description: z.string()
        })).default([]),

        tests: z.array(z.object({
            path: z.string(),
            coverage: z.number().optional(),
            lastRun: z.date().optional()
        })).default([]),

        documentation: z.array(z.object({
            path: z.string(),
            type: z.enum(["api", "tutorial", "architecture"])
        })).default([])
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

    // NEW: Source traceability
    sourceUseCaseId: z.string().optional(),
    transformedAt: z.date().optional(),

    // Schema version for migration support
    schemaVersion: z.number().default(1)
}).strict();

/* ---------- Type Exports ---------- */

export type CapabilityNode = z.infer<typeof CapabilityNodeSchema>;
export type Relationship = z.infer<typeof RelationshipSchema>;
/**
 * Use Case module barrel
 *
 * Exports the complete list of MCP tool definitions for the use case domain.
 * tools/index.ts spreads this array — it never imports individual files from this module.
 * Adding a new use case tool only requires changes inside this module.
 */
import { listUseCases } from './tools/listUseCases.js';
import { getUseCaseById } from './tools/getUseCaseById.js';
import { createUseCase } from './tools/createUseCase.js';
import { updateUseCase } from './tools/updateUseCase.js';
import { enhanceUseCase } from './tools/enhanceUseCase.js';
import { updateUseCaseWithAI } from './tools/updateUseCaseWithAI.js';
export declare const useCaseTools: ({
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        projectId: import("zod").ZodOptional<import("zod").ZodString>;
        limit: import("zod").ZodDefault<import("zod").ZodNumber>;
        offset: import("zod").ZodDefault<import("zod").ZodNumber>;
    }, "strip", import("zod").ZodTypeAny, {
        limit: number;
        offset: number;
        projectId?: string | undefined;
    }, {
        projectId?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }>;
    handler: typeof listUseCases;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        useCaseId: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        useCaseId: string;
    }, {
        useCaseId: string;
    }>;
    handler: typeof getUseCaseById;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        key: import("zod").ZodString;
        projectId: import("zod").ZodOptional<import("zod").ZodString>;
        name: import("zod").ZodString;
        description: import("zod").ZodString;
        businessValue: import("zod").ZodOptional<import("zod").ZodString>;
        primaryActor: import("zod").ZodOptional<import("zod").ZodString>;
        acceptanceCriteria: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        stakeholders: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        status: import("zod").ZodOptional<import("zod").ZodObject<{
            lifecycle: import("zod").ZodOptional<import("zod").ZodEnum<["idea", "planned", "in_development", "ai_generated", "human_reviewed", "completed"]>>;
            reviewedByHuman: import("zod").ZodOptional<import("zod").ZodBoolean>;
            generatedByAI: import("zod").ZodOptional<import("zod").ZodBoolean>;
        }, "strip", import("zod").ZodTypeAny, {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        }, {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        }>>;
        functionalRequirements: import("zod").ZodOptional<import("zod").ZodObject<{
            must: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            should: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            wont: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        }, {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        }>>;
        scope: import("zod").ZodOptional<import("zod").ZodObject<{
            inScope: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            outOfScope: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            assumptions: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            constraints: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        }, {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        }>>;
        interfaces: import("zod").ZodOptional<import("zod").ZodObject<{
            type: import("zod").ZodDefault<import("zod").ZodEnum<["REST", "GraphQL", "Event", "UI"]>>;
            endpoints: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                method: import("zod").ZodString;
                path: import("zod").ZodString;
                request: import("zod").ZodOptional<import("zod").ZodString>;
                response: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }, {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }>, "many">>>;
            events: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
        }, "strip", import("zod").ZodTypeAny, {
            type: "REST" | "GraphQL" | "Event" | "UI";
            endpoints: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[];
            events: string[];
        }, {
            type?: "REST" | "GraphQL" | "Event" | "UI" | undefined;
            endpoints?: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[] | undefined;
            events?: string[] | undefined;
        }>>;
        errorHandling: import("zod").ZodOptional<import("zod").ZodObject<{
            knownErrors: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                condition: import("zod").ZodString;
                expectedBehavior: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                condition: string;
                expectedBehavior: string;
            }, {
                condition: string;
                expectedBehavior: string;
            }>, "many">>>;
        }, "strip", import("zod").ZodTypeAny, {
            knownErrors: {
                condition: string;
                expectedBehavior: string;
            }[];
        }, {
            knownErrors?: {
                condition: string;
                expectedBehavior: string;
            }[] | undefined;
        }>>;
        quality: import("zod").ZodOptional<import("zod").ZodObject<{
            testTypes: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["unit", "integration", "e2e", "security"]>, "many">>>;
            performanceCriteria: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            securityConsiderations: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
        }, "strip", import("zod").ZodTypeAny, {
            testTypes: ("unit" | "integration" | "e2e" | "security")[];
            performanceCriteria: string[];
            securityConsiderations: string[];
        }, {
            testTypes?: ("unit" | "integration" | "e2e" | "security")[] | undefined;
            performanceCriteria?: string[] | undefined;
            securityConsiderations?: string[] | undefined;
        }>>;
        aiDirectives: import("zod").ZodOptional<import("zod").ZodObject<{
            generationLevel: import("zod").ZodDefault<import("zod").ZodEnum<["skeleton", "partial", "full"]>>;
            overwritePolicy: import("zod").ZodDefault<import("zod").ZodEnum<["never", "ifEmpty", "always"]>>;
        }, "strip", import("zod").ZodTypeAny, {
            generationLevel: "skeleton" | "partial" | "full";
            overwritePolicy: "never" | "ifEmpty" | "always";
        }, {
            generationLevel?: "skeleton" | "partial" | "full" | undefined;
            overwritePolicy?: "never" | "ifEmpty" | "always" | undefined;
        }>>;
        flows: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            name: import("zod").ZodString;
            steps: import("zod").ZodArray<import("zod").ZodString, "many">;
            type: import("zod").ZodDefault<import("zod").ZodEnum<["main", "alternative", "error"]>>;
        }, "strip", import("zod").ZodTypeAny, {
            type: "error" | "main" | "alternative";
            name: string;
            steps: string[];
        }, {
            name: string;
            steps: string[];
            type?: "error" | "main" | "alternative" | undefined;
        }>, "many">>;
        technicalSurface: import("zod").ZodOptional<import("zod").ZodObject<{
            backend: import("zod").ZodOptional<import("zod").ZodObject<{
                repos: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                endpoints: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                collections: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    purpose: import("zod").ZodString;
                    operations: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["CREATE", "READ", "UPDATE", "DELETE"]>, "many">>>;
                }, "strip", import("zod").ZodTypeAny, {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }, {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }>, "many">>>;
            }, "strip", import("zod").ZodTypeAny, {
                endpoints: string[];
                repos: string[];
                collections: {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }[];
            }, {
                endpoints?: string[] | undefined;
                repos?: string[] | undefined;
                collections?: {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }[] | undefined;
            }>>;
            frontend: import("zod").ZodOptional<import("zod").ZodObject<{
                repos: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                routes: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                components: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            }, "strip", import("zod").ZodTypeAny, {
                repos: string[];
                routes: string[];
                components: string[];
            }, {
                repos?: string[] | undefined;
                routes?: string[] | undefined;
                components?: string[] | undefined;
            }>>;
        }, "strip", import("zod").ZodTypeAny, {
            backend?: {
                endpoints: string[];
                repos: string[];
                collections: {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }[];
            } | undefined;
            frontend?: {
                repos: string[];
                routes: string[];
                components: string[];
            } | undefined;
        }, {
            backend?: {
                endpoints?: string[] | undefined;
                repos?: string[] | undefined;
                collections?: {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }[] | undefined;
            } | undefined;
            frontend?: {
                repos?: string[] | undefined;
                routes?: string[] | undefined;
                components?: string[] | undefined;
            } | undefined;
        }>>;
        relationships: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            type: import("zod").ZodEnum<["depends_on", "extends", "implements", "conflicts_with", "related_to"]>;
            targetType: import("zod").ZodString;
            targetKey: import("zod").ZodString;
            reason: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }, {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }>, "many">>;
        implementationRisk: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            rule: import("zod").ZodString;
            normative: import("zod").ZodDefault<import("zod").ZodBoolean>;
        }, "strip", import("zod").ZodTypeAny, {
            rule: string;
            normative: boolean;
        }, {
            rule: string;
            normative?: boolean | undefined;
        }>, "many">>;
        tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        normative: import("zod").ZodOptional<import("zod").ZodBoolean>;
        aiMetadata: import("zod").ZodOptional<import("zod").ZodObject<{
            estimatedComplexity: import("zod").ZodOptional<import("zod").ZodEnum<["low", "medium", "high"]>>;
            implementationRisk: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            testStrategy: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            nonFunctionalRequirements: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            suggestedOrder: import("zod").ZodOptional<import("zod").ZodNumber>;
            normativeMode: import("zod").ZodOptional<import("zod").ZodBoolean>;
            insufficiencyReasons: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            implementationRisk: string[];
            testStrategy: string[];
            nonFunctionalRequirements: string[];
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        }, {
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            implementationRisk?: string[] | undefined;
            testStrategy?: string[] | undefined;
            nonFunctionalRequirements?: string[] | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        }>>;
    }, "strip", import("zod").ZodTypeAny, {
        name: string;
        description: string;
        key: string;
        status?: {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        } | undefined;
        errorHandling?: {
            knownErrors: {
                condition: string;
                expectedBehavior: string;
            }[];
        } | undefined;
        projectId?: string | undefined;
        normative?: boolean | undefined;
        implementationRisk?: {
            rule: string;
            normative: boolean;
        }[] | undefined;
        businessValue?: string | undefined;
        primaryActor?: string | undefined;
        acceptanceCriteria?: string[] | undefined;
        stakeholders?: string[] | undefined;
        functionalRequirements?: {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        } | undefined;
        scope?: {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        } | undefined;
        interfaces?: {
            type: "REST" | "GraphQL" | "Event" | "UI";
            endpoints: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[];
            events: string[];
        } | undefined;
        quality?: {
            testTypes: ("unit" | "integration" | "e2e" | "security")[];
            performanceCriteria: string[];
            securityConsiderations: string[];
        } | undefined;
        aiDirectives?: {
            generationLevel: "skeleton" | "partial" | "full";
            overwritePolicy: "never" | "ifEmpty" | "always";
        } | undefined;
        flows?: {
            type: "error" | "main" | "alternative";
            name: string;
            steps: string[];
        }[] | undefined;
        technicalSurface?: {
            backend?: {
                endpoints: string[];
                repos: string[];
                collections: {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }[];
            } | undefined;
            frontend?: {
                repos: string[];
                routes: string[];
                components: string[];
            } | undefined;
        } | undefined;
        relationships?: {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }[] | undefined;
        tags?: string[] | undefined;
        aiMetadata?: {
            implementationRisk: string[];
            testStrategy: string[];
            nonFunctionalRequirements: string[];
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        } | undefined;
    }, {
        name: string;
        description: string;
        key: string;
        status?: {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        } | undefined;
        errorHandling?: {
            knownErrors?: {
                condition: string;
                expectedBehavior: string;
            }[] | undefined;
        } | undefined;
        projectId?: string | undefined;
        normative?: boolean | undefined;
        implementationRisk?: {
            rule: string;
            normative?: boolean | undefined;
        }[] | undefined;
        businessValue?: string | undefined;
        primaryActor?: string | undefined;
        acceptanceCriteria?: string[] | undefined;
        stakeholders?: string[] | undefined;
        functionalRequirements?: {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        } | undefined;
        scope?: {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        } | undefined;
        interfaces?: {
            type?: "REST" | "GraphQL" | "Event" | "UI" | undefined;
            endpoints?: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[] | undefined;
            events?: string[] | undefined;
        } | undefined;
        quality?: {
            testTypes?: ("unit" | "integration" | "e2e" | "security")[] | undefined;
            performanceCriteria?: string[] | undefined;
            securityConsiderations?: string[] | undefined;
        } | undefined;
        aiDirectives?: {
            generationLevel?: "skeleton" | "partial" | "full" | undefined;
            overwritePolicy?: "never" | "ifEmpty" | "always" | undefined;
        } | undefined;
        flows?: {
            name: string;
            steps: string[];
            type?: "error" | "main" | "alternative" | undefined;
        }[] | undefined;
        technicalSurface?: {
            backend?: {
                endpoints?: string[] | undefined;
                repos?: string[] | undefined;
                collections?: {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }[] | undefined;
            } | undefined;
            frontend?: {
                repos?: string[] | undefined;
                routes?: string[] | undefined;
                components?: string[] | undefined;
            } | undefined;
        } | undefined;
        relationships?: {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }[] | undefined;
        tags?: string[] | undefined;
        aiMetadata?: {
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            implementationRisk?: string[] | undefined;
            testStrategy?: string[] | undefined;
            nonFunctionalRequirements?: string[] | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        } | undefined;
    }>;
    handler: typeof createUseCase;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        useCaseId: import("zod").ZodString;
        name: import("zod").ZodOptional<import("zod").ZodString>;
        description: import("zod").ZodOptional<import("zod").ZodString>;
        businessValue: import("zod").ZodOptional<import("zod").ZodString>;
        primaryActor: import("zod").ZodOptional<import("zod").ZodString>;
        acceptanceCriteria: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        stakeholders: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        status: import("zod").ZodOptional<import("zod").ZodObject<{
            lifecycle: import("zod").ZodOptional<import("zod").ZodEnum<["idea", "planned", "in_development", "ai_generated", "human_reviewed", "completed"]>>;
            reviewedByHuman: import("zod").ZodOptional<import("zod").ZodBoolean>;
            generatedByAI: import("zod").ZodOptional<import("zod").ZodBoolean>;
        }, "strip", import("zod").ZodTypeAny, {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        }, {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        }>>;
        functionalRequirements: import("zod").ZodOptional<import("zod").ZodObject<{
            must: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            should: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            wont: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        }, {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        }>>;
        scope: import("zod").ZodOptional<import("zod").ZodObject<{
            inScope: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            outOfScope: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            assumptions: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            constraints: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        }, {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        }>>;
        interfaces: import("zod").ZodOptional<import("zod").ZodObject<{
            type: import("zod").ZodDefault<import("zod").ZodEnum<["REST", "GraphQL", "Event", "UI"]>>;
            endpoints: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                method: import("zod").ZodString;
                path: import("zod").ZodString;
                request: import("zod").ZodOptional<import("zod").ZodString>;
                response: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }, {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }>, "many">>>;
            events: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
        }, "strip", import("zod").ZodTypeAny, {
            type: "REST" | "GraphQL" | "Event" | "UI";
            endpoints: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[];
            events: string[];
        }, {
            type?: "REST" | "GraphQL" | "Event" | "UI" | undefined;
            endpoints?: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[] | undefined;
            events?: string[] | undefined;
        }>>;
        errorHandling: import("zod").ZodOptional<import("zod").ZodObject<{
            knownErrors: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                condition: import("zod").ZodString;
                expectedBehavior: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                condition: string;
                expectedBehavior: string;
            }, {
                condition: string;
                expectedBehavior: string;
            }>, "many">>>;
        }, "strip", import("zod").ZodTypeAny, {
            knownErrors: {
                condition: string;
                expectedBehavior: string;
            }[];
        }, {
            knownErrors?: {
                condition: string;
                expectedBehavior: string;
            }[] | undefined;
        }>>;
        quality: import("zod").ZodOptional<import("zod").ZodObject<{
            testTypes: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["unit", "integration", "e2e", "security"]>, "many">>>;
            performanceCriteria: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            securityConsiderations: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
        }, "strip", import("zod").ZodTypeAny, {
            testTypes: ("unit" | "integration" | "e2e" | "security")[];
            performanceCriteria: string[];
            securityConsiderations: string[];
        }, {
            testTypes?: ("unit" | "integration" | "e2e" | "security")[] | undefined;
            performanceCriteria?: string[] | undefined;
            securityConsiderations?: string[] | undefined;
        }>>;
        aiDirectives: import("zod").ZodOptional<import("zod").ZodObject<{
            generationLevel: import("zod").ZodDefault<import("zod").ZodEnum<["skeleton", "partial", "full"]>>;
            overwritePolicy: import("zod").ZodDefault<import("zod").ZodEnum<["never", "ifEmpty", "always"]>>;
        }, "strip", import("zod").ZodTypeAny, {
            generationLevel: "skeleton" | "partial" | "full";
            overwritePolicy: "never" | "ifEmpty" | "always";
        }, {
            generationLevel?: "skeleton" | "partial" | "full" | undefined;
            overwritePolicy?: "never" | "ifEmpty" | "always" | undefined;
        }>>;
        flows: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            name: import("zod").ZodString;
            steps: import("zod").ZodArray<import("zod").ZodString, "many">;
            type: import("zod").ZodDefault<import("zod").ZodEnum<["main", "alternative", "error"]>>;
        }, "strip", import("zod").ZodTypeAny, {
            type: "error" | "main" | "alternative";
            name: string;
            steps: string[];
        }, {
            name: string;
            steps: string[];
            type?: "error" | "main" | "alternative" | undefined;
        }>, "many">>;
        technicalSurface: import("zod").ZodOptional<import("zod").ZodObject<{
            backend: import("zod").ZodOptional<import("zod").ZodObject<{
                repos: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                endpoints: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                collections: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    purpose: import("zod").ZodString;
                    operations: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["CREATE", "READ", "UPDATE", "DELETE"]>, "many">>>;
                }, "strip", import("zod").ZodTypeAny, {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }, {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }>, "many">>>;
            }, "strip", import("zod").ZodTypeAny, {
                endpoints: string[];
                repos: string[];
                collections: {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }[];
            }, {
                endpoints?: string[] | undefined;
                repos?: string[] | undefined;
                collections?: {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }[] | undefined;
            }>>;
            frontend: import("zod").ZodOptional<import("zod").ZodObject<{
                repos: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                routes: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                components: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            }, "strip", import("zod").ZodTypeAny, {
                repos: string[];
                routes: string[];
                components: string[];
            }, {
                repos?: string[] | undefined;
                routes?: string[] | undefined;
                components?: string[] | undefined;
            }>>;
        }, "strip", import("zod").ZodTypeAny, {
            backend?: {
                endpoints: string[];
                repos: string[];
                collections: {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }[];
            } | undefined;
            frontend?: {
                repos: string[];
                routes: string[];
                components: string[];
            } | undefined;
        }, {
            backend?: {
                endpoints?: string[] | undefined;
                repos?: string[] | undefined;
                collections?: {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }[] | undefined;
            } | undefined;
            frontend?: {
                repos?: string[] | undefined;
                routes?: string[] | undefined;
                components?: string[] | undefined;
            } | undefined;
        }>>;
        relationships: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            type: import("zod").ZodEnum<["depends_on", "extends", "implements", "conflicts_with", "related_to"]>;
            targetType: import("zod").ZodString;
            targetKey: import("zod").ZodString;
            reason: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }, {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }>, "many">>;
        implementationRisk: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            rule: import("zod").ZodString;
            normative: import("zod").ZodDefault<import("zod").ZodBoolean>;
        }, "strip", import("zod").ZodTypeAny, {
            rule: string;
            normative: boolean;
        }, {
            rule: string;
            normative?: boolean | undefined;
        }>, "many">>;
        tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        normative: import("zod").ZodOptional<import("zod").ZodBoolean>;
        aiMetadata: import("zod").ZodOptional<import("zod").ZodObject<{
            estimatedComplexity: import("zod").ZodOptional<import("zod").ZodEnum<["low", "medium", "high"]>>;
            implementationRisk: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            testStrategy: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            nonFunctionalRequirements: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            suggestedOrder: import("zod").ZodOptional<import("zod").ZodNumber>;
            normativeMode: import("zod").ZodOptional<import("zod").ZodBoolean>;
            insufficiencyReasons: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            implementationRisk: string[];
            testStrategy: string[];
            nonFunctionalRequirements: string[];
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        }, {
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            implementationRisk?: string[] | undefined;
            testStrategy?: string[] | undefined;
            nonFunctionalRequirements?: string[] | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        }>>;
    }, "strip", import("zod").ZodTypeAny, {
        useCaseId: string;
        status?: {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        } | undefined;
        name?: string | undefined;
        errorHandling?: {
            knownErrors: {
                condition: string;
                expectedBehavior: string;
            }[];
        } | undefined;
        description?: string | undefined;
        normative?: boolean | undefined;
        implementationRisk?: {
            rule: string;
            normative: boolean;
        }[] | undefined;
        businessValue?: string | undefined;
        primaryActor?: string | undefined;
        acceptanceCriteria?: string[] | undefined;
        stakeholders?: string[] | undefined;
        functionalRequirements?: {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        } | undefined;
        scope?: {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        } | undefined;
        interfaces?: {
            type: "REST" | "GraphQL" | "Event" | "UI";
            endpoints: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[];
            events: string[];
        } | undefined;
        quality?: {
            testTypes: ("unit" | "integration" | "e2e" | "security")[];
            performanceCriteria: string[];
            securityConsiderations: string[];
        } | undefined;
        aiDirectives?: {
            generationLevel: "skeleton" | "partial" | "full";
            overwritePolicy: "never" | "ifEmpty" | "always";
        } | undefined;
        flows?: {
            type: "error" | "main" | "alternative";
            name: string;
            steps: string[];
        }[] | undefined;
        technicalSurface?: {
            backend?: {
                endpoints: string[];
                repos: string[];
                collections: {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }[];
            } | undefined;
            frontend?: {
                repos: string[];
                routes: string[];
                components: string[];
            } | undefined;
        } | undefined;
        relationships?: {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }[] | undefined;
        tags?: string[] | undefined;
        aiMetadata?: {
            implementationRisk: string[];
            testStrategy: string[];
            nonFunctionalRequirements: string[];
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        } | undefined;
    }, {
        useCaseId: string;
        status?: {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        } | undefined;
        name?: string | undefined;
        errorHandling?: {
            knownErrors?: {
                condition: string;
                expectedBehavior: string;
            }[] | undefined;
        } | undefined;
        description?: string | undefined;
        normative?: boolean | undefined;
        implementationRisk?: {
            rule: string;
            normative?: boolean | undefined;
        }[] | undefined;
        businessValue?: string | undefined;
        primaryActor?: string | undefined;
        acceptanceCriteria?: string[] | undefined;
        stakeholders?: string[] | undefined;
        functionalRequirements?: {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        } | undefined;
        scope?: {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        } | undefined;
        interfaces?: {
            type?: "REST" | "GraphQL" | "Event" | "UI" | undefined;
            endpoints?: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[] | undefined;
            events?: string[] | undefined;
        } | undefined;
        quality?: {
            testTypes?: ("unit" | "integration" | "e2e" | "security")[] | undefined;
            performanceCriteria?: string[] | undefined;
            securityConsiderations?: string[] | undefined;
        } | undefined;
        aiDirectives?: {
            generationLevel?: "skeleton" | "partial" | "full" | undefined;
            overwritePolicy?: "never" | "ifEmpty" | "always" | undefined;
        } | undefined;
        flows?: {
            name: string;
            steps: string[];
            type?: "error" | "main" | "alternative" | undefined;
        }[] | undefined;
        technicalSurface?: {
            backend?: {
                endpoints?: string[] | undefined;
                repos?: string[] | undefined;
                collections?: {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }[] | undefined;
            } | undefined;
            frontend?: {
                repos?: string[] | undefined;
                routes?: string[] | undefined;
                components?: string[] | undefined;
            } | undefined;
        } | undefined;
        relationships?: {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }[] | undefined;
        tags?: string[] | undefined;
        aiMetadata?: {
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            implementationRisk?: string[] | undefined;
            testStrategy?: string[] | undefined;
            nonFunctionalRequirements?: string[] | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        } | undefined;
    }>;
    handler: typeof updateUseCase;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        useCaseId: import("zod").ZodString;
        enhancementType: import("zod").ZodOptional<import("zod").ZodEnum<["full", "partial", "flows_only", "technical_only"]>>;
    }, "strip", import("zod").ZodTypeAny, {
        useCaseId: string;
        enhancementType?: "partial" | "full" | "flows_only" | "technical_only" | undefined;
    }, {
        useCaseId: string;
        enhancementType?: "partial" | "full" | "flows_only" | "technical_only" | undefined;
    }>;
    handler: typeof enhanceUseCase;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        useCaseId: import("zod").ZodString;
        instructions: import("zod").ZodString;
        preserveHumanEdits: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
    }, "strip", import("zod").ZodTypeAny, {
        useCaseId: string;
        instructions: string;
        preserveHumanEdits: boolean;
    }, {
        useCaseId: string;
        instructions: string;
        preserveHumanEdits?: boolean | undefined;
    }>;
    handler: typeof updateUseCaseWithAI;
})[];
//# sourceMappingURL=index.d.ts.map
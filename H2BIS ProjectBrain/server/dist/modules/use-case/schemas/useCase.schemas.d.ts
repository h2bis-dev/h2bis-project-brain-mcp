import { z } from 'zod';
export declare const UseCaseLifecycleSchema: z.ZodEnum<["idea", "planned", "in_development", "ai_generated", "human_reviewed", "completed"]>;
export declare const UseCaseStatusSchema: z.ZodObject<{
    lifecycle: z.ZodOptional<z.ZodEnum<["idea", "planned", "in_development", "ai_generated", "human_reviewed", "completed"]>>;
    reviewedByHuman: z.ZodOptional<z.ZodBoolean>;
    generatedByAI: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
    reviewedByHuman?: boolean | undefined;
    generatedByAI?: boolean | undefined;
}, {
    lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
    reviewedByHuman?: boolean | undefined;
    generatedByAI?: boolean | undefined;
}>;
export declare const UseCaseFunctionalRequirementsSchema: z.ZodObject<{
    must: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    should: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    wont: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    must?: string[] | undefined;
    should?: string[] | undefined;
    wont?: string[] | undefined;
}, {
    must?: string[] | undefined;
    should?: string[] | undefined;
    wont?: string[] | undefined;
}>;
export declare const UseCaseScopeSchema: z.ZodObject<{
    inScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    outOfScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    assumptions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    constraints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    constraints?: string[] | undefined;
    inScope?: string[] | undefined;
    outOfScope?: string[] | undefined;
    assumptions?: string[] | undefined;
}, {
    constraints?: string[] | undefined;
    inScope?: string[] | undefined;
    outOfScope?: string[] | undefined;
    assumptions?: string[] | undefined;
}>;
export declare const UseCaseEndpointSchema: z.ZodObject<{
    method: z.ZodString;
    path: z.ZodString;
    request: z.ZodOptional<z.ZodString>;
    response: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    path: string;
    method: string;
    response?: string | undefined;
    request?: string | undefined;
}, {
    path: string;
    method: string;
    response?: string | undefined;
    request?: string | undefined;
}>;
export declare const UseCaseInterfacesSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodEnum<["REST", "GraphQL", "Event", "UI"]>>;
    endpoints: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        method: z.ZodString;
        path: z.ZodString;
        request: z.ZodOptional<z.ZodString>;
        response: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
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
    events: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
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
}>;
export declare const UseCaseKnownErrorSchema: z.ZodObject<{
    condition: z.ZodString;
    expectedBehavior: z.ZodString;
}, "strip", z.ZodTypeAny, {
    condition: string;
    expectedBehavior: string;
}, {
    condition: string;
    expectedBehavior: string;
}>;
export declare const UseCaseErrorHandlingSchema: z.ZodObject<{
    knownErrors: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        condition: z.ZodString;
        expectedBehavior: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        condition: string;
        expectedBehavior: string;
    }, {
        condition: string;
        expectedBehavior: string;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    knownErrors: {
        condition: string;
        expectedBehavior: string;
    }[];
}, {
    knownErrors?: {
        condition: string;
        expectedBehavior: string;
    }[] | undefined;
}>;
export declare const UseCaseQualitySchema: z.ZodObject<{
    testTypes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<["unit", "integration", "e2e", "security"]>, "many">>>;
    performanceCriteria: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    securityConsiderations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    testTypes: ("unit" | "integration" | "e2e" | "security")[];
    performanceCriteria: string[];
    securityConsiderations: string[];
}, {
    testTypes?: ("unit" | "integration" | "e2e" | "security")[] | undefined;
    performanceCriteria?: string[] | undefined;
    securityConsiderations?: string[] | undefined;
}>;
export declare const UseCaseAIDirectivesSchema: z.ZodObject<{
    generationLevel: z.ZodDefault<z.ZodEnum<["skeleton", "partial", "full"]>>;
    overwritePolicy: z.ZodDefault<z.ZodEnum<["never", "ifEmpty", "always"]>>;
}, "strip", z.ZodTypeAny, {
    generationLevel: "skeleton" | "partial" | "full";
    overwritePolicy: "never" | "ifEmpty" | "always";
}, {
    generationLevel?: "skeleton" | "partial" | "full" | undefined;
    overwritePolicy?: "never" | "ifEmpty" | "always" | undefined;
}>;
export declare const UseCaseFlowSchema: z.ZodObject<{
    name: z.ZodString;
    steps: z.ZodArray<z.ZodString, "many">;
    type: z.ZodDefault<z.ZodEnum<["main", "alternative", "error"]>>;
}, "strip", z.ZodTypeAny, {
    type: "error" | "main" | "alternative";
    name: string;
    steps: string[];
}, {
    name: string;
    steps: string[];
    type?: "error" | "main" | "alternative" | undefined;
}>;
export declare const UseCaseCollectionSchema: z.ZodObject<{
    name: z.ZodString;
    purpose: z.ZodString;
    operations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<["CREATE", "READ", "UPDATE", "DELETE"]>, "many">>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    purpose: string;
    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
}, {
    name: string;
    purpose: string;
    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
}>;
export declare const UseCaseBackendSurfaceSchema: z.ZodObject<{
    repos: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    endpoints: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    collections: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        purpose: z.ZodString;
        operations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<["CREATE", "READ", "UPDATE", "DELETE"]>, "many">>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        purpose: string;
        operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
    }, {
        name: string;
        purpose: string;
        operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
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
}>;
export declare const UseCaseFrontendSurfaceSchema: z.ZodObject<{
    repos: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    routes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    components: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    repos: string[];
    routes: string[];
    components: string[];
}, {
    repos?: string[] | undefined;
    routes?: string[] | undefined;
    components?: string[] | undefined;
}>;
export declare const UseCaseTechnicalSurfaceSchema: z.ZodObject<{
    backend: z.ZodOptional<z.ZodObject<{
        repos: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        endpoints: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        collections: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            purpose: z.ZodString;
            operations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<["CREATE", "READ", "UPDATE", "DELETE"]>, "many">>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            purpose: string;
            operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
        }, {
            name: string;
            purpose: string;
            operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
        }>, "many">>>;
    }, "strip", z.ZodTypeAny, {
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
    frontend: z.ZodOptional<z.ZodObject<{
        repos: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        routes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        components: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        repos: string[];
        routes: string[];
        components: string[];
    }, {
        repos?: string[] | undefined;
        routes?: string[] | undefined;
        components?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
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
}>;
export declare const UseCaseRelationshipSchema: z.ZodObject<{
    type: z.ZodEnum<["depends_on", "extends", "implements", "conflicts_with", "related_to"]>;
    targetType: z.ZodString;
    targetKey: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
    targetType: string;
    targetKey: string;
    reason?: string | undefined;
}, {
    type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
    targetType: string;
    targetKey: string;
    reason?: string | undefined;
}>;
export declare const UseCaseImplementationRiskSchema: z.ZodObject<{
    rule: z.ZodString;
    normative: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    rule: string;
    normative: boolean;
}, {
    rule: string;
    normative?: boolean | undefined;
}>;
export declare const UseCaseAIMetadataSchema: z.ZodObject<{
    estimatedComplexity: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    implementationRisk: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    testStrategy: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    nonFunctionalRequirements: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    suggestedOrder: z.ZodOptional<z.ZodNumber>;
    normativeMode: z.ZodOptional<z.ZodBoolean>;
    insufficiencyReasons: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
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
}>;
export declare const listUseCasesSchema: z.ZodObject<{
    projectId: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    projectId?: string | undefined;
}, {
    projectId?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}>;
export declare const getUseCaseByIdSchema: z.ZodObject<{
    useCaseId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    useCaseId: string;
}, {
    useCaseId: string;
}>;
export declare const createUseCaseSchema: z.ZodObject<{
    key: z.ZodString;
    projectId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodString;
    businessValue: z.ZodOptional<z.ZodString>;
    primaryActor: z.ZodOptional<z.ZodString>;
    acceptanceCriteria: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    stakeholders: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodOptional<z.ZodObject<{
        lifecycle: z.ZodOptional<z.ZodEnum<["idea", "planned", "in_development", "ai_generated", "human_reviewed", "completed"]>>;
        reviewedByHuman: z.ZodOptional<z.ZodBoolean>;
        generatedByAI: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
        reviewedByHuman?: boolean | undefined;
        generatedByAI?: boolean | undefined;
    }, {
        lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
        reviewedByHuman?: boolean | undefined;
        generatedByAI?: boolean | undefined;
    }>>;
    functionalRequirements: z.ZodOptional<z.ZodObject<{
        must: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        should: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        wont: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        must?: string[] | undefined;
        should?: string[] | undefined;
        wont?: string[] | undefined;
    }, {
        must?: string[] | undefined;
        should?: string[] | undefined;
        wont?: string[] | undefined;
    }>>;
    scope: z.ZodOptional<z.ZodObject<{
        inScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        outOfScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        assumptions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        constraints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
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
    interfaces: z.ZodOptional<z.ZodObject<{
        type: z.ZodDefault<z.ZodEnum<["REST", "GraphQL", "Event", "UI"]>>;
        endpoints: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            method: z.ZodString;
            path: z.ZodString;
            request: z.ZodOptional<z.ZodString>;
            response: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
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
        events: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
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
    errorHandling: z.ZodOptional<z.ZodObject<{
        knownErrors: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            condition: z.ZodString;
            expectedBehavior: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            condition: string;
            expectedBehavior: string;
        }, {
            condition: string;
            expectedBehavior: string;
        }>, "many">>>;
    }, "strip", z.ZodTypeAny, {
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
    quality: z.ZodOptional<z.ZodObject<{
        testTypes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<["unit", "integration", "e2e", "security"]>, "many">>>;
        performanceCriteria: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        securityConsiderations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        testTypes: ("unit" | "integration" | "e2e" | "security")[];
        performanceCriteria: string[];
        securityConsiderations: string[];
    }, {
        testTypes?: ("unit" | "integration" | "e2e" | "security")[] | undefined;
        performanceCriteria?: string[] | undefined;
        securityConsiderations?: string[] | undefined;
    }>>;
    aiDirectives: z.ZodOptional<z.ZodObject<{
        generationLevel: z.ZodDefault<z.ZodEnum<["skeleton", "partial", "full"]>>;
        overwritePolicy: z.ZodDefault<z.ZodEnum<["never", "ifEmpty", "always"]>>;
    }, "strip", z.ZodTypeAny, {
        generationLevel: "skeleton" | "partial" | "full";
        overwritePolicy: "never" | "ifEmpty" | "always";
    }, {
        generationLevel?: "skeleton" | "partial" | "full" | undefined;
        overwritePolicy?: "never" | "ifEmpty" | "always" | undefined;
    }>>;
    flows: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        steps: z.ZodArray<z.ZodString, "many">;
        type: z.ZodDefault<z.ZodEnum<["main", "alternative", "error"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "error" | "main" | "alternative";
        name: string;
        steps: string[];
    }, {
        name: string;
        steps: string[];
        type?: "error" | "main" | "alternative" | undefined;
    }>, "many">>;
    technicalSurface: z.ZodOptional<z.ZodObject<{
        backend: z.ZodOptional<z.ZodObject<{
            repos: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            endpoints: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            collections: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                purpose: z.ZodString;
                operations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<["CREATE", "READ", "UPDATE", "DELETE"]>, "many">>>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                purpose: string;
                operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
            }, {
                name: string;
                purpose: string;
                operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
            }>, "many">>>;
        }, "strip", z.ZodTypeAny, {
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
        frontend: z.ZodOptional<z.ZodObject<{
            repos: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            routes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            components: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            repos: string[];
            routes: string[];
            components: string[];
        }, {
            repos?: string[] | undefined;
            routes?: string[] | undefined;
            components?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
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
    relationships: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["depends_on", "extends", "implements", "conflicts_with", "related_to"]>;
        targetType: z.ZodString;
        targetKey: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
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
    implementationRisk: z.ZodOptional<z.ZodArray<z.ZodObject<{
        rule: z.ZodString;
        normative: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        rule: string;
        normative: boolean;
    }, {
        rule: string;
        normative?: boolean | undefined;
    }>, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    normative: z.ZodOptional<z.ZodBoolean>;
    aiMetadata: z.ZodOptional<z.ZodObject<{
        estimatedComplexity: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
        implementationRisk: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        testStrategy: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        nonFunctionalRequirements: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        suggestedOrder: z.ZodOptional<z.ZodNumber>;
        normativeMode: z.ZodOptional<z.ZodBoolean>;
        insufficiencyReasons: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
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
}, "strip", z.ZodTypeAny, {
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
export declare const updateUseCaseSchema: z.ZodObject<{
    useCaseId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    businessValue: z.ZodOptional<z.ZodString>;
    primaryActor: z.ZodOptional<z.ZodString>;
    acceptanceCriteria: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    stakeholders: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodOptional<z.ZodObject<{
        lifecycle: z.ZodOptional<z.ZodEnum<["idea", "planned", "in_development", "ai_generated", "human_reviewed", "completed"]>>;
        reviewedByHuman: z.ZodOptional<z.ZodBoolean>;
        generatedByAI: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
        reviewedByHuman?: boolean | undefined;
        generatedByAI?: boolean | undefined;
    }, {
        lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
        reviewedByHuman?: boolean | undefined;
        generatedByAI?: boolean | undefined;
    }>>;
    functionalRequirements: z.ZodOptional<z.ZodObject<{
        must: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        should: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        wont: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        must?: string[] | undefined;
        should?: string[] | undefined;
        wont?: string[] | undefined;
    }, {
        must?: string[] | undefined;
        should?: string[] | undefined;
        wont?: string[] | undefined;
    }>>;
    scope: z.ZodOptional<z.ZodObject<{
        inScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        outOfScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        assumptions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        constraints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
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
    interfaces: z.ZodOptional<z.ZodObject<{
        type: z.ZodDefault<z.ZodEnum<["REST", "GraphQL", "Event", "UI"]>>;
        endpoints: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            method: z.ZodString;
            path: z.ZodString;
            request: z.ZodOptional<z.ZodString>;
            response: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
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
        events: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
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
    errorHandling: z.ZodOptional<z.ZodObject<{
        knownErrors: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            condition: z.ZodString;
            expectedBehavior: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            condition: string;
            expectedBehavior: string;
        }, {
            condition: string;
            expectedBehavior: string;
        }>, "many">>>;
    }, "strip", z.ZodTypeAny, {
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
    quality: z.ZodOptional<z.ZodObject<{
        testTypes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<["unit", "integration", "e2e", "security"]>, "many">>>;
        performanceCriteria: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        securityConsiderations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        testTypes: ("unit" | "integration" | "e2e" | "security")[];
        performanceCriteria: string[];
        securityConsiderations: string[];
    }, {
        testTypes?: ("unit" | "integration" | "e2e" | "security")[] | undefined;
        performanceCriteria?: string[] | undefined;
        securityConsiderations?: string[] | undefined;
    }>>;
    aiDirectives: z.ZodOptional<z.ZodObject<{
        generationLevel: z.ZodDefault<z.ZodEnum<["skeleton", "partial", "full"]>>;
        overwritePolicy: z.ZodDefault<z.ZodEnum<["never", "ifEmpty", "always"]>>;
    }, "strip", z.ZodTypeAny, {
        generationLevel: "skeleton" | "partial" | "full";
        overwritePolicy: "never" | "ifEmpty" | "always";
    }, {
        generationLevel?: "skeleton" | "partial" | "full" | undefined;
        overwritePolicy?: "never" | "ifEmpty" | "always" | undefined;
    }>>;
    flows: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        steps: z.ZodArray<z.ZodString, "many">;
        type: z.ZodDefault<z.ZodEnum<["main", "alternative", "error"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "error" | "main" | "alternative";
        name: string;
        steps: string[];
    }, {
        name: string;
        steps: string[];
        type?: "error" | "main" | "alternative" | undefined;
    }>, "many">>;
    technicalSurface: z.ZodOptional<z.ZodObject<{
        backend: z.ZodOptional<z.ZodObject<{
            repos: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            endpoints: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            collections: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                purpose: z.ZodString;
                operations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<["CREATE", "READ", "UPDATE", "DELETE"]>, "many">>>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                purpose: string;
                operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
            }, {
                name: string;
                purpose: string;
                operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
            }>, "many">>>;
        }, "strip", z.ZodTypeAny, {
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
        frontend: z.ZodOptional<z.ZodObject<{
            repos: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            routes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            components: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            repos: string[];
            routes: string[];
            components: string[];
        }, {
            repos?: string[] | undefined;
            routes?: string[] | undefined;
            components?: string[] | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
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
    relationships: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["depends_on", "extends", "implements", "conflicts_with", "related_to"]>;
        targetType: z.ZodString;
        targetKey: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
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
    implementationRisk: z.ZodOptional<z.ZodArray<z.ZodObject<{
        rule: z.ZodString;
        normative: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        rule: string;
        normative: boolean;
    }, {
        rule: string;
        normative?: boolean | undefined;
    }>, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    normative: z.ZodOptional<z.ZodBoolean>;
    aiMetadata: z.ZodOptional<z.ZodObject<{
        estimatedComplexity: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
        implementationRisk: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        testStrategy: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        nonFunctionalRequirements: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        suggestedOrder: z.ZodOptional<z.ZodNumber>;
        normativeMode: z.ZodOptional<z.ZodBoolean>;
        insufficiencyReasons: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
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
}, "strip", z.ZodTypeAny, {
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
export declare const deleteUseCaseSchema: z.ZodObject<{
    useCaseId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    useCaseId: string;
}, {
    useCaseId: string;
}>;
export declare const enhanceUseCaseSchema: z.ZodObject<{
    useCaseId: z.ZodString;
    enhancementType: z.ZodOptional<z.ZodEnum<["full", "partial", "flows_only", "technical_only"]>>;
}, "strip", z.ZodTypeAny, {
    useCaseId: string;
    enhancementType?: "partial" | "full" | "flows_only" | "technical_only" | undefined;
}, {
    useCaseId: string;
    enhancementType?: "partial" | "full" | "flows_only" | "technical_only" | undefined;
}>;
export declare const updateUseCaseWithAISchema: z.ZodObject<{
    useCaseId: z.ZodString;
    instructions: z.ZodString;
    preserveHumanEdits: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    useCaseId: string;
    instructions: string;
    preserveHumanEdits: boolean;
}, {
    useCaseId: string;
    instructions: string;
    preserveHumanEdits?: boolean | undefined;
}>;
export declare const getUseCaseWithProjectContextSchema: z.ZodObject<{
    useCaseId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    useCaseId: string;
}, {
    useCaseId: string;
}>;
//# sourceMappingURL=useCase.schemas.d.ts.map
/**
 * Base types matching the backend schemas
 */

export interface Flow {
    name: string;
    steps: string[];
    type: "main" | "alternative" | "error";
}

export interface DataCollection {
    name: string;
    purpose: string;
    operations: ("CREATE" | "READ" | "UPDATE" | "DELETE")[];
}

export interface TechnicalSurface {
    backend: {
        repos: string[];
        endpoints: string[];
        collections: DataCollection[];
    };
    frontend: {
        repos: string[];
        routes: string[];
        components: string[];
    };
}

export interface Relationship {
    type:
    | "depends_on"
    | "extends"
    | "implements"
    | "conflicts_with"
    | "related_to";
    targetType: string;
    targetKey: string;
    reason?: string;
}

export interface ImplementationRisk {
    rule: string;
    normative: boolean;
}

export interface FunctionalRequirements {
    must: string[];
    should: string[];
    wont: string[];
}

export interface Scope {
    inScope: string[];
    outOfScope: string[];
    assumptions: string[];
    constraints: string[];
}

export interface DomainEntity {
    name: string;
    description?: string;
    fields: {
        name: string;
        type: string;
        required: boolean;
        constraints: string[];
    }[];
}

export interface DomainModel {
    entities: DomainEntity[];
}

export interface InterfaceEndpoint {
    method: string;
    path: string;
    request?: string;
    response?: string;
}

export interface Interfaces {
    type: "REST" | "GraphQL" | "Event" | "UI";
    endpoints: InterfaceEndpoint[];
    events: string[];
}

export interface ErrorHandling {
    knownErrors: {
        condition: string;
        expectedBehavior: string;
    }[];
}

export interface Architecture {
    style: "layered" | "clean" | "hexagonal" | "event-driven";
    patterns: string[];
}

export interface TechnologyConstraints {
    backend?: string;
    frontend?: string;
    database?: string;
    messaging?: string;
    auth?: string;
}

export interface Configuration {
    envVars: string[];
    featureFlags: string[];
}

export interface Quality {
    testTypes: ("unit" | "integration" | "e2e")[];
    performanceCriteria: string[];
    securityConsiderations: string[];
}

export interface AIDirectives {
    generationLevel: "skeleton" | "partial" | "full";
    overwritePolicy: "never" | "ifEmpty" | "always";
}

export interface AIMetadata {
    estimatedComplexity: "low" | "medium" | "high";
    implementationRisk: string[];
    suggestedOrder?: number;
    testStrategy: string[];
    nonFunctionalRequirements: string[];
    normativeMode?: boolean;
    insufficiencyReasons?: string[];
    skipValidation?: boolean;
}

export interface Audit {
    createdAt: Date | string;
    updatedAt: Date | string;
    createdBy: string;
    updatedBy: string;
}

export interface UseCase {
    _id?: any;
    type: "use_case";
    key: string;
    name: string;
    description: string;
    status: {
        lifecycle:
        | "idea"
        | "planned"
        | "in_development"
        | "ai_generated"
        | "human_reviewed"
        | "completed";
        reviewedByHuman: boolean;
        generatedByAI: boolean;
    };
    businessValue: string;
    primaryActor: string;
    stakeholders?: string[];
    functionalRequirements?: FunctionalRequirements;
    scope?: Scope;
    domainModel?: DomainModel;
    interfaces?: Interfaces;
    errorHandling?: ErrorHandling;
    architecture?: Architecture;
    technologyConstraints?: TechnologyConstraints;
    configuration?: Configuration;
    quality?: Quality;
    aiDirectives?: AIDirectives;
    acceptanceCriteria: string[];
    flows: Flow[];
    technicalSurface: TechnicalSurface;
    relationships: Relationship[];
    implementationRisk: ImplementationRisk[];
    tags: string[];
    normative: boolean;
    aiMetadata?: AIMetadata;
    audit?: Audit;
}

export type UseCaseCreateInput = Omit<UseCase, "_id" | "audit">;
export type UseCaseUpdateInput = Partial<Omit<UseCase, "_id">>;

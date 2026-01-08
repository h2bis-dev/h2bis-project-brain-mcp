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

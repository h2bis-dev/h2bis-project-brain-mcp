/**
 * Use Case domain types — MCP layer
 *
 * These interfaces are the MCP's typed view of the API's use case DTOs.
 * They must stay in sync with:
 *   h2bis-pb-api/src/modules/use-case/use-case.dto.ts  (source of truth)
 *
 * Do NOT add fields here that are not in the API schema.
 * Do NOT use `any` — if a field is genuinely dynamic, use `unknown` and cast at the call site.
 */

// ── Shared sub-types ────────────────────────────────────────────────────────

export type UseCaseLifecycle = 
    | 'idea' 
    | 'planned' 
    | 'in_development' 
    | 'ai_generated' 
    | 'human_reviewed' 
    | 'completed';

export type UseCaseType = 'use_case';

export type GenerationLevel = 'skeleton' | 'partial' | 'full';
export type OverwritePolicy = 'never' | 'ifEmpty' | 'always';
export type TestType = 'unit' | 'integration' | 'e2e' | 'security';
export type FlowType = 'main' | 'alternative' | 'error';
export type InterfaceType = 'REST' | 'GraphQL' | 'Event' | 'UI';
export type EndpointMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type CollectionOperation = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
export type RelationType = 'depends_on' | 'extends' | 'implements' | 'conflicts_with' | 'related_to';
export type ComplexityLevel = 'low' | 'medium' | 'high';

export interface UseCaseStatus {
    lifecycle: UseCaseLifecycle;
    reviewedByHuman: boolean;
    generatedByAI: boolean;
}

export interface UseCaseFunctionalRequirements {
    must?: string[];
    should?: string[];
    wont?: string[];
}

export interface UseCaseScope {
    inScope?: string[];
    outOfScope?: string[];
    assumptions?: string[];
    constraints?: string[];
}

export interface UseCaseDomainField {
    name: string;
    type: string;
    required: boolean;
    constraints?: string[];
}

export interface UseCaseDomainEntity {
    name: string;
    description?: string;
    fields?: UseCaseDomainField[];
}

export interface UseCaseDomainModel {
    entities?: UseCaseDomainEntity[];
}

export interface UseCaseEndpoint {
    method: string;
    path: string;
    request?: string;
    response?: string;
}

export interface UseCaseInterfaces {
    type: InterfaceType;
    endpoints?: UseCaseEndpoint[];
    events?: string[];
}

export interface UseCaseKnownError {
    condition: string;
    expectedBehavior: string;
}

export interface UseCaseErrorHandling {
    knownErrors?: UseCaseKnownError[];
}

export interface UseCaseConfiguration {
    envVars?: string[];
    featureFlags?: string[];
}

export interface UseCaseQuality {
    testTypes?: TestType[];
    performanceCriteria?: string[];
    securityConsiderations?: string[];
}

export interface UseCaseAIDirectives {
    generationLevel: GenerationLevel;
    overwritePolicy: OverwritePolicy;
}

export interface UseCaseFlow {
    name: string;
    steps: string[];
    type?: FlowType;
}

export interface UseCaseBackendSurface {
    repos?: string[];
    endpoints?: string[];
    collections?: Array<{
        name: string;
        purpose: string;
        operations: CollectionOperation[];
    }>;
}

export interface UseCaseFrontendSurface {
    repos?: string[];
    routes?: string[];
    components?: string[];
}

export interface UseCaseTechnicalSurface {
    backend?: UseCaseBackendSurface;
    frontend?: UseCaseFrontendSurface;
}

export interface UseCaseRelationship {
    type: RelationType;
    targetType: string;
    targetKey: string;
    reason?: string;
}

export interface UseCaseImplementationRisk {
    rule: string;
    normative: boolean;
}

export interface UseCaseAIMetadata {
    estimatedComplexity?: ComplexityLevel;
    implementationRisk?: string[];
    testStrategy?: string[];
    nonFunctionalRequirements?: string[];
    suggestedOrder?: number;
    normativeMode?: boolean;
    insufficiencyReasons?: string[];
}

export interface UseCaseAudit {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

// ── Response types ──────────────────────────────────────────────────────────

/**
 * Complete use case response from the API.
 * Mirrors UseCaseDetailResponseDto.
 */
export interface UseCaseResponse {
    id: string;
    key: string;
    projectId?: string;
    type: UseCaseType;
    name: string;
    description: string;

    status: UseCaseStatus;

    businessValue: string;
    primaryActor: string;
    acceptanceCriteria: string[];
    stakeholders?: string[];

    functionalRequirements?: UseCaseFunctionalRequirements;
    scope?: UseCaseScope;
    domainModel?: UseCaseDomainModel;
    interfaces?: UseCaseInterfaces;
    errorHandling?: UseCaseErrorHandling;
    configuration?: UseCaseConfiguration;
    quality?: UseCaseQuality;
    aiDirectives?: UseCaseAIDirectives;

    flows: UseCaseFlow[];
    technicalSurface: UseCaseTechnicalSurface;
    relationships: UseCaseRelationship[];
    implementationRisk: UseCaseImplementationRisk[];

    architecturePatterns: string[];
    tags: string[];
    normative: boolean;

    aiMetadata?: UseCaseAIMetadata;
    audit?: UseCaseAudit;
}

/**
 * List response structure from the API.
 */
export interface UseCaseListResponse {
    useCases: UseCaseResponse[];
    total: number;
}

// ── Request types ───────────────────────────────────────────────────────────

/**
 * Payload for creating a new use case.
 */
export interface CreateUseCaseRequest {
    key: string;
    projectId?: string;
    name: string;
    description: string;
    businessValue?: string;
    primaryActor?: string;
    acceptanceCriteria?: string[];
    stakeholders?: string[];
    status?: Partial<UseCaseStatus>;
    functionalRequirements?: UseCaseFunctionalRequirements;
    scope?: UseCaseScope;
    domainModel?: UseCaseDomainModel;
    interfaces?: UseCaseInterfaces;
    errorHandling?: UseCaseErrorHandling;
    configuration?: UseCaseConfiguration;
    quality?: UseCaseQuality;
    aiDirectives?: UseCaseAIDirectives;
    flows?: UseCaseFlow[];
    technicalSurface?: UseCaseTechnicalSurface;
    relationships?: UseCaseRelationship[];
    implementationRisk?: UseCaseImplementationRisk[];
    architecturePatterns?: string[];
    tags?: string[];
    normative?: boolean;
    aiMetadata?: UseCaseAIMetadata;
}

/**
 * Payload for updating an existing use case.
 */
export interface UpdateUseCaseRequest {
    name?: string;
    description?: string;
    businessValue?: string;
    primaryActor?: string;
    acceptanceCriteria?: string[];
    stakeholders?: string[];
    status?: Partial<UseCaseStatus>;
    functionalRequirements?: UseCaseFunctionalRequirements;
    scope?: UseCaseScope;
    domainModel?: UseCaseDomainModel;
    interfaces?: UseCaseInterfaces;
    errorHandling?: UseCaseErrorHandling;
    configuration?: UseCaseConfiguration;
    quality?: UseCaseQuality;
    aiDirectives?: UseCaseAIDirectives;
    flows?: UseCaseFlow[];
    technicalSurface?: UseCaseTechnicalSurface;
    relationships?: UseCaseRelationship[];
    implementationRisk?: UseCaseImplementationRisk[];
    architecturePatterns?: string[];
    tags?: string[];
    normative?: boolean;
    aiMetadata?: UseCaseAIMetadata;
}

/**
 * Payload for AI enhancement.
 */
export interface EnhanceUseCaseRequest {
    useCaseId: string;
    enhancementType?: 'full' | 'partial' | 'flows_only' | 'technical_only';
}

/**
 * Payload for AI-driven update.
 */
export interface UpdateWithAIRequest {
    useCaseId: string;
    instructions: string;
    preserveHumanEdits?: boolean;
}

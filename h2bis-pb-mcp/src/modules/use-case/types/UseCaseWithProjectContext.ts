/**
 * UseCaseWithProjectContext
 *
 * A composite model returned by the `getUseCaseWithProjectContext` MCP tool.
 * It bundles the fully-typed use case document together with the complete project
 * record so that an AI agent implementing a software feature has all the context
 * it needs — what to build (use case) and how to build it (project context).
 *
 * All interfaces are kept in strict 1-to-1 alignment with the h2bis-pb-api schemas:
 *  - Project  → ProjectResponseDto  / ProjectDocument  (project.dto.ts / project_schema.ts)
 *  - Use Case → UseCaseDetailResponseDto               (use-case.dto.ts)
 *
 * No fields are omitted from either side.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT  — mirrors ProjectResponseDto / ProjectDocument
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProjectMember {
    userId: string;
    role: 'owner' | 'admin' | 'moderator' | 'viewer';
    addedAt: string;
}

export interface ProjectAccessControl {
    allowAdmins: boolean;
    allowedRoles: string[];
}

export interface DevelopedEndpoint {
    useCaseId: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    service: string;
    description: string;
    requestSchema: any;
    responseSchema: any;
    addedAt: string;
    lastScanned?: string;
}

export interface ProjectArchitecture {
    overview: string;
    style: string;
    directoryStructure: string;
    stateManagement: string[];
}

export interface ProjectCodingStyle {
    guide: string;
    linter: string[];
}

/** mirrors metadata.standards with codingStyle */
export interface ProjectStandards {
    codingStyle: ProjectCodingStyle;
    namingConventions: string[];
    errorHandling: string[];
    loggingConvention: string[];
}

export interface ProjectAuthStrategy {
    approach: string;
    implementation: string[];
}

export interface ProjectTestingRequirements {
    coverage: number;
    testTypes: string[];
    requiresE2ETests: boolean;
}

export interface ProjectQualityGates {
    definitionOfDone: string[];
    codeReviewChecklist: string[];
    testingRequirements: ProjectTestingRequirements;
    documentationStandards: string[];  // string[] — not string
}

export interface ProjectDeployment {
    environment: string;
    cicd: string[];
}

export interface ProjectExternalService {
    name: string;
    purpose: string;
    apiDocs: string;
}

// ── Domain Catalog ────────────────────────────────────────────────────────────────

export type DomainModelLayer = 'data' | 'dto' | 'domain' | 'response' | 'request' | 'event' | 'other';

export interface ProjectDomainModelField {
    name: string;
    type: string;
    required: boolean;
    description?: string;
    defaultValue?: string;
    constraints: string[];
}

export interface ProjectDomainModel {
    name: string;
    description?: string;
    layer?: DomainModelLayer;
    fields: ProjectDomainModelField[];
    usedByUseCases: string[];
    addedBy?: string;
    addedAt?: string;
    updatedAt?: string;
}

export interface ProjectMetadata {
    repository: string;
    techStack: string[];
    language: string;
    framework: string;
    architecture: ProjectArchitecture;
    authStrategy: ProjectAuthStrategy;
    deployment: ProjectDeployment;
    externalServices: ProjectExternalService[];
    standards: ProjectStandards;
    qualityGates: ProjectQualityGates;
}

export interface ProjectStats {
    useCaseCount: number;
    capabilityCount: number;
    completionPercentage: number;
}

/**
 * Complete project context — every field from ProjectResponseDto is present.
 * Agents can rely on this rather than guessing what the API returns.
 */
export interface ProjectContext {
    // Identity
    id: string;
    name: string;
    description: string;
    status: 'active' | 'archived' | 'deleted';
    lifecycle: 'planning' | 'in_development' | 'in_review' | 'in_testing' | 'staging' | 'production' | 'maintenance' | 'archived';
    type: 'software_development';

    // Ownership & access
    owner: string;
    members: ProjectMember[];
    accessControl: ProjectAccessControl;

    // All developed endpoints registered against this project
    developedEndpoints: DevelopedEndpoint[];

    // Domain catalog (data models)
    domainCatalog: ProjectDomainModel[];

    // Development metadata (architecture, stack, standards, etc.)
    metadata: ProjectMetadata;

    // Aggregate statistics
    stats: ProjectStats;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE  — mirrors UseCaseDetailResponseDto (use-case.dto.ts)
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseCaseStatus {
    lifecycle: 'idea' | 'planned' | 'in_development' | 'ai_generated' | 'human_reviewed' | 'completed';
    reviewedByHuman: boolean;
    generatedByAI: boolean;
}

export interface UseCaseFunctionalRequirements {
    must: string[];
    should: string[];
    wont: string[];
}

export interface UseCaseScope {
    inScope: string[];
    outOfScope: string[];
    assumptions: string[];
    constraints: string[];
}

export interface UseCaseDomainField {
    name: string;
    type: string;
    required: boolean;
    constraints: string[];
}

export interface UseCaseDomainEntity {
    name: string;
    description?: string;
    fields: UseCaseDomainField[];
}

export interface UseCaseDomainModel {
    entities: UseCaseDomainEntity[];
}

export interface UseCaseEndpoint {
    method: string;
    path: string;
    request?: string;
    response?: string;
}

export interface UseCaseInterfaces {
    type: 'REST' | 'GraphQL' | 'Event' | 'UI';
    endpoints: UseCaseEndpoint[];
    events: string[];
}

export interface UseCaseKnownError {
    condition: string;
    expectedBehavior: string;
}

export interface UseCaseErrorHandling {
    knownErrors: UseCaseKnownError[];
}

export interface UseCaseConfiguration {
    envVars: string[];
    featureFlags: string[];
}

export interface UseCaseQuality {
    testTypes: ('unit' | 'integration' | 'e2e' | 'security')[];
    performanceCriteria: string[];
    securityConsiderations: string[];
}

export interface UseCaseAIDirectives {
    generationLevel: 'skeleton' | 'partial' | 'full';
    overwritePolicy: 'never' | 'ifEmpty' | 'always';
}

export interface UseCaseFlow {
    name: string;
    steps: string[];
    type: 'main' | 'alternative' | 'error';
}

export interface UseCaseBackendSurface {
    repos: string[];
    endpoints: string[];
    collections: Array<{
        name: string;
        purpose: string;
        operations: ('CREATE' | 'READ' | 'UPDATE' | 'DELETE')[];
    }>;
}

export interface UseCaseFrontendSurface {
    repos: string[];
    routes: string[];
    components: string[];
}

export interface UseCaseTechnicalSurface {
    backend: UseCaseBackendSurface;
    frontend: UseCaseFrontendSurface;
}

export interface UseCaseRelationship {
    type: 'depends_on' | 'extends' | 'implements' | 'conflicts_with' | 'related_to';
    targetType: string;
    targetKey: string;
    reason?: string;
}

export interface UseCaseImplementationRisk {
    rule: string;
    normative: boolean;
}

export interface UseCaseAIMetadata {
    estimatedComplexity: 'low' | 'medium' | 'high';
    implementationRisk: string[];
    testStrategy: string[];
    nonFunctionalRequirements: string[];
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

/**
 * Complete use case document — every field from UseCaseDetailResponseDto is present.
 */
export interface UseCaseData {
    id: string;
    key: string;
    projectId?: string;
    type: 'use_case';
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

    tags: string[];
    normative: boolean;

    aiMetadata?: UseCaseAIMetadata;
    audit?: UseCaseAudit;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSITE MODEL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Top-level composite model returned by `getUseCaseWithProjectContext`.
 *
 * `useCase`       — fully-typed use case document (WHAT to build)
 * `projectContext`— fully-typed project record    (HOW to build it)
 */
export interface UseCaseWithProjectContext {
    useCase: UseCaseData;
    projectContext: ProjectContext;
}

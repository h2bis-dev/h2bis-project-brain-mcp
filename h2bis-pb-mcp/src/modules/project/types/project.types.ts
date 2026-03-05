/**
 * Project domain types — MCP layer
 *
 * These interfaces are the MCP's typed view of the API's project DTOs.
 * They must stay in sync with:
 *   h2bis-pb-api/src/modules/project/project.dto.ts  (source of truth)
 *
 * Do NOT add fields here that are not in the API schema.
 * Do NOT use `any` — if a field is genuinely dynamic, use `unknown` and cast at the call site.
 */

// ── Shared sub-types ────────────────────────────────────────────────────────

export type ProjectLifecycle =
    | 'planning'
    | 'in_development'
    | 'in_review'
    | 'in_testing'
    | 'staging'
    | 'production'
    | 'maintenance'
    | 'archived';

export type ProjectStatus = 'active' | 'archived' | 'deleted';

export type EndpointMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type DomainModelLayer = 'data' | 'dto' | 'domain' | 'response' | 'request' | 'event' | 'other';

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
    method: EndpointMethod;
    service: string;
    description: string;
    requestSchema: unknown;
    responseSchema: unknown;
    addedAt?: string;
    lastScanned?: string;
}

export interface DomainModelField {
    name: string;
    type: string;
    required: boolean;
    description?: string;
    defaultValue?: string;
    constraints: string[];
}

export interface DomainModel {
    name: string;
    description?: string;
    layer?: DomainModelLayer;
    fields: DomainModelField[];
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
    architecture: {
        overview: string;
        style: string;
        directoryStructure: string;
        stateManagement: string[];
    };
    authStrategy: {
        approach: string;
        implementation: string[];
    };
    deployment: {
        environment: string;
        cicd: string[];
    };
    externalServices: Array<{
        name: string;
        purpose: string;
        apiDocs: string;
    }>;
    standards: {
        namingConventions: string[];
        errorHandling: string[];
        loggingConvention: string[];
    };
    qualityGates: {
        definitionOfDone: string[];
        codeReviewChecklist: string[];
        testingRequirements: {
            coverage: number;
            testTypes: string[];
            requiresE2ETests: boolean;
        };
        documentationStandards: string;
    };
}

// ── Response type (what the API returns) ─────────────────────────────────────

/** Mirrors ProjectResponseDto from h2bis-pb-api/src/modules/project/project.dto.ts */
export interface ProjectResponse {
    _id: string;
    name: string;
    description: string;
    owner: string;
    members: ProjectMember[];
    accessControl: ProjectAccessControl;
    status: ProjectStatus;
    lifecycle: ProjectLifecycle;
    type: 'software_development';
    developedEndpoints: DevelopedEndpoint[];
    domainCatalog: DomainModel[];
    metadata: ProjectMetadata;
    stats: {
        useCaseCount: number;
        capabilityCount: number;
        completionPercentage: number;
    };
    createdAt: string;
    updatedAt: string;
}

// ── Request types (what the MCP sends to the API) ────────────────────────────

/** Mirrors CreateProjectRequestSchema from h2bis-pb-api/src/modules/project/project.dto.ts */
export interface CreateProjectRequest {
    _id: string;
    name: string;
    description?: string;
    lifecycle?: ProjectLifecycle;
    accessControl?: {
        allowAdmins?: boolean;
        allowedRoles?: string[];
    };
    metadata?: {
        repository?: string;
        techStack?: string[];
        language?: string;
        framework?: string;
        architecture?: {
            overview?: string;
            style?: string;
            directoryStructure?: string;
            stateManagement?: string[];
        };
        authStrategy?: {
            approach?: string;
            implementation?: string[];
        };
        deployment?: {
            environment?: string;
            cicd?: string[];
        };
        externalServices?: Array<{
            name: string;
            purpose?: string;
            apiDocs?: string;
        }>;
        standards?: {
            namingConventions?: string[];
            errorHandling?: string[];
            loggingConvention?: string[];
        };
        qualityGates?: {
            definitionOfDone?: string[];
            codeReviewChecklist?: string[];
            testingRequirements?: {
                coverage?: number;
                testTypes?: string[];
                requiresE2ETests?: boolean;
            };
            documentationStandards?: string;
        };
    };
}

/** Mirrors UpdateProjectRequestSchema from h2bis-pb-api/src/modules/project/project.dto.ts */
export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    lifecycle?: ProjectLifecycle;
    accessControl?: {
        allowAdmins?: boolean;
        allowedRoles?: string[];
    };
    metadata?: CreateProjectRequest['metadata'];
}

/** Mirrors DomainModelEntrySchema from h2bis-pb-api/src/modules/project/project.dto.ts */
export interface UpsertDomainModelRequest {
    name: string;
    description?: string;
    layer?: DomainModelLayer;
    fields?: Array<{
        name: string;
        type: string;
        required?: boolean;
        description?: string;
        defaultValue?: string;
        constraints?: string[];
    }>;
    usedByUseCases?: string[];
    addedBy?: string;
}

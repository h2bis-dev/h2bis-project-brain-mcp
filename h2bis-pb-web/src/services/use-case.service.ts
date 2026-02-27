import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/lib/config';
import type { UseCase } from '@/types/use-case.types';

export interface CreateUseCaseRequest {
    projectId: string;
    type?: 'use_case';
    key: string;
    name: string;
    description: string;
    businessValue: string;
    primaryActor: string;
    technicalSurface: {
        backend: {
            repos: string[];
            endpoints?: string[];
            collections?: Array<{
                name: string;
                purpose: string;
                operations: ('CREATE' | 'READ' | 'UPDATE' | 'DELETE')[];
            }>;
        };
        frontend: {
            repos: string[];
            routes?: string[];
            components?: string[];
        };
    };
    status?: {
        lifecycle: string;
        reviewedByHuman: boolean;
        generatedByAI: boolean;
    };
    stakeholders?: string[];
    functionalRequirements?: {
        must: string[];
        should: string[];
        wont: string[];
    };
    scope?: {
        inScope: string[];
        outOfScope: string[];
        assumptions: string[];
        constraints: string[];
    };
    domainModel?: {
        entities: Array<{
            name: string;
            description?: string;
            fields: Array<{
                name: string;
                type: string;
                required: boolean;
                constraints: string[];
            }>;
        }>;
    };
    interfaces?: {
        type: 'REST' | 'GraphQL' | 'Event' | 'UI';
        endpoints: Array<{
            method: string;
            path: string;
            request?: string;
            response?: string;
        }>;
        events: string[];
    };
    errorHandling?: {
        knownErrors: Array<{
            condition: string;
            expectedBehavior: string;
        }>;
    };
    architecturePatterns?: string[];
    configuration?: {
        envVars: string[];
        featureFlags: string[];
    };
    quality?: {
        testTypes: ('unit' | 'integration' | 'e2e' | 'security')[];
        performanceCriteria: string[];
        securityConsiderations: string[];
    };
    aiDirectives?: {
        generationLevel: 'skeleton' | 'partial' | 'full';
        overwritePolicy: 'never' | 'ifEmpty' | 'always';
    };
    acceptanceCriteria?: string[];
    flows?: Array<{
        name: string;
        steps: string[];
        type: 'main' | 'alternative' | 'error';
    }>;
    relationships?: Array<{
        type: 'depends_on' | 'extends' | 'implements' | 'conflicts_with' | 'related_to';
        targetType: string;
        targetKey: string;
        reason?: string;
    }>;
    implementationRisk?: Array<{
        rule: string;
        normative: boolean;
    }>;
    tags?: string[];
    normative?: boolean;
    aiMetadata?: {
        estimatedComplexity: 'low' | 'medium' | 'high';
        implementationRisk?: string[];
        suggestedOrder?: number;
        testStrategy?: string[];
        nonFunctionalRequirements?: string[];
        skipValidation?: boolean;
        normativeMode?: boolean;
        insufficiencyReasons?: string[];
    };
}

export interface CreateUseCaseResponse {
    id: string;
    key: string;
    message: string;
}

export type UpdateUseCaseRequest = Partial<Omit<CreateUseCaseRequest, 'key' | 'technicalSurface'>> & {
    technicalSurface?: CreateUseCaseRequest['technicalSurface'];
};

export interface UpdateUseCaseResponse {
    id: string;
    key: string;
    message: string;
}

export interface EnhanceUseCaseRequest {
    useCaseId: string;
    instructions: string;
    fieldsToEnhance?: string[];
}

export interface EnhanceUseCaseResponse {
    useCase: Partial<CreateUseCaseRequest>;
    enhancedFields: string[];
    confidence: number;
}

/**
 * Use Case Service
 * Handles all use case-related API calls
 */
export const useCaseService = {
    /**
     * Get all use cases for a project
     */
    getAll: async (projectId?: string): Promise<UseCase[]> => {
        const url = projectId
            ? `${API_ENDPOINTS.USE_CASES.LIST}?projectId=${projectId}`
            : API_ENDPOINTS.USE_CASES.LIST;
        const response = await apiClient.get(url);
        return response.data;
    },

    /**
     * Get a single use case by ID
     */
    getById: async (id: string): Promise<UseCase> => {
        const response = await apiClient.get(API_ENDPOINTS.USE_CASES.GET(id));
        return response.data;
    },

    /**
     * Get a use case by key
     */
    getByKey: async (key: string): Promise<UseCase> => {
        const response = await apiClient.get(API_ENDPOINTS.USE_CASES.GET(key));
        return response.data;
    },

    /**
     * Create a new use case
     */
    create: async (data: CreateUseCaseRequest): Promise<CreateUseCaseResponse> => {
        if (!data.projectId) {
            throw new Error('Project ID is required to create a use case. Please select a project first.');
        }
        const response = await apiClient.post(API_ENDPOINTS.USE_CASES.CREATE, data);
        return response.data;
    },

    /**
     * Update an existing use case
     */
    update: async (id: string, data: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> => {
        const response = await apiClient.put(API_ENDPOINTS.USE_CASES.UPDATE(id), data);
        return response.data;
    },

    /**
     * Delete a use case (admin/moderator only)
     */
    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.delete(API_ENDPOINTS.USE_CASES.DELETE(id));
        return response.data;
    },

    /**
     * Generate a use case using AI
     */
    generate: async (data: GenerateUseCaseRequest): Promise<GenerateUseCaseResponse> => {
        const response = await apiClient.post(API_ENDPOINTS.USE_CASES.GENERATE, data);
        return response.data;
    },

    /**
     * Enhance an existing use case with AI
     */
    enhance: async (data: EnhanceUseCaseRequest): Promise<EnhanceUseCaseResponse> => {
        const response = await apiClient.post(API_ENDPOINTS.USE_CASES.ENHANCE, data);
        return response.data;
    },

    /**
     * Generate AI-updated use case data using project context
     * Returns updated data for preview — does NOT save to DB
     */
    updateWithAI: async (data: UpdateWithAIRequest): Promise<UpdateWithAIResponse> => {
        const response = await apiClient.post(API_ENDPOINTS.USE_CASES.UPDATE_WITH_AI, data);
        return response.data;
    },
};

export interface GenerateUseCaseRequest {
    description: string;
    existingData?: Partial<CreateUseCaseRequest>;
}

export interface GenerateUseCaseResponse {
    useCase: Partial<CreateUseCaseRequest>;
    generatedFields: string[];
    confidence: number;
}

export interface UpdateWithAIProjectContext {
    name?: string;
    language?: string;
    framework?: string;
    techStack?: string[];
    architectureStyle?: string;
    architectureOverview?: string;
    standards?: {
        namingConventions?: string[];
        errorHandling?: string[];
        loggingConvention?: string[];
    };
    qualityGates?: {
        definitionOfDone?: string[];
        testTypes?: string[];
    };
    authStrategy?: {
        approach?: string;
        implementation?: string[];
    };
    domainCatalog?: Array<{
        name: string;
        description?: string;
        fields?: Array<{ name: string; type: string }>;
    }>;
}

export interface UpdateWithAIRequest {
    useCaseId: string;
    instructions: string;
    projectContext?: UpdateWithAIProjectContext;
    fieldsToUpdate?: string[];
}

export interface UpdateWithAIResponse {
    useCase: Partial<CreateUseCaseRequest>;
    updatedFields: string[];
    confidence: number;
}

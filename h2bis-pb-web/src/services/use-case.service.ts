import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/lib/config';
import type { UseCase } from '@/types/use-case.types';

export interface CreateUseCaseRequest {
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
                operations: string[];
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
    acceptanceCriteria?: string[];
    flows?: Array<{
        name: string;
        steps: string[];
        type: 'main' | 'alternative' | 'error';
    }>;
    relationships?: Array<{
        type: string;
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
    };
}

export interface CreateUseCaseResponse {
    id: string;
    key: string;
    message: string;
}

/**
 * Use Case Service
 * Handles all use case-related API calls
 */
export const useCaseService = {
    /**
     * Get all use cases
     */
    getAll: async (): Promise<UseCase[]> => {
        const response = await apiClient.get(API_ENDPOINTS.USE_CASES.LIST);
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
        const response = await apiClient.post(API_ENDPOINTS.USE_CASES.CREATE, data);
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
    }
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

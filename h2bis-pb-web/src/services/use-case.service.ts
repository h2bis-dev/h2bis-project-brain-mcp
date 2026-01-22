import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/lib/config';
import type { UseCase } from '@/types/use-case.types';

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
};

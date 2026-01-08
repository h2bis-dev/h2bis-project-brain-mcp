import { apiClient } from "./api-client";
import type {
    UseCase,
    UseCaseCreateInput,
    InsertResponse,
    UpdateResponse,
    DeleteResponse,
} from "@/types";
import { COLLECTIONS } from "@/lib/constants";

/**
 * Knowledge Service
 * Handles CRUD operations for use cases, features, and entities
 */
export const knowledgeService = {
    // ========== Use Cases ==========

    /**
     * Get all use cases
     */
    async getAllUseCases(): Promise<UseCase[]> {
        const response = await apiClient.post("/api/find", {
            collection: COLLECTIONS.USE_CASES,
            query: {},
        });
        return response.data;
    },

    /**
     * Get use case by key
     */
    async getUseCaseByKey(key: string): Promise<UseCase | null> {
        const response = await apiClient.post("/api/find", {
            collection: COLLECTIONS.USE_CASES,
            query: { key },
        });
        return response.data[0] || null;
    },

    /**
     * Search use cases with filters
     */
    async searchUseCases(query: Record<string, any>): Promise<UseCase[]> {
        const response = await apiClient.post("/api/find", {
            collection: COLLECTIONS.USE_CASES,
            query,
        });
        return response.data;
    },

    /**
     * Create new use case
     * Auto-generates capability via backend
     */
    async createUseCase(data: UseCaseCreateInput): Promise<InsertResponse> {
        const response = await apiClient.post("/api/insert", {
            collection: COLLECTIONS.USE_CASES,
            document: data,
        });
        return response.data;
    },

    /**
     * Update use case
     * Re-generates capability if changed
     */
    async updateUseCase(
        key: string,
        data: UseCase
    ): Promise<UpdateResponse> {
        const response = await apiClient.post("/api/update", {
            collection: COLLECTIONS.USE_CASES,
            query: { key },
            update: data,
        });
        return response.data;
    },

    /**
     * Delete use case
     * Cascades to capability
     */
    async deleteUseCase(key: string): Promise<DeleteResponse> {
        const response = await apiClient.post("/api/delete", {
            collection: COLLECTIONS.USE_CASES,
            query: { key },
        });
        return response.data;
    },

    // ========== Features ==========

    /**
     * Get all features
     */
    async getAllFeatures(): Promise<any[]> {
        const response = await apiClient.post("/api/find", {
            collection: COLLECTIONS.FEATURES,
            query: {},
        });
        return response.data;
    },

    /**
     * Get feature by key
     */
    async getFeatureByKey(key: string): Promise<any | null> {
        const response = await apiClient.post("/api/find", {
            collection: COLLECTIONS.FEATURES,
            query: { key },
        });
        return response.data[0] || null;
    },

    // ========== Collections ==========

    /**
     * List all available collections
     */
    async listCollections(): Promise<string[]> {
        const response = await apiClient.get("/api/list-collections");
        return response.data;
    },
};

import { apiClient } from "./api-client";
import type { Capability, ImpactAnalysis, DependencyTree } from "@/types";

/**
 * Capability Service
 * Handles capability graph operations
 */
export const capabilityService = {
    /**
     * Get all capabilities for a project
     */
    async getAllCapabilities(projectId?: string): Promise<Capability[]> {
        const query = projectId ? { projectId } : {};
        const response = await apiClient.post("/api/find", {
            collection: "capabilities",
            query,
        });
        return response.data;
    },

    /**
     * Get capability by ID
     */
    async getCapabilityById(id: string): Promise<Capability> {
        const response = await apiClient.get(`/api/capabilities/${id}`);
        return response.data;
    },

    /**
     * Get full context for a capability
     * Includes node + dependencies + dependents + impact + artifacts
     */
    async getFullContext(id: string): Promise<any> {
        const response = await apiClient.get(
            `/api/capabilities/${id}/full-context`
        );
        return response.data;
    },

    /**
     * Get dependencies for a capability
     * @param id - Capability ID
     * @param depth - Traversal depth (1-10)
     */
    async getDependencies(
        id: string,
        depth: number = 1
    ): Promise<DependencyTree> {
        const response = await apiClient.get(
            `/api/capabilities/${id}/dependencies`,
            {
                params: { depth },
            }
        );
        return response.data;
    },

    /**
     * Get dependents for a capability (reverse dependencies)
     * @param id - Capability ID
     * @param depth - Traversal depth (1-10)
     */
    async getDependents(id: string, depth: number = 1): Promise<DependencyTree> {
        const response = await apiClient.get(
            `/api/capabilities/${id}/dependents`,
            {
                params: { depth },
            }
        );
        return response.data;
    },

    /**
     * Detect circular dependencies
     */
    async detectCircular(id: string): Promise<{ hasCircular: boolean; cycles?: string[][] }> {
        const response = await apiClient.get(
            `/api/capabilities/${id}/circular`
        );
        return response.data;
    },

    /**
     * Analyze impact of changing a capability
     */
    async analyzeImpact(id: string): Promise<ImpactAnalysis> {
        const response = await apiClient.get(`/api/capabilities/${id}/impact`);
        return response.data;
    },

    /**
     * Get implementation order for a set of capabilities
     * Uses topological sort (Kahn's algorithm)
     */
    async getImplementationOrder(nodeIds: string[]): Promise<Capability[]> {
        const response = await apiClient.post("/api/capabilities/order", {
            nodeIds,
        });
        return response.data;
    },

    /**
     * Create a new capability
     */
    async createCapability(data: Partial<Capability>): Promise<Capability> {
        const response = await apiClient.post("/api/capabilities", data);
        return response.data;
    },

    /**
     * Update a capability
     */
    async updateCapability(
        id: string,
        data: Partial<Capability>
    ): Promise<Capability> {
        const response = await apiClient.put(`/api/capabilities/${id}`, data);
        return response.data;
    },

    /**
     * Delete a capability
     */
    async deleteCapability(id: string): Promise<void> {
        await apiClient.delete(`/api/capabilities/${id}`);
    },

    /**
     * Link artifact to capability
     */
    async linkArtifact(
        id: string,
        artifact: {
            type: "source" | "test" | "documentation";
            path: string;
            metadata?: Record<string, any>;
        }
    ): Promise<void> {
        await apiClient.post(`/api/capabilities/${id}/link-artifact`, artifact);
    },

    /**
     * Find capabilities by file path
     */
    async findByFile(filepath: string): Promise<Capability[]> {
        const response = await apiClient.get(
            `/api/capabilities/by-file/${encodeURIComponent(filepath)}`
        );
        return response.data;
    },
};

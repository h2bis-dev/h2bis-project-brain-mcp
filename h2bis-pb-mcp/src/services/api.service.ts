import { config } from '../config/config.js';

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

/**
 * API Service for making HTTP requests to h2bis-pb-api
 */
class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = config.apiBaseUrl;
    }

    /**
     * Insert a document into a collection
     */
    async insertDocument(collectionName: string, document: Record<string, any>): Promise<{ insertedId: string }> {
        const response = await fetch(`${this.baseUrl}/api/knowledge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collectionName, document }),
        });

        if (!response.ok) {
            const error = await response.json() as { error?: { message?: string } };
            throw new Error(error.error?.message || 'Failed to insert document');
        }

        return await response.json() as { insertedId: string };
    }

    /**
     * Find a document in a collection
     */
    async findDocument(collectionName: string, filter: Record<string, any> = {}): Promise<{ document: any }> {
        const filterStr = JSON.stringify(filter);
        const url = `${this.baseUrl}/api/knowledge?collection=${encodeURIComponent(collectionName)}&filter=${encodeURIComponent(filterStr)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.json() as { error?: { message?: string } };
            throw new Error(error.error?.message || 'Failed to find document');
        }

        return await response.json() as { document: any };
    }

    /**
     * Update a document in a collection
     */
    async updateDocument(
        collectionName: string,
        filter: Record<string, any>,
        update: Record<string, any>
    ): Promise<{ matchedCount: number; modifiedCount: number }> {
        const response = await fetch(`${this.baseUrl}/api/knowledge`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collectionName, filter, update }),
        });

        if (!response.ok) {
            const error = await response.json() as { error?: { message?: string } };
            throw new Error(error.error?.message || 'Failed to update document');
        }

        return await response.json() as { matchedCount: number; modifiedCount: number };
    }

    /**
     * Delete a document from a collection
     */
    async deleteDocument(collectionName: string, filter: Record<string, any>): Promise<{ deletedCount: number }> {
        const response = await fetch(`${this.baseUrl}/api/knowledge`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collectionName, filter }),
        });

        if (!response.ok) {
            const error = await response.json() as { error?: { message?: string } };
            throw new Error(error.error?.message || 'Failed to delete document');
        }

        return await response.json() as { deletedCount: number };
    }

    /**
     * List all collections in the database
     */
    async listCollections(): Promise<{ collections: string[] }> {
        const response = await fetch(`${this.baseUrl}/api/knowledge/collections`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.json() as { error?: { message?: string } };
            throw new Error(error.error?.message || 'Failed to list collections');
        }

        return await response.json() as { collections: string[] };
    }

    /* ---------- Capability Graph Operations ---------- */

    /**
     * Create a capability node
     */
    async createCapability(node: Record<string, any>): Promise<{ nodeId: string }> {
        const response = await fetch(`${this.baseUrl}/api/capabilities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(node),
        });

        if (!response.ok) {
            const error = await response.json() as { error?: string; message?: string };
            throw new Error(error.message || error.error || 'Failed to create capability');
        }

        return await response.json() as { nodeId: string };
    }

    /**
     * Get a capability node by ID
     */
    async getCapability(nodeId: string): Promise<{ node: any }> {
        const response = await fetch(`${this.baseUrl}/api/capabilities/${nodeId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.json() as { error?: string; message?: string };
            throw new Error(error.message || error.error || 'Failed to get capability');
        }

        return await response.json() as { node: any };
    }

    /**
     * Get dependencies for a capability node
     */
    async getCapabilityDependencies(nodeId: string, depth: number = 1): Promise<{ dependencies: any[] }> {
        const response = await fetch(`${this.baseUrl}/api/capabilities/${nodeId}/dependencies?depth=${depth}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.json() as { error?: string; message?: string };
            throw new Error(error.message || error.error || 'Failed to get dependencies');
        }

        return await response.json() as { dependencies: any[] };
    }

    /**
     * Get dependents for a capability node
     */
    async getCapabilityDependents(nodeId: string, depth: number = 1): Promise<{ dependents: any[] }> {
        const response = await fetch(`${this.baseUrl}/api/capabilities/${nodeId}/dependents?depth=${depth}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.json() as { error?: string; message?: string };
            throw new Error(error.message || error.error || 'Failed to get dependents');
        }

        return await response.json() as { dependents: any[] };
    }

    /**
     * Analyze impact of a capability node change
     */
    async analyzeCapabilityImpact(nodeId: string): Promise<{ impact: any }> {
        const response = await fetch(`${this.baseUrl}/api/capabilities/${nodeId}/impact`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.json() as { error?: string; message?: string };
            throw new Error(error.message || error.error || 'Failed to analyze impact');
        }

        return await response.json() as { impact: any };
    }

    /**
     * Get implementation order for nodes
     */
    async getImplementationOrder(nodeIds: string[]): Promise<{ order: any[] }> {
        const response = await fetch(`${this.baseUrl}/api/capabilities/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nodeIds }),
        });

        if (!response.ok) {
            const error = await response.json() as { error?: string; message?: string };
            throw new Error(error.message || error.error || 'Failed to get implementation order');
        }

        return await response.json() as { order: any[] };
    }
}

export const apiService = new ApiService();

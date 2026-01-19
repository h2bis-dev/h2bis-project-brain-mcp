import { config } from '../config/config.js';
import { HttpClient } from '../infrastructure/http-client.js';

/**
 * API Service for h2bis-pb-api
 * Handles business logic and endpoint mapping
 * Uses HttpClient for all transport concerns
 */
class ApiService {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient({
            baseUrl: config.apiBaseUrl,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /* ---------- Knowledge Base Operations ---------- */

    /**
     * Insert a document into a collection
     */
    async insertDocument(
        collectionName: string,
        document: Record<string, any>
    ): Promise<{ insertedId: string; capabilityGenerated?: boolean; capabilityId?: string }> {
        return this.httpClient.post('/api/knowledge', { collectionName, document });
    }

    /**
     * Find a document in a collection
     */
    async findDocument(
        collectionName: string,
        filter: Record<string, any> = {}
    ): Promise<{ document: any }> {
        const filterStr = JSON.stringify(filter);
        const endpoint = `/api/knowledge?collection=${encodeURIComponent(collectionName)}&filter=${encodeURIComponent(filterStr)}`;
        return this.httpClient.get(endpoint);
    }

    /**
     * Update a document in a collection
     */
    async updateDocument(
        collectionName: string,
        filter: Record<string, any>,
        update: Record<string, any>
    ): Promise<{ matchedCount: number; modifiedCount: number }> {
        return this.httpClient.put('/api/knowledge', { collectionName, filter, update });
    }

    /**
     * Delete a document from a collection
     */
    async deleteDocument(
        collectionName: string,
        filter: Record<string, any>
    ): Promise<{ deletedCount: number }> {
        return this.httpClient.delete('/api/knowledge', { collectionName, filter });
    }

    /**
     * List all collections in the database
     */
    async listCollections(): Promise<{ collections: string[] }> {
        return this.httpClient.get('/api/knowledge/collections');
    }

    /* ---------- Capability Graph Operations ---------- */

    /**
     * Get dependencies for a capability node
     */
    async getCapabilityDependencies(
        nodeId: string,
        depth: number = 1
    ): Promise<{ dependencies: any[] }> {
        return this.httpClient.get(`/api/capabilities/${nodeId}/dependencies?depth=${depth}`);
    }

    /**
     * Analyze impact of a capability node change
     */
    async analyzeCapabilityImpact(nodeId: string): Promise<{ impact: any }> {
        return this.httpClient.get(`/api/capabilities/${nodeId}/impact`);
    }

    /**
     * Get implementation order for nodes
     */
    async getImplementationOrder(nodeIds: string[]): Promise<{ order: any[] }> {
        return this.httpClient.post('/api/capabilities/order', { nodeIds });
    }
}

export const apiService = new ApiService();

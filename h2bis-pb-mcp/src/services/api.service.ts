import { config } from '../config/config.js';
import { HttpClient } from '../infrastructure/http-client.js';

/**
 * API Service for h2bis-pb-api
 * Routes to use-case, project, and capability endpoints based on collection name
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
     * Routes to appropriate endpoint based on collection name
     */
    async insertDocument(
        collectionName: string,
        document: Record<string, any>
    ): Promise<{ insertedId: string; capabilityGenerated?: boolean; capabilityId?: string }> {
        const endpoint = this.getEndpointForCollection(collectionName, 'create');
        const result = await this.httpClient.post(endpoint, document) as any;

        // Normalize response to match expected format
        return {
            insertedId: result.id || result._id || result.key || 'unknown',
            ...result
        };
    }

    /**
     * Find a document in a collection
     * Routes to appropriate endpoint based on collection name
     */
    async findDocument(
        collectionName: string,
        filter: Record<string, any> = {}
    ): Promise<{ document: any }> {
        const id = filter._id || filter.id || filter.key;

        if (id) {
            // Find by ID
            const endpoint = this.getEndpointForCollection(collectionName, 'find', id);
            const document = await this.httpClient.get(endpoint);
            return { document };
        } else {
            // List all (fallback)
            const endpoint = this.getEndpointForCollection(collectionName, 'list');
            const results = await this.httpClient.get(endpoint) as any;

            // Return first matching document or null
            const items = Array.isArray(results) ? results : (results.data || []);
            const document = items.find((item: any) =>
                Object.keys(filter).every(key => item[key] === filter[key])
            ) || null;

            return { document };
        }
    }

    /**
     * Update a document in a collection
     * Routes to appropriate endpoint based on collection name
     */
    async updateDocument(
        collectionName: string,
        filter: Record<string, any>,
        update: Record<string, any>
    ): Promise<{ matchedCount: number; modifiedCount: number }> {
        const id = filter._id || filter.id || filter.key;

        if (!id) {
            return { matchedCount: 0, modifiedCount: 0 };
        }

        const endpoint = this.getEndpointForCollection(collectionName, 'update', id);
        const updateData = update.$set || update;

        try {
            await this.httpClient.put(endpoint, updateData);
            return { matchedCount: 1, modifiedCount: 1 };
        } catch (error) {
            return { matchedCount: 0, modifiedCount: 0 };
        }
    }

    /**
     * Delete a document from a collection
     * Routes to appropriate endpoint based on collection name
     */
    async deleteDocument(
        collectionName: string,
        filter: Record<string, any>
    ): Promise<{ deletedCount: number }> {
        const id = filter._id || filter.id || filter.key;

        if (!id) {
            return { deletedCount: 0 };
        }

        const endpoint = this.getEndpointForCollection(collectionName, 'delete', id);

        try {
            await this.httpClient.delete(endpoint);
            return { deletedCount: 1 };
        } catch (error) {
            return { deletedCount: 0 };
        }
    }

    /**
     * List all collections in the database
     * Returns the supported collection names
     */
    async listCollections(): Promise<{ collections: string[] }> {
        return {
            collections: ['use_cases', 'projects', 'capabilities']
        };
    }

    /* ---------- Helper Methods ---------- */

    /**
     * Get the appropriate API endpoint based on collection name and operation
     */
    private getEndpointForCollection(collectionName: string, operation: string, id?: string): string {
        const normalized = collectionName.toLowerCase().replace(/s$/, ''); // Remove trailing 's'

        switch (normalized) {
            case 'use_case':
                return this.getUseCaseEndpoint(operation, id);
            case 'project':
                return this.getProjectEndpoint(operation, id);
            case 'capabilitie': // 'capabilities' -> 'capabilitie' after removing 's'
            case 'capability':
                return this.getCapabilityEndpoint(operation, id);
            default:
                throw new Error(`Unsupported collection: ${collectionName}`);
        }
    }

    private getUseCaseEndpoint(operation: string, id?: string): string {
        switch (operation) {
            case 'list':
                return '/api/use-cases/mcp/list';
            case 'find':
                return `/api/use-cases/mcp/find/${id}`;
            case 'create':
                return '/api/use-cases/mcp/create';
            case 'update':
                return `/api/use-cases/${id}`; // Uses authenticated endpoint
            case 'delete':
                return `/api/use-cases/mcp/delete/${id}`;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }
    }

    private getProjectEndpoint(operation: string, id?: string): string {
        switch (operation) {
            case 'list':
                return '/api/projects/mcp/list';
            case 'find':
                return `/api/projects/mcp/find/${id}`;
            case 'create':
                return '/api/projects/mcp/create';
            case 'update':
                return `/api/projects/${id}`; // Uses authenticated endpoint
            case 'delete':
                return `/api/projects/${id}`; // Uses authenticated endpoint (soft delete)
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }
    }

    private getCapabilityEndpoint(operation: string, id?: string): string {
        switch (operation) {
            case 'list':
                return '/api/capabilities'; // No specific list endpoint, returns all
            case 'find':
                return `/api/capabilities/${id}`;
            case 'create':
                return '/api/capabilities';
            case 'update':
                return `/api/capabilities/${id}`;
            case 'delete':
                return `/api/capabilities/${id}`;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }
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

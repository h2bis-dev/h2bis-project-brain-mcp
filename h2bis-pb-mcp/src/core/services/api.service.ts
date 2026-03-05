import { config } from '../config/config.js';
import { HttpClient } from '../infrastructure/http-client.js';

/**
 * API Service for h2bis-pb-api
 * Routes to use-case, project, and capability endpoints based on collection name
 * 
 * Authentication Priority:
 * 1. API Key (X-API-Key header) - preferred for agents
 * 2. JWT Token (from environment)
 * 3. JWT Login (email/password)
 */
class ApiService {
    private httpClient: HttpClient;
    private authToken: string = '';
    private initialized: boolean = false;
    private authMethod: 'api-key' | 'jwt' | 'none' = 'none';

    constructor() {
        this.httpClient = new HttpClient({
            baseUrl: config.apiBaseUrl,
            headers: { 'Content-Type': 'application/json' },
        });
        this.initializeAuth();
    }

    /**
     * Initialize authentication
     * Priority: API Key > JWT Token > JWT Login > No Auth
     */
    private async initializeAuth(): Promise<void> {
        try {
            // Priority 1: API Key (preferred for agents)
            if (config.apiKey) {
                this.httpClient = new HttpClient({
                    baseUrl: config.apiBaseUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': config.apiKey,
                    },
                });
                this.authMethod = 'api-key';
                this.initialized = true;
                console.error('🔑 Using API Key authentication');
                return;
            }

            // Priority 2: Existing JWT token from environment
            if (config.apiToken) {
                this.authToken = config.apiToken;
                this.updateAuthHeader();
                this.authMethod = 'jwt';
                this.initialized = true;
                console.error('🔐 Using JWT token from environment');
                return;
            }

            // Priority 3: Login with credentials
            if (config.apiEmail && config.apiPassword) {
                await this.login(config.apiEmail, config.apiPassword);
                this.authMethod = 'jwt';
                this.initialized = true;
                console.error('🔐 Using JWT authentication (logged in)');
                return;
            }

            // No auth configured
            console.error('⚠️ No authentication configured - some endpoints may fail');
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize authentication:', error);
            this.initialized = true; // Continue even if auth fails
        }
    }

    /**
     * Login to get an access token (legacy JWT flow)
     */
    private async login(email: string, password: string): Promise<void> {
        try {
            const response = await this.httpClient.post('/api/auth/login', {
                email,
                password
            }) as any;

            if (response.accessToken) {
                this.authToken = response.accessToken;
                this.updateAuthHeader();
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    /**
     * Update HTTP client headers with JWT auth token
     */
    private updateAuthHeader(): void {
        if (this.authToken) {
            this.httpClient = new HttpClient({
                baseUrl: config.apiBaseUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
            });
        }
    }

    /**
     * Ensure authentication is initialized before making requests
     */
    private async ensureAuthenticated(): Promise<void> {
        if (!this.initialized) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait a bit
        }
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
        const endpoint = '/api/project-brain-system/mcp/insert';
        const result = await this.httpClient.post(endpoint, { collectionName, document }) as any;

        // Normalize response to match expected format
        return {
            insertedId: result.data?.documentId || result.id || result._id || result.key || 'unknown',
            ...result.data
        };
    }

    /**
     * Find a document in a collection
     * Uses unified project brain system endpoint
     */
    async findDocument(
        collectionName: string,
        filter: Record<string, any> = {}
    ): Promise<{ document: any }> {
        const endpoint = '/api/project-brain-system/mcp/find';
        const result = await this.httpClient.post(endpoint, { collectionName, filter, limit: 100 }) as any;

        // Return documents array or single document
        const documents = result.data?.documents || [];
        
        // If filter is empty or multiple docs, return all
        if (documents.length === 0) {
            return { document: null };
        } else if (documents.length === 1) {
            return { document: documents[0] };
        } else {
            return { document: documents };
        }
    }

    /**
     * Update a document in a collection
     * Uses unified project brain system endpoint
     */
    async updateDocument(
        collectionName: string,
        filter: Record<string, any>,
        update: Record<string, any>
    ): Promise<{ matchedCount: number; modifiedCount: number }> {
        const endpoint = '/api/project-brain-system/mcp/update';

        try {
            const result = await this.httpClient.put(endpoint, { collectionName, filter, update }) as any;
            return { 
                matchedCount: 1, 
                modifiedCount: result.data?.modifiedCount || 1 
            };
        } catch (error) {
            return { matchedCount: 0, modifiedCount: 0 };
        }
    }

    /**
     * Delete a document from a collection
     * Uses unified project brain system endpoint
     */
    async deleteDocument(
        collectionName: string,
        filter: Record<string, any>
    ): Promise<{ deletedCount: number }> {
        const endpoint = '/api/project-brain-system/mcp/delete';

        try {
            const result = await this.httpClient.delete(endpoint, { collectionName, filter }) as any;
            return { deletedCount: result.data?.deletedCount || 1 };
        } catch (error) {
            return { deletedCount: 0 };
        }
    }

    /**
     * List all collections in the database
     * Returns the supported collection names
     */
    async listCollections(): Promise<{ collections: string[] }> {
        const result = await this.get<any>('/api/project-brain-system/mcp/collections');
        return {
            collections: result.data.collections
        };
    }

    /* ---------- Helper Methods ---------- */

    /**
     * Extract items array from various API response structures
     * Handles nested data like { data: { projects: [...] } }
     */
    private extractItemsFromResponse(results: any, collectionName: string): any[] {
        // If results is already an array, return it
        if (Array.isArray(results)) {
            return results;
        }

        // Handle nested data structure
        if (results?.data) {
            // Direct array in data
            if (Array.isArray(results.data)) {
                return results.data;
            }

            // Collection-specific arrays
            const normalized = collectionName.toLowerCase().replace(/s$/, '');
            switch (normalized) {
                case 'project':
                    if (Array.isArray(results.data.projects)) {
                        return results.data.projects;
                    }
                    break;
                case 'use_case':
                    if (Array.isArray(results.data.useCases)) {
                        return results.data.useCases;
                    }
                    break;
                case 'capabilitie':
                case 'capability':
                    if (Array.isArray(results.data.capabilities)) {
                        return results.data.capabilities;
                    }
                    break;
            }
        }

        // Fallback to empty array
        return [];
    }

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

    /* ---------- Generic HTTP Methods ---------- */

    /**
     * Generic GET request
     */
    async get<T = any>(endpoint: string): Promise<T> {
        await this.ensureAuthenticated();
        return this.httpClient.get(endpoint);
    }

    /**
     * Generic POST request
     */
    async post<T = any>(endpoint: string, data: any): Promise<T> {
        await this.ensureAuthenticated();
        return this.httpClient.post(endpoint, data);
    }

    /**
     * Generic PUT request
     */
    async put<T = any>(endpoint: string, data: any): Promise<T> {
        await this.ensureAuthenticated();
        return this.httpClient.put(endpoint, data);
    }

    /**
     * Generic DELETE request
     */
    async delete<T = any>(endpoint: string): Promise<T> {
        await this.ensureAuthenticated();
        return this.httpClient.delete(endpoint);
    }
}

export const apiService = new ApiService();

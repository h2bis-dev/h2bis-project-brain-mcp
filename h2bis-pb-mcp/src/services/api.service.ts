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
}

export const apiService = new ApiService();

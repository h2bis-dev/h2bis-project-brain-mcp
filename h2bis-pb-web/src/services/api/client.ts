import { API_BASE_URL } from '@/lib/config';

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            const data = await response.json();

            // Check for API error response
            if (data.error) {
                throw new ApiError(data.error, response.status, data);
            }

            if (!response.ok) {
                throw new ApiError(
                    `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    data
                );
            }

            return data as T;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            // Network or parsing errors
            throw new ApiError(
                error instanceof Error ? error.message : 'An unknown error occurred'
            );
        }
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    async patch<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

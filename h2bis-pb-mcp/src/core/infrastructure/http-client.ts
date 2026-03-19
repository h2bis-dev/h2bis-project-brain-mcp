/**
 * Generic HTTP Client
 * Handles all HTTP transport concerns: requests, responses, error handling
 * Separated from business logic to enable easy addition of:
 * - Encryption/decryption
 * - Authentication tokens
 * - Request/response interceptors
 * - Retry logic
 * - Logging
 */

export interface HttpClientConfig {
    baseUrl: string;
    headers?: Record<string, string>;
    timeout?: number;
}

export interface RequestOptions {
    headers?: Record<string, string>;
    timeout?: number;
}

export class HttpClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;
    private timeout: number;

    constructor(config: HttpClientConfig) {
        this.baseUrl = config.baseUrl;
        this.defaultHeaders = config.headers || { 'Content-Type': 'application/json' };
        this.timeout = config.timeout || 30000; // 30 seconds default
    }

    /**
     * Generic request method
     * All HTTP methods (GET, POST, PUT, DELETE) use this
     */
    async request<T>(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        body?: any,
        options?: RequestOptions
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = { ...this.defaultHeaders, ...options?.headers };

        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: AbortSignal.timeout(options?.timeout || this.timeout),
        });

        if (!response.ok) {
            const error = await response.json() as {
                error?: { message?: string };
                message?: string;
                validationFailed?: boolean;
                validationReport?: any;
                insertedId?: string;
            };

            // Handle special validation rejection case
            if (error.validationFailed && error.insertedId) {
                throw new Error(
                    `Use case inserted successfully (ID: ${error.insertedId}) but capability generation was REJECTED by validation.\n` +
                    `Confidence: ${error.validationReport?.confidenceScore || 'unknown'}%\n` +
                    `Issues: ${error.validationReport?.issues?.length || 0}\n` +
                    `Recommendation: ${error.validationReport?.recommendation || 'Review validation report'}`
                );
            }

            throw new Error(
                (typeof error.error === 'string' ? error.error : error.error?.message)
                    || error.message
                    || `HTTP ${response.status}: ${response.statusText}`
            );
        }

        return await response.json() as T;
    }

    /**
     * Convenience methods for common HTTP verbs
     */
    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'GET', undefined, options);
    }

    async post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'POST', body, options);
    }

    async put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'PUT', body, options);
    }

    async delete<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'DELETE', body, options);
    }

    /**
     * Update base URL (useful for switching environments)
     */
    setBaseUrl(baseUrl: string): void {
        this.baseUrl = baseUrl;
    }

    /**
     * Add or update default headers (useful for auth tokens)
     */
    setHeader(key: string, value: string): void {
        this.defaultHeaders[key] = value;
    }

    /**
     * Remove a default header
     */
    removeHeader(key: string): void {
        delete this.defaultHeaders[key];
    }
}

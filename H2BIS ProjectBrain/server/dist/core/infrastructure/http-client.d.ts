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
/**
 * Structured HTTP error that carries the response status code.
 * Thrown by HttpClient for any non-2xx response so callers can branch on status
 * without string-matching error messages.
 */
export declare class HttpError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
}
export interface HttpClientConfig {
    baseUrl: string;
    headers?: Record<string, string>;
    timeout?: number;
}
export interface RequestOptions {
    headers?: Record<string, string>;
    timeout?: number;
}
export declare class HttpClient {
    private baseUrl;
    private defaultHeaders;
    private timeout;
    constructor(config: HttpClientConfig);
    /**
     * Generic request method
     * All HTTP methods (GET, POST, PUT, DELETE) use this
     */
    request<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, options?: RequestOptions): Promise<T>;
    /**
     * Convenience methods for common HTTP verbs
     */
    get<T>(endpoint: string, options?: RequestOptions): Promise<T>;
    post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T>;
    put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T>;
    delete<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T>;
    /**
     * Update base URL (useful for switching environments)
     */
    setBaseUrl(baseUrl: string): void;
    /**
     * Add or update default headers (useful for auth tokens)
     */
    setHeader(key: string, value: string): void;
    /**
     * Remove a default header
     */
    removeHeader(key: string): void;
}
//# sourceMappingURL=http-client.d.ts.map
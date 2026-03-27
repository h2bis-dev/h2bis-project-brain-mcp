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
export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'HttpError';
    }
}
export class HttpClient {
    constructor(config) {
        this.baseUrl = config.baseUrl;
        this.defaultHeaders = config.headers || { 'Content-Type': 'application/json' };
        this.timeout = config.timeout || 30000; // 30 seconds default
    }
    /**
     * Generic request method
     * All HTTP methods (GET, POST, PUT, DELETE) use this
     */
    async request(endpoint, method, body, options) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = { ...this.defaultHeaders, ...options?.headers };
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: AbortSignal.timeout(options?.timeout || this.timeout),
        });
        if (!response.ok) {
            const error = await response.json();
            // Handle special validation rejection case
            if (error.validationFailed && error.insertedId) {
                throw new Error(`Use case inserted successfully (ID: ${error.insertedId}) but capability generation was REJECTED by validation.\n` +
                    `Confidence: ${error.validationReport?.confidenceScore || 'unknown'}%\n` +
                    `Issues: ${error.validationReport?.issues?.length || 0}\n` +
                    `Recommendation: ${error.validationReport?.recommendation || 'Review validation report'}`);
            }
            throw new HttpError(response.status, (typeof error.error === 'string' ? error.error : error.error?.message)
                || error.message
                || `HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    }
    /**
     * Convenience methods for common HTTP verbs
     */
    async get(endpoint, options) {
        return this.request(endpoint, 'GET', undefined, options);
    }
    async post(endpoint, body, options) {
        return this.request(endpoint, 'POST', body, options);
    }
    async put(endpoint, body, options) {
        return this.request(endpoint, 'PUT', body, options);
    }
    async delete(endpoint, body, options) {
        return this.request(endpoint, 'DELETE', body, options);
    }
    /**
     * Update base URL (useful for switching environments)
     */
    setBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
    }
    /**
     * Add or update default headers (useful for auth tokens)
     */
    setHeader(key, value) {
        this.defaultHeaders[key] = value;
    }
    /**
     * Remove a default header
     */
    removeHeader(key) {
        delete this.defaultHeaders[key];
    }
}
//# sourceMappingURL=http-client.js.map
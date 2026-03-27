import { config } from '../config/config.js';
import { HttpClient } from '../infrastructure/http-client.js';
import { authService } from './auth.service.js';

/**
 * ApiService
 *
 * Authenticated HTTP client for h2bis-pb-api.
 * Every outgoing request goes through authService.getAuthHeaders()
 * which ensures the caller is authenticated (token refresh / OAuth)
 * before the request is dispatched.
 *
 * Module services (project, use-case) depend on this — they never
 * deal with tokens or auth flows directly.
 */
class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = config.apiBaseUrl;
    }

    /* ─── Auth status (delegates to AuthService) ─────────────────────── */

    async waitForAuth(): Promise<void> {
        return authService.waitForAuth();
    }

    get isPendingApproval(): boolean {
        return authService.isPendingApproval;
    }

    get isAuthenticated(): boolean {
        return authService.isAuthenticated;
    }

    /* ─── HTTP Methods ───────────────────────────────────────────────── */

    async get<T = any>(endpoint: string): Promise<T> {
        const client = await this.authenticatedClient();
        return client.get(endpoint);
    }

    async post<T = any>(endpoint: string, data: any): Promise<T> {
        const client = await this.authenticatedClient();
        return client.post(endpoint, data);
    }

    async put<T = any>(endpoint: string, data: any): Promise<T> {
        const client = await this.authenticatedClient();
        return client.put(endpoint, data);
    }

    async delete<T = any>(endpoint: string): Promise<T> {
        const client = await this.authenticatedClient();
        return client.delete(endpoint);
    }

    /* ─── Internal ───────────────────────────────────────────────────── */

    private async authenticatedClient(): Promise<HttpClient> {
        const authHeaders = await authService.getAuthHeaders();
        return new HttpClient({
            baseUrl: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
            },
        });
    }
}

export const apiService = new ApiService();


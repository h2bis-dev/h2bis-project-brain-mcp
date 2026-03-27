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
declare class ApiService {
    private baseUrl;
    constructor();
    waitForAuth(): Promise<void>;
    get isPendingApproval(): boolean;
    get isAuthenticated(): boolean;
    get<T = any>(endpoint: string): Promise<T>;
    post<T = any>(endpoint: string, data: any): Promise<T>;
    put<T = any>(endpoint: string, data: any): Promise<T>;
    delete<T = any>(endpoint: string): Promise<T>;
    private authenticatedClient;
}
export declare const apiService: ApiService;
export {};
//# sourceMappingURL=api.service.d.ts.map
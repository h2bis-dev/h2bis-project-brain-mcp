/**
 * AuthService
 *
 * Owns the full authentication lifecycle for the MCP server:
 *   - Persisted token restore from disk
 *   - GitHub OAuth browser flow (default for end users)
 *   - Token refresh & re-authentication on expiry
 *   - Token persistence to ~/.config/h2bis-mcp/tokens.json
 *
 * Authentication priority (highest → lowest):
 *   1. Persisted tokens from disk (survives restarts)
 *   2. GitHub OAuth browser flow (default for end users)
 */
declare class AuthService {
    private accessToken;
    private refreshToken;
    private accessTokenExpiry;
    private initialized;
    private _pendingApproval;
    /** Set when startup verification was skipped because the API was unreachable.
     *  ensureAuth will re-verify on the first actual tool call before using the token. */
    private _needsApiVerification;
    /** Unauthenticated HTTP client used only for auth-related API calls. */
    private httpClient;
    /** Tracks the in-flight initializeAuth() promise so ensureAuth can await it. */
    private _initPromise;
    constructor();
    /** Await initial authentication. Call from main() for startup status logging. */
    waitForAuth(): Promise<void>;
    /** True if the user's account is registered but awaiting admin activation. */
    get isPendingApproval(): boolean;
    /** True if we have a valid (or refreshable) auth token. */
    get isAuthenticated(): boolean;
    /**
     * Revoke the refresh token on the API, then wipe all local tokens and the
     * persisted token store. After this call the service is fully unauthenticated
     * and the next tool call will trigger a fresh GitHub OAuth flow.
     */
    logout(): Promise<void>;
    /** Wipes all in-memory tokens and clears the persisted token store. */
    private clearSession;
    /**
     * Returns current auth headers to attach to outgoing requests.
     * Ensures authentication is valid before returning — may trigger
     * a token refresh or a full GitHub OAuth flow.
     */
    getAuthHeaders(): Promise<Record<string, string>>;
    private initializeAuth;
    /**
     * Ensure we hold a valid access token. Called by ApiService before
     * every outgoing request. May trigger refresh or full re-auth.
     */
    private ensureAuth;
    private setTokens;
    private decodeJwt;
    /**
     * Call GET /api/auth/me to confirm the token is live on the API.
     *
     * Returns:
     *  'valid'       — API confirmed the token (200 OK, user exists and is active)
     *  'rejected'    — API definitively rejected it (401 / 403);
     *                  tokens must be wiped and a fresh OAuth flow started
     *  'unreachable' — API could not be contacted (network error, timeout, cold-start);
     *                  tokens are kept and verification is deferred to the first tool call
     */
    private verifyTokenWithApi;
    private loadPersistedTokens;
    private persistTokens;
    private refresh;
    /**
     * Parses query parameters from an incoming OAuth callback request URL.
     * Centralises URL routing and parameter extraction, replacing the inline
     * logic that previously lived in the githubOAuthFlow() callback server handler.
     */
    private parseOAuthCallbackParams;
    /** Builds the HTTP response tuple (status, content-type, body) for a given OAuth callback outcome. */
    private buildOAuthCallbackResponse;
    /** Probes ports starting at preferredPort until a free one is found (up to 10 attempts). */
    private findFreePort;
    private githubOAuthFlow;
    private openBrowser;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth.service.d.ts.map
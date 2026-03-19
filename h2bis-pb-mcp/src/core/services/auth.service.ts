import { config } from '../config/config.js';
import { HttpClient } from '../infrastructure/http-client.js';
import { createServer } from 'node:http';
import { URL } from 'node:url';
import { execFile } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

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
class AuthService {
    private accessToken: string = '';
    private refreshToken: string = '';
    private accessTokenExpiry: number = 0;
    private initialized: boolean = false;
    private _pendingApproval: boolean = false;

    /** Unauthenticated HTTP client used only for auth-related API calls. */
    private httpClient: HttpClient;

    /** Tracks the in-flight initializeAuth() promise so ensureAuth can await it. */
    private _initPromise: Promise<void>;

    constructor() {
        this.httpClient = new HttpClient({
            baseUrl: config.apiBaseUrl,
            headers: { 'Content-Type': 'application/json' },
        });
        this._initPromise = this.initializeAuth();
    }

    /* ─── Public API ─────────────────────────────────────────────────── */

    /** Await initial authentication. Call from main() for startup status logging. */
    async waitForAuth(): Promise<void> {
        await this._initPromise;
    }

    /** True if the user's account is registered but awaiting admin activation. */
    get isPendingApproval(): boolean {
        return this._pendingApproval;
    }

    /** True if we have a valid (or refreshable) auth token. */
    get isAuthenticated(): boolean {
        return !!this.accessToken;
    }

    /**
     * Returns current auth headers to attach to outgoing requests.
     * Ensures authentication is valid before returning — may trigger
     * a token refresh or a full GitHub OAuth flow.
     */
    async getAuthHeaders(): Promise<Record<string, string>> {
        await this.ensureAuth();
        return { 'Authorization': `Bearer ${this.accessToken}` };
    }

    /* ─── Initialization ─────────────────────────────────────────────── */

    private async initializeAuth(): Promise<void> {
        try {
            // Priority 1: Restore valid tokens from disk (survives npx restarts)
            if (this.loadPersistedTokens()) {
                this.initialized = true;
                console.error('🔐 Restored session from saved tokens');
                return;
            }

            // Priority 2: GitHub OAuth browser flow — default for end users
            // No secrets needed in MCP; the API holds GitHub client credentials.
            console.error('🔐 No saved session — starting GitHub OAuth...');
            await this.githubOAuthFlow();
            this.initialized = true;

        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            if (msg.includes('pending_approval')) {
                this._pendingApproval = true;
                console.error('⏳ Your account is pending admin approval. MCP will start but tool calls will require re-authentication once approved.');
                console.error('   Once an admin approves your account, reload VS Code to authenticate.');
            } else {
                console.error('⚠️ Authentication failed:', msg);
                console.error('   MCP will start. Authentication will be retried when you use a tool.');
            }
            this.initialized = true;
        }
    }

    /* ─── Gate — called before every API request ─────────────────────── */

    /**
     * Ensure we hold a valid access token. Called by ApiService before
     * every outgoing request. May trigger refresh or full re-auth.
     */
    private async ensureAuth(): Promise<void> {
        // Wait for initializeAuth() to complete (OAuth can take minutes).
        if (!this.initialized) {
            await this._initPromise;
        }

        // Proactive token refresh
        if (this.accessToken && Date.now() > this.accessTokenExpiry - 60_000) {
            await this.refresh();
        }

        // Still no token — retry the OAuth flow (startup failure, API was down, etc.)
        if (!this.accessToken) {
            if (this._pendingApproval) {
                console.error('🔐 Retrying authentication (previously pending approval)...');
            } else {
                console.error('🔐 No authentication token — initiating GitHub OAuth...');
            }

            try {
                await this.githubOAuthFlow();
                this._pendingApproval = false;
            } catch (error) {
                const msg = error instanceof Error ? error.message : String(error);
                if (msg.includes('pending_approval')) {
                    this._pendingApproval = true;
                    throw new Error(
                        'Your account is pending admin approval. ' +
                        'An administrator needs to activate your account before you can use the tools. ' +
                        'Reload VS Code once approved.'
                    );
                }
                throw new Error(
                    'Authentication failed: ' + msg + '. ' +
                    'Reload the VS Code window to retry.'
                );
            }
        }
    }

    /* ─── Token Management ───────────────────────────────────────────── */

    private setTokens(access: string, refresh?: string): void {
        this.accessToken = access;
        if (refresh) {
            this.refreshToken = refresh;
        }

        const decoded = this.decodeJwt(access);
        if (decoded?.exp) {
            this.accessTokenExpiry = decoded.exp * 1000;
        } else {
            this.accessTokenExpiry = Date.now() + 14 * 60 * 1000;
        }

        this.persistTokens();
    }

    private decodeJwt(token: string): Record<string, any> | null {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        } catch {
            return null;
        }
    }

    /* ─── Persistence ────────────────────────────────────────────────── */

    private loadPersistedTokens(): boolean {
        try {
            if (!existsSync(config.tokenStorePath)) return false;
            const data = JSON.parse(readFileSync(config.tokenStorePath, 'utf-8'));
            if (!data?.accessToken) return false;

            const decoded = this.decodeJwt(data.accessToken);
            if (decoded?.exp && decoded.exp * 1000 < Date.now() + 60_000) {
                // Expired — but if we have a refresh token, load anyway (lazy refresh in ensureAuth)
                if (data.refreshToken) {
                    this.refreshToken = data.refreshToken;
                    this.accessTokenExpiry = 0;
                    this.setTokens(data.accessToken, data.refreshToken);
                    return true;
                }
                return false;
            }

            this.setTokens(data.accessToken, data.refreshToken);
            return true;
        } catch {
            return false;
        }
    }

    private persistTokens(): void {
        try {
            mkdirSync(dirname(config.tokenStorePath), { recursive: true });
            writeFileSync(config.tokenStorePath, JSON.stringify({
                accessToken: this.accessToken,
                refreshToken: this.refreshToken,
            }, null, 2), { mode: 0o600 });
        } catch {
            // Non-fatal — just won't persist
        }
    }

    /* ─── Token Refresh ────────────────────────────────────────────── */

    private async refresh(): Promise<void> {
        if (!this.refreshToken) {
            this.accessToken = '';
            return;                  // ensureAuth will handle re-authentication
        }

        try {
            const response = await this.httpClient.post('/api/auth/refresh', {
                refreshToken: this.refreshToken,
            }) as any;
            if (!response?.accessToken) {
                throw new Error('Refresh failed: no access token returned');
            }
            this.setTokens(response.accessToken, response.refreshToken);
        } catch {
            console.error('Token refresh failed — clearing session for re-authentication.');
            this.accessToken = '';
            this.refreshToken = '';
            this.accessTokenExpiry = 0;
            try { writeFileSync(config.tokenStorePath, '{}'); } catch { /* ignore */ }
            // Don't re-throw — ensureAuth() will detect the empty token and
            // trigger githubOAuthFlow() with proper pending_approval handling.
        }
    }

    /* ─── GitHub OAuth Browser Flow ──────────────────────────────────── */

    private async githubOAuthFlow(): Promise<void> {
        const callbackPort = config.oauthCallbackPort;
        const callbackPath = config.oauthCallbackPath;
        const localCallbackUrl = `http://localhost:${callbackPort}${callbackPath}`;

        const response = await this.httpClient.get(
            `/api/auth/github/authorize?returnUrl=${encodeURIComponent(localCallbackUrl)}`
        ) as any;

        const authorizeUrl = response?.authorizeUrl;
        if (!authorizeUrl) {
            throw new Error('Failed to obtain GitHub authorize URL from API. Is the API running and GitHub OAuth configured?');
        }

        let resolved = false;
        let pendingApproval = false;

        const server = createServer((req, res) => {
            try {
                const url = new URL(req.url || '', `http://localhost:${callbackPort}`);
                if (url.pathname !== callbackPath) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not found');
                    return;
                }

                const success = url.searchParams.get('success');
                const accessToken = url.searchParams.get('accessToken');
                const refreshToken = url.searchParams.get('refreshToken');
                const error = url.searchParams.get('error');

                if (success === 'true' && accessToken) {
                    this.setTokens(accessToken, refreshToken || undefined);
                    resolved = true;
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end('<h1>✅ Authentication complete</h1><p>You may close this tab and return to VS Code.</p>');
                } else if (error === 'pending_approval') {
                    pendingApproval = true;
                    resolved = true;
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end('<h1>⏳ Account pending approval</h1><p>Your GitHub account has been registered. An admin needs to approve it before you can use the tools. Reload VS Code once approved.</p>');
                } else {
                    resolved = true;
                    res.writeHead(401, { 'Content-Type': 'text/html' });
                    res.end(`<h1>Authentication failed</h1><p>${error || 'Unknown error'}</p>`);
                }
            } catch (err) {
                console.error('OAuth callback handling error:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server error');
            } finally {
                server.close();
            }
        });

        await new Promise<void>((resolve, reject) => {
            server.listen(callbackPort, () => {
                console.error('');
                console.error('🔐 H2BIS MCP — GitHub authentication required');
                console.error('   Opening browser for GitHub sign-in...');
                console.error(`   If the browser does not open, visit: ${authorizeUrl}`);
                console.error('');
                this.openBrowser(authorizeUrl);
            });

            server.on('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    reject(new Error(`OAuth callback port ${callbackPort} is already in use. Set OAUTH_CALLBACK_PORT in your env to a different port.`));
                } else {
                    reject(err);
                }
            });

            const timeout = setTimeout(() => {
                if (!resolved) {
                    server.close();
                    reject(new Error('GitHub OAuth timed out after 3 minutes. Reload VS Code to retry.'));
                }
            }, 180_000);

            server.on('close', () => {
                clearTimeout(timeout);
                if (pendingApproval) {
                    reject(new Error('pending_approval'));
                } else if (resolved) {
                    resolve();
                } else {
                    reject(new Error('OAuth flow closed before completion.'));
                }
            });
        });
    }

    /* ─── Helpers ─────────────────────────────────────────────────────── */

    private openBrowser(url: string): void {
        try {
            const parsed = new URL(url);
            if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
                console.error('⚠️ Refusing to open non-HTTP URL');
                return;
            }
        } catch {
            console.error('⚠️ Invalid URL — cannot open browser');
            return;
        }

        const onError = (err: Error | null) => {
            if (err) {
                console.error('⚠️ Could not open browser automatically.');
                console.error(`   Please open this URL manually: ${url}`);
            }
        };

        const platform = process.platform;
        if (platform === 'win32') {
            execFile('cmd', ['/c', 'start', '', url], onError);
        } else if (platform === 'darwin') {
            execFile('open', [url], onError);
        } else {
            execFile('xdg-open', [url], onError);
        }
    }
}

export const authService = new AuthService();

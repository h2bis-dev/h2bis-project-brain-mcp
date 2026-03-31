import { config } from '../config/config.js';
import { HttpClient, HttpError } from '../infrastructure/http-client.js';
import { createServer } from 'node:http';
import { URL } from 'node:url';
import { exec, execFile } from 'node:child_process';
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
    constructor() {
        this.accessToken = '';
        this.refreshToken = '';
        this.accessTokenExpiry = 0;
        this.initialized = false;
        this._pendingApproval = false;
        /** Set when startup verification was skipped because the API was unreachable.
         *  ensureAuth will re-verify on the first actual tool call before using the token. */
        this._needsApiVerification = false;
        this.httpClient = new HttpClient({
            baseUrl: config.apiBaseUrl,
            headers: { 'Content-Type': 'application/json' },
        });
        this._initPromise = this.initializeAuth();
    }
    /* ─── Public API ─────────────────────────────────────────────────── */
    /** Await initial authentication. Call from main() for startup status logging. */
    async waitForAuth() {
        await this._initPromise;
    }
    /** True if the user's account is registered but awaiting admin activation. */
    get isPendingApproval() {
        return this._pendingApproval;
    }
    /** True if we have a valid (or refreshable) auth token. */
    get isAuthenticated() {
        return !!this.accessToken;
    }
    /**
     * Revoke the refresh token on the API, then wipe all local tokens and the
     * persisted token store. After this call the service is fully unauthenticated
     * and the next tool call will trigger a fresh GitHub OAuth flow.
     */
    async logout() {
        try {
            if (this.refreshToken) {
                await this.httpClient.post('/api/auth/logout', { refreshToken: this.refreshToken });
            }
        }
        catch {
            // Best-effort server-side revocation — clear locally regardless
        }
        this.accessToken = '';
        this.refreshToken = '';
        this.accessTokenExpiry = 0;
        this._pendingApproval = false;
        try {
            writeFileSync(config.tokenStorePath, '{}');
        }
        catch { /* ignore */ }
        console.error('🔓 Signed out — tokens cleared.');
    }
    /**
     * Returns current auth headers to attach to outgoing requests.
     * Ensures authentication is valid before returning — may trigger
     * a token refresh or a full GitHub OAuth flow.
     */
    async getAuthHeaders() {
        await this.ensureAuth();
        return { 'Authorization': `Bearer ${this.accessToken}` };
    }
    /* ─── Initialization ─────────────────────────────────────────────── */
    async initializeAuth() {
        try {
            // Priority 1: Restore valid tokens from disk — then verify against the API.
            // Local expiry check is not enough: tokens from deleted users, revoked sessions,
            // or a different environment would pass a purely local check.
            if (this.loadPersistedTokens()) {
                const status = await this.verifyTokenWithApi();
                if (status === 'valid') {
                    this.initialized = true;
                    console.error('🔐 Restored session from saved tokens');
                    return;
                }
                if (status === 'unreachable') {
                    // API is down at startup (Docker cold-start, network blip).
                    // Keep the tokens but flag them as unverified — ensureAuth will
                    // re-verify against the live API on the first actual tool call.
                    this._needsApiVerification = true;
                    this.initialized = true;
                    console.error('⚠️ API unreachable at startup — will re-verify tokens on first tool use.');
                    return;
                }
                // status === 'rejected': 401/403 — token is definitively invalid
                // (deleted user, deactivated account, wrong environment JWT secret, etc.)
                console.error('🔐 Saved tokens rejected by API — clearing session and starting fresh OAuth...');
                this.accessToken = '';
                this.refreshToken = '';
                this.accessTokenExpiry = 0;
                try {
                    writeFileSync(config.tokenStorePath, '{}');
                }
                catch { /* ignore */ }
            }
            // Priority 2: GitHub OAuth browser flow — default for end users
            // No secrets needed in MCP; the API holds GitHub client credentials.
            console.error('🔐 No valid session — starting GitHub OAuth...');
            await this.githubOAuthFlow();
            this.initialized = true;
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            if (msg.includes('pending_approval')) {
                this._pendingApproval = true;
                console.error('⏳ Your account is pending admin approval. MCP will start but tool calls will require re-authentication once approved.');
                console.error('   Once an admin approves your account, reload VS Code to authenticate.');
            }
            else if (msg.includes('Cannot reach the API')) {
                console.error(`⚠️ ${msg}`);
            }
            else {
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
    async ensureAuth() {
        // Wait for initializeAuth() to complete (OAuth can take minutes).
        if (!this.initialized) {
            await this._initPromise;
        }
        // If startup verification was deferred (API was unreachable), re-verify now.
        // This prevents using stale / environment-mismatched tokens silently.
        if (this.accessToken && this._needsApiVerification) {
            this._needsApiVerification = false;
            const status = await this.verifyTokenWithApi();
            if (status === 'rejected') {
                console.error('🔐 Deferred token verification failed — clearing session and starting OAuth...');
                this.accessToken = '';
                this.refreshToken = '';
                this.accessTokenExpiry = 0;
                try {
                    writeFileSync(config.tokenStorePath, '{}');
                }
                catch { /* ignore */ }
            }
            // 'valid' → proceed normally; 'unreachable' → try using the token anyway
        }
        // Proactive token refresh
        if (this.accessToken && Date.now() > this.accessTokenExpiry - 60000) {
            await this.refresh();
        }
        // Still no token — retry the OAuth flow (startup failure, API was down, etc.)
        if (!this.accessToken) {
            if (this._pendingApproval) {
                console.error('🔐 Retrying authentication (previously pending approval)...');
            }
            else {
                console.error('🔐 No authentication token — initiating GitHub OAuth...');
            }
            try {
                await this.githubOAuthFlow();
                this._pendingApproval = false;
            }
            catch (error) {
                const msg = error instanceof Error ? error.message : String(error);
                if (msg.includes('pending_approval')) {
                    this._pendingApproval = true;
                    throw new Error('Your account is pending admin approval. ' +
                        'An administrator needs to activate your account before you can use the tools. ' +
                        'Reload VS Code once approved.');
                }
                if (msg.includes('Cannot reach the API')) {
                    throw new Error(msg);
                }
                throw new Error('Authentication failed: ' + msg + '. ' +
                    'Reload the VS Code window to retry.');
            }
        }
    }
    /* ─── Token Management ───────────────────────────────────────────── */
    setTokens(access, refresh) {
        this.accessToken = access;
        if (refresh) {
            this.refreshToken = refresh;
        }
        const decoded = this.decodeJwt(access);
        if (decoded?.exp) {
            this.accessTokenExpiry = decoded.exp * 1000;
        }
        else {
            this.accessTokenExpiry = Date.now() + 14 * 60 * 1000;
        }
        this.persistTokens();
    }
    decodeJwt(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3)
                return null;
            return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        }
        catch {
            return null;
        }
    }
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
    async verifyTokenWithApi() {
        try {
            const client = new HttpClient({
                baseUrl: config.apiBaseUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`,
                },
                timeout: 8000,
            });
            await client.get('/api/auth/me');
            return 'valid';
        }
        catch (err) {
            if (err instanceof HttpError && (err.status === 401 || err.status === 403)) {
                return 'rejected';
            }
            // Network error, timeout, unexpected 5xx — API unreachable
            return 'unreachable';
        }
    }
    /* ─── Persistence ────────────────────────────────────────────────── */
    loadPersistedTokens() {
        try {
            if (!existsSync(config.tokenStorePath))
                return false;
            const data = JSON.parse(readFileSync(config.tokenStorePath, 'utf-8'));
            if (!data?.accessToken)
                return false;
            const decoded = this.decodeJwt(data.accessToken);
            if (decoded?.exp && decoded.exp * 1000 < Date.now() + 60000) {
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
        }
        catch {
            return false;
        }
    }
    persistTokens() {
        try {
            mkdirSync(dirname(config.tokenStorePath), { recursive: true });
            writeFileSync(config.tokenStorePath, JSON.stringify({
                accessToken: this.accessToken,
                refreshToken: this.refreshToken,
            }, null, 2), { mode: 0o600 });
        }
        catch {
            // Non-fatal — just won't persist
        }
    }
    /* ─── Token Refresh ────────────────────────────────────────────── */
    async refresh() {
        if (!this.refreshToken) {
            this.accessToken = '';
            return; // ensureAuth will handle re-authentication
        }
        try {
            const response = await this.httpClient.post('/api/auth/refresh', {
                refreshToken: this.refreshToken,
            });
            if (!response?.accessToken) {
                throw new Error('Refresh failed: no access token returned');
            }
            this.setTokens(response.accessToken, response.refreshToken);
        }
        catch {
            console.error('Token refresh failed — clearing session for re-authentication.');
            this.accessToken = '';
            this.refreshToken = '';
            this.accessTokenExpiry = 0;
            try {
                writeFileSync(config.tokenStorePath, '{}');
            }
            catch { /* ignore */ }
            // Don't re-throw — ensureAuth() will detect the empty token and
            // trigger githubOAuthFlow() with proper pending_approval handling.
        }
    }
    /* ─── GitHub OAuth Browser Flow ──────────────────────────────────── */
    /** Probes ports starting at preferredPort until a free one is found (up to 10 attempts). */
    findFreePort(preferredPort) {
        return new Promise((resolve, reject) => {
            const tryPort = (port, remaining) => {
                if (remaining <= 0) {
                    reject(new Error(`Could not find a free OAuth callback port near ${preferredPort}. Free a port and retry.`));
                    return;
                }
                const probe = createServer();
                probe.listen(port, () => probe.close(() => resolve(port)));
                probe.on('error', (err) => {
                    if (err.code === 'EADDRINUSE') {
                        tryPort(port + 1, remaining - 1);
                    }
                    else {
                        reject(err);
                    }
                });
            };
            tryPort(preferredPort, 10);
        });
    }
    async githubOAuthFlow() {
        const callbackPort = await this.findFreePort(config.oauthCallbackPort);
        const callbackPath = config.oauthCallbackPath;
        const localCallbackUrl = `http://localhost:${callbackPort}${callbackPath}`;
        let response;
        try {
            response = await this.httpClient.get(`/api/auth/github/authorize?returnUrl=${encodeURIComponent(localCallbackUrl)}`);
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            throw new Error(`Cannot reach the API at ${config.apiBaseUrl} (${msg}). ` +
                'Make sure the API server is running, or set API_BASE_URL in your ' +
                'mcp.json env block (or ~/.config/h2bis-mcp/.env) to the correct URL.');
        }
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
                }
                else if (error === 'pending_approval') {
                    pendingApproval = true;
                    resolved = true;
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end('<h1>⏳ Account pending approval</h1><p>Your GitHub account has been registered. An admin needs to approve it before you can use the tools. Reload VS Code once approved.</p>');
                }
                else {
                    resolved = true;
                    res.writeHead(401, { 'Content-Type': 'text/html' });
                    res.end(`<h1>Authentication failed</h1><p>${error || 'Unknown error'}</p>`);
                }
            }
            catch (err) {
                console.error('OAuth callback handling error:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server error');
            }
            finally {
                server.close();
            }
        });
        await new Promise((resolve, reject) => {
            server.listen(callbackPort, () => {
                console.error('');
                console.error('🔐 H2BIS MCP — GitHub authentication required');
                console.error('   Opening browser for GitHub sign-in...');
                console.error(`   If the browser does not open, visit: ${authorizeUrl}`);
                console.error('');
                this.openBrowser(authorizeUrl);
            });
            server.on('error', (err) => {
                reject(err);
            });
            const timeout = setTimeout(() => {
                if (!resolved) {
                    server.close();
                    reject(new Error('GitHub OAuth timed out after 3 minutes. Reload VS Code to retry.'));
                }
            }, 180000);
            server.on('close', () => {
                clearTimeout(timeout);
                if (pendingApproval) {
                    reject(new Error('pending_approval'));
                }
                else if (resolved) {
                    resolve();
                }
                else {
                    reject(new Error('OAuth flow closed before completion.'));
                }
            });
        });
    }
    /* ─── Helpers ─────────────────────────────────────────────────────── */
    openBrowser(url) {
        try {
            const parsed = new URL(url);
            if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
                console.error('⚠️ Refusing to open non-HTTP URL');
                return;
            }
        }
        catch {
            console.error('⚠️ Invalid URL — cannot open browser');
            return;
        }
        const onError = (err) => {
            if (err) {
                console.error('⚠️ Could not open browser automatically.');
                console.error(`   Please open this URL manually: ${url}`);
            }
        };
        const platform = process.platform;
        if (platform === 'win32') {
            // URL must be quoted — unquoted & is a cmd.exe command separator,
            // which would truncate the URL and lose the OAuth state parameter.
            const safeUrl = url.replace(/"/g, '');
            exec(`start "" "${safeUrl}"`, onError);
        }
        else if (platform === 'darwin') {
            execFile('open', [url], onError);
        }
        else {
            execFile('xdg-open', [url], onError);
        }
    }
}
export const authService = new AuthService();
//# sourceMappingURL=auth.service.js.map
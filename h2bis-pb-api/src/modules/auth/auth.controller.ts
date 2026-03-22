import { Request, Response } from 'express';
import { asyncHandler } from '../../core/middleware/error.middleware.js';
import { RegisterRequestDto, LoginRequestDto } from './auth.dto.js';
import { registerUserHandler } from './handlers/register-user.handler.js';
import { authenticateUserHandler } from './handlers/authenticate-user.handler.js';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from './services/jwt.service.js';
import { userRepository } from './repositories/user.repository.js';
import { refreshTokenRepository } from './repositories/refresh-token.repository.js';
import { UnauthorizedError, ValidationError } from '../../core/errors/app.error.js';
import { config } from '../../core/config/config.js';
import { accessRequestRepository } from './repositories/access-request.repository.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
    // Validate and parse DTO
    const dto = RegisterRequestDto.parse(req.body);

    // Execute Handler
    const result = await registerUserHandler.execute(dto);

    // Send response
    res.status(201).json(result);
});

/**
 * Authenticate a user (login)
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
    // Validate and parse DTO
    const dto = LoginRequestDto.parse(req.body);

    // Execute Handler
    const result = await authenticateUserHandler.execute(dto);

    // Return full result including refreshToken in body.
    // NextAuth authorize() runs server-side and needs the refresh token
    // in the response body (httpOnly cookies don't reach the browser
    // from server-to-server calls).
    res.status(200).json(result);
});

/**
 * GitHub OAuth callback
 * GET /api/auth/github/callback?code=...
 */
export const githubCallback = asyncHandler(async (req: Request, res: Response) => {
    const code = req.query.code as string;
    if (!code) {
        throw new ValidationError('Missing code parameter');
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;

    if (!clientId || !clientSecret || !redirectUri) {
        throw new ValidationError('GitHub OAuth is not configured. Set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_CALLBACK_URL.');
    }

    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: redirectUri,
        }),
    });

    if (!tokenRes.ok) {
        throw new Error('GitHub token exchange failed');
    }

    const tokenData: any = await tokenRes.json();
    const githubToken = tokenData.access_token;

    if (!githubToken) {
        throw new Error('GitHub token exchange returned no access token');
    }

    // Fetch GitHub user profile
    const profileRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/json' },
    });

    if (!profileRes.ok) {
        throw new Error('GitHub user fetch failed');
    }

    const profile: any = await profileRes.json();
    const githubId = String(profile.id || profile.node_id);
    const name = profile.name || profile.login || 'GitHub User';
    let email = profile.email;

    // Fetch verified email if not on the public profile
    if (!email) {
        const emailRes = await fetch('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/json' },
        });
        if (emailRes.ok) {
            const emails = await emailRes.json();
            if (Array.isArray(emails)) {
                const primary = emails.find((e: any) => e.verified && e.primary);
                const anyVerified = emails.find((e: any) => e.verified);
                email = (primary || anyVerified)?.email;
            }
        }
    }

    // Fallback: GitHub noreply address (every account has one)
    if (!email) {
        email = `${profile.id}+${profile.login}@users.noreply.github.com`;
    }

    // Normalize email
    email = String(email).toLowerCase();

    // Recover returnUrl from state parameter (set by /api/auth/github/authorize)
    let returnUrlFromState = '';
    const stateParam = String(req.query.state || '');
    if (stateParam) {
        try {
            const decoded = JSON.parse(Buffer.from(stateParam, 'base64url').toString('utf-8'));
            returnUrlFromState = decoded?.returnUrl || '';
        } catch { /* ignore malformed state */ }
    }

    const safeReturnUrl = returnUrlFromState && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(returnUrlFromState)
        ? returnUrlFromState
        : '';

    // Find existing user by GitHub ID or email
    let user = await userRepository.findByGithubId(githubId);
    if (!user) {
        user = await userRepository.findByEmail(email);
    }

    if (!user) {
        // User does not exist — create an access request instead of auto-creating
        const existingRequest = await accessRequestRepository.findPendingByEmail(email)
            || await accessRequestRepository.findPendingByGithubId(githubId);

        if (!existingRequest) {
            await accessRequestRepository.create({
                email,
                name,
                githubId,
                githubLogin: profile.login,
                avatarUrl: profile.avatar_url,
            });
        }

        if (safeReturnUrl) {
            const redirectUrl = new URL(safeReturnUrl);
            redirectUrl.searchParams.append('success', 'false');
            redirectUrl.searchParams.append('error', 'pending_approval');
            return res.redirect(redirectUrl.toString());
        }
        return res.status(403).json({
            success: false,
            message: 'Access request submitted. An admin must approve your account before you can sign in.',
        });
    }

    // Link GitHub identity if not yet linked
    if (!user.githubId) {
        user.githubId = githubId;
        await user.save();
    }

    if (!user.isActive) {
        if (safeReturnUrl) {
            const redirectUrl = new URL(safeReturnUrl);
            redirectUrl.searchParams.append('success', 'false');
            redirectUrl.searchParams.append('error', 'pending_approval');
            return res.redirect(redirectUrl.toString());
        }
        return res.status(403).json({ success: false, message: 'pending approval' });
    }

    // Issue JWT tokens
    const accessToken = generateAccessToken(user._id.toString(), user.email, user.role || ['user']);
    const refreshToken = generateRefreshToken(user._id.toString());
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await refreshTokenRepository.create(refreshToken, user._id.toString(), refreshExpiry);

    if (safeReturnUrl) {
        const redirectUrl = new URL(safeReturnUrl);
        redirectUrl.searchParams.append('success', 'true');
        redirectUrl.searchParams.append('accessToken', accessToken);
        redirectUrl.searchParams.append('refreshToken', refreshToken);
        return res.redirect(redirectUrl.toString());
    }

    res.status(200).json({
        success: true,
        user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            githubId: user.githubId,
        },
        accessToken,
        refreshToken,
    });
});

/**
 * Get GitHub OAuth authorize URL
 * GET /api/auth/github/authorize?returnUrl=<local-callback-url>
 */
export const githubAuthorize = asyncHandler(async (req: Request, res: Response) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;

    if (!clientId || !redirectUri) {
        throw new ValidationError('GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CALLBACK_URL.');
    }

    const returnUrl = String(req.query.returnUrl || '');

    // Encode returnUrl inside the OAuth `state` parameter.
    // GitHub preserves `state` exactly and returns it to the callback —
    // unlike query params appended to the authorize URL, which GitHub ignores.
    const statePayload = JSON.stringify({ returnUrl });
    const state = Buffer.from(statePayload).toString('base64url');

    const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
    authorizeUrl.searchParams.append('client_id', clientId);
    authorizeUrl.searchParams.append('redirect_uri', redirectUri);
    authorizeUrl.searchParams.append('scope', 'read:user user:email');
    authorizeUrl.searchParams.append('state', state);

    res.status(200).json({
        success: true,
        authorizeUrl: authorizeUrl.toString(),
    });
})

/**
 * Get current user profile (protected route)
 * GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    // User info is attached by authenticate middleware
    const user = (req as any).user;

    res.status(200).json({
        success: true,
        message: 'JWT verification successful',
        user: {
            userId: user.userId,
            email: user.email,
            roles: user.roles
        }
    });
});

/**
 * Refresh access token using refresh token
 * POST /api/auth/refresh
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    // Accept refresh token from body (NextAuth server calls) or cookie (fallback)
    const token = req.body.refreshToken || req.cookies?.refreshToken;

    if (!token) {
        throw new UnauthorizedError('No refresh token provided');
    }

    // Verify JWT signature and expiry
    let decoded: { userId: string };
    try {
        decoded = verifyRefreshToken(token);
    } catch {
        throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Validate token against database (must be active)
    const storedToken = await refreshTokenRepository.findActiveByToken(token, decoded.userId);

    if (!storedToken) {
        // Token not found as active — check if it was previously revoked (theft detection)
        const revokedToken = await refreshTokenRepository.findRevokedByToken(token, decoded.userId);
        if (revokedToken) {
            // A revoked token was reused! Revoke the entire family.
            console.warn(`SECURITY: Refresh token reuse detected for user ${decoded.userId}, family ${revokedToken.familyId}`);
            await refreshTokenRepository.revokeByFamily(revokedToken.familyId);
        }
        throw new UnauthorizedError('Invalid refresh token');
    }

    // Verify user still exists and is active
    const user = await userRepository.findById(decoded.userId);

    if (!user || !user.isActive) {
        await refreshTokenRepository.revokeByFamily(storedToken.familyId);
        throw new UnauthorizedError('User account is inactive');
    }

    // Generate new token pair (rotation)
    const newAccessToken = generateAccessToken(
        user._id.toString(),
        user.email,
        user.role || ['user']
    );
    const newRefreshToken = generateRefreshToken(user._id.toString());

    // Store the new refresh token in the same family
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await refreshTokenRepository.create(newRefreshToken, user._id.toString(), refreshExpiry, storedToken.familyId);

    // Revoke the old token
    await refreshTokenRepository.revokeToken(storedToken._id.toString());

    res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    });
});

/**
 * Logout user (revoke refresh token)
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
    const token = req.body.refreshToken;

    if (token) {
        try {
            const decoded = verifyRefreshToken(token);
            const storedToken = await refreshTokenRepository.findActiveByToken(token, decoded.userId);
            if (storedToken) {
                await refreshTokenRepository.revokeByFamily(storedToken.familyId);
            }
        } catch {
            // Token invalid or expired — nothing to revoke, proceed with logout
        }
    }

    // Clear any refresh token cookie (backward compatibility)
    res.clearCookie('refreshToken');

    res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// ==================== API Key Management ====================

import { apiKeyService } from './services/api-key.service.js';
import { CreateApiKeyRequestDto } from './auth.dto.js';

/**
 * Create a new API key
 * POST /api/auth/api-keys
 * Requires admin role
 */
export const createApiKey = asyncHandler(async (req: Request, res: Response) => {
    const dto = CreateApiKeyRequestDto.parse(req.body);
    const user = (req as any).user;

    // Calculate expiration date if provided
    let expiresAt: Date | undefined;
    if (dto.expiresInDays) {
        expiresAt = new Date(Date.now() + dto.expiresInDays * 24 * 60 * 60 * 1000);
    }

    const result = await apiKeyService.generateApiKey({
        userId: dto.userId,
        name: dto.name,
        scopes: dto.scopes,
        expiresAt,
        createdBy: user.userId,
        description: dto.description,
    });

    res.status(201).json({
        key: result.key,
        keyId: result.keyId,
        keyPrefix: result.keyPrefix,
        name: dto.name,
        scopes: dto.scopes,
        expiresAt: expiresAt?.toISOString() || null,
        message: '⚠️ IMPORTANT: This is the only time the full key will be shown. Store it securely!',
    });
});

/**
 * List all API keys (admin) or user's own keys
 * GET /api/auth/api-keys
 */
export const listApiKeys = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const isAdmin = user.roles?.includes('admin');
    const includeInactive = req.query.includeInactive === 'true';

    let keys;
    if (isAdmin) {
        keys = await apiKeyService.listAllKeys({ includeInactive });
    } else {
        keys = await apiKeyService.listUserKeys(user.userId);
    }

    const formattedKeys = keys.map((key: any) => ({
        id: key._id.toString(),
        keyPrefix: key.keyPrefix,
        name: key.name,
        scopes: key.scopes,
        userId: key.userId?.toString() || key.userId,
        userEmail: key.userId?.email,
        userName: key.userId?.name,
        expiresAt: key.expiresAt?.toISOString() || null,
        lastUsedAt: key.lastUsedAt?.toISOString() || null,
        isActive: key.isActive,
        createdAt: key.createdAt?.toISOString(),
        createdBy: key.createdBy?.email,
    }));

    res.status(200).json({
        keys: formattedKeys,
        total: formattedKeys.length,
    });
});

/**
 * Revoke an API key
 * POST /api/auth/api-keys/:id/revoke
 */
export const revokeApiKey = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = (req as any).user;
    const isAdmin = user.roles?.includes('admin');

    await apiKeyService.revokeKey(id, user.userId, isAdmin);

    res.status(200).json({
        success: true,
        message: 'API key revoked successfully',
    });
});

/**
 * Delete an API key permanently
 * DELETE /api/auth/api-keys/:id
 */
export const deleteApiKey = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = (req as any).user;
    const isAdmin = user.roles?.includes('admin');

    await apiKeyService.deleteKey(id, user.userId, isAdmin);

    res.status(200).json({
        success: true,
        message: 'API key deleted successfully',
    });
});

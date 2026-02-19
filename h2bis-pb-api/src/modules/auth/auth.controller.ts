import { Request, Response } from 'express';
import { asyncHandler } from '../../core/middleware/error.middleware.js';
import { RegisterRequestDto, LoginRequestDto } from './auth.dto.js';
import { registerUserHandler } from './handlers/register-user.handler.js';
import { authenticateUserHandler } from './handlers/authenticate-user.handler.js';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from './services/jwt.service.js';
import { userRepository } from './repositories/user.repository.js';
import { refreshTokenRepository } from './repositories/refresh-token.repository.js';
import { UnauthorizedError } from '../../core/errors/app.error.js';

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

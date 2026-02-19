import { Request, Response, NextFunction } from 'express';
import { apiKeyService } from '../../modules/auth/services/api-key.service.js';
import { verifyAccessToken } from '../../modules/auth/services/jwt.service.js';
import { UnauthorizedError, ForbiddenError } from '../errors/app.error.js';

/**
 * API Key Authentication Middleware
 * Validates X-API-Key header for machine-to-machine authentication
 */
export async function authenticateApiKey(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const apiKey = req.headers['x-api-key'] as string;

        if (!apiKey) {
            throw new UnauthorizedError('No API key provided');
        }

        const userInfo = await apiKeyService.validateApiKey(apiKey, {
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip || req.socket.remoteAddress,
        });

        if (!userInfo) {
            throw new UnauthorizedError('Invalid or expired API key');
        }

        // Attach user info to request (same format as JWT auth)
        (req as any).user = {
            userId: userInfo.userId,
            email: userInfo.email,
            roles: userInfo.roles,
        };

        // Also attach scopes and service account flag for fine-grained control
        (req as any).apiKeyScopes = userInfo.scopes;
        (req as any).isServiceAccount = true;

        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            next(error);
        } else {
            next(new UnauthorizedError('API key authentication failed'));
        }
    }
}

/**
 * Combined Authentication Middleware
 * Supports BOTH JWT Bearer tokens AND API keys
 * 
 * Priority:
 * 1. X-API-Key header (for agents/MCP)
 * 2. Authorization: Bearer <jwt> (for web app)
 * 
 * Use this on endpoints that need to support both human users and agents
 */
export async function authenticateAny(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const apiKey = req.headers['x-api-key'] as string;
    const authHeader = req.headers.authorization;

    // Check API key first (preferred for agents)
    if (apiKey) {
        return authenticateApiKey(req, res, next);
    }

    // Fall back to JWT Bearer token
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.substring(7); // Remove 'Bearer ' prefix
            const decoded = verifyAccessToken(token);

            // Attach user info to request
            (req as any).user = {
                userId: decoded.userId,
                email: decoded.email,
                roles: decoded.roles,
            };

            // Mark as NOT a service account
            (req as any).isServiceAccount = false;

            return next();
        } catch (error) {
            return next(new UnauthorizedError('Invalid or expired token'));
        }
    }

    // No authentication provided
    next(new UnauthorizedError('No authentication provided. Use X-API-Key or Authorization Bearer token.'));
}

/**
 * Scope-Based Authorization Middleware
 * Requires specific scope for API key access
 * 
 * Note: Only applies to service accounts (API keys).
 * JWT users are authorized via role-based permissions, not scopes.
 */
export function requireScope(scope: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        // Skip scope check for non-service accounts (JWT users)
        if (!(req as any).isServiceAccount) {
            return next();
        }

        const scopes: string[] = (req as any).apiKeyScopes || [];

        // Admin scope grants all access
        if (scopes.includes('admin')) {
            return next();
        }

        if (!scopes.includes(scope)) {
            return next(new ForbiddenError(`Insufficient scope: requires '${scope}'`));
        }

        next();
    };
}

/**
 * Middleware to require write scope for mutations
 * Convenience wrapper around requireScope
 */
export const requireWriteScope = requireScope('write');

/**
 * Middleware to require delete scope for deletions
 * Convenience wrapper around requireScope
 */
export const requireDeleteScope = requireScope('delete');

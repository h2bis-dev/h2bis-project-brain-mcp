import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../modules/auth/services/jwt.service.js';
import { apiKeyService } from '../../modules/auth/services/api-key.service.js';
import { UnauthorizedError } from '../errors/app.error.js';

/**
 * Unified Authentication Middleware
 *
 * Supports two authentication strategies detected automatically:
 *
 * 1. Agent / Machine-to-Machine (MCP):
 *    - Header: `X-API-Key: <api-key>`
 *    - Key is validated via bcrypt against the ApiKey collection.
 *    - On success, req.user is populated with the service-account's userId,
 *      email, roles, scopes, and isAgent = true.
 *
 * 2. Human / Web UI (JWT):
 *    - Header: `Authorization: Bearer <jwt-access-token>`
 *    - Token is verified with the standard JWT secret.
 *    - On success, req.user is populated with userId, email, roles.
 *
 * If neither credential is present or valid, an UnauthorizedError is passed
 * to the next error handler.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
    // --- Strategy 1: Agent API Key (X-API-Key header) ---
    const apiKey = req.headers['x-api-key'] as string | undefined;
    if (apiKey) {
        // bcrypt comparison is async – resolve with a plain Promise chain
        apiKeyService
            .validateApiKey(apiKey, {
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip,
            })
            .then((result) => {
                if (!result) {
                    return next(new UnauthorizedError('Invalid or revoked API key'));
                }

                (req as any).user = {
                    userId: result.userId,
                    email: result.email,
                    roles: result.roles,
                    scopes: result.scopes,
                    isAgent: true,
                };

                next();
            })
            .catch(() => next(new UnauthorizedError('API key validation failed')));

        return; // exit synchronously – next() will be called by the Promise
    }

    // --- Strategy 2: Human JWT (Authorization: Bearer <token>) ---
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided');
        }

        // Extract token (strip 'Bearer ' prefix)
        const token = authHeader.substring(7);

        const decoded = verifyAccessToken(token);

        // Attach user info to request (for permission checks)
        (req as any).user = {
            userId: decoded.userId,
            email: decoded.email,
            roles: decoded.roles,
        };

        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            next(error);
        } else {
            next(new UnauthorizedError('Invalid or expired token'));
        }
    }
}

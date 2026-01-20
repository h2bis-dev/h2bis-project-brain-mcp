import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../domain/services/jwt.service.js';
import { UnauthorizedError } from '../../shared/errors/app.error.js';

/**
 * JWT Authentication Middleware
 * Verifies the access token from the Authorization header
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided');
        }

        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyAccessToken(token);

        // Attach user info to request
        (req as any).user = decoded;

        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            next(error);
        } else {
            next(new UnauthorizedError('Invalid or expired token'));
        }
    }
}

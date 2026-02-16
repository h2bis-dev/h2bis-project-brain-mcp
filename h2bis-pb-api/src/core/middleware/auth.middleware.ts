import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../modules/auth/services/jwt.service.js';
import { UnauthorizedError } from '../errors/app.error.js';

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

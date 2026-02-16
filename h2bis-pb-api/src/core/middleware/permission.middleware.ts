import { Request, Response, NextFunction } from 'express';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../../modules/auth/services/authorization.service.js';
import { UnauthorizedError } from '../errors/app.error.js';

/**
 * Middleware to require a specific permission
 * Use this to protect endpoints that need a single permission
 */
export function requirePermission(permission: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user; // Attached by authenticate middleware

        if (!user || !user.roles) {
            return next(new UnauthorizedError('Authentication required'));
        }

        if (!hasPermission(user.roles, permission)) {
            return next(new UnauthorizedError(`Permission denied: ${permission}`));
        }

        next();
    };
}

/**
 * Middleware to require ANY of the specified permissions
 * User needs at least one of the permissions
 */
export function requireAnyPermission(permissions: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user || !user.roles) {
            return next(new UnauthorizedError('Authentication required'));
        }

        if (!hasAnyPermission(user.roles, permissions)) {
            return next(new UnauthorizedError(`Permission denied. Required one of: ${permissions.join(', ')}`));
        }

        next();
    };
}

/**
 * Middleware to require ALL of the specified permissions
 * User needs every permission in the list
 */
export function requireAllPermissions(permissions: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user || !user.roles) {
            return next(new UnauthorizedError('Authentication required'));
        }

        if (!hasAllPermissions(user.roles, permissions)) {
            return next(new UnauthorizedError(`Permission denied. Required all of: ${permissions.join(', ')}`));
        }

        next();
    };
}

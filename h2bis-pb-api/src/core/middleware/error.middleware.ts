import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app.error.js';
import { z } from 'zod';

/**
 * Global error handling middleware
 * Must be registered LAST in the middleware chain
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Safe error logging
    try {
        console.error('❌ Error caught by global handler:', {
            message: err.message,
            stack: err.stack,
            name: err.name,
            // Only log non-circular properties if possible, or just the basics
        });
    } catch (loggingError) {
        console.error('❌ Error logging failed:', loggingError);
        console.error('Original error message:', err.message);
    }

    // Handle AppError instances (our custom errors)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    // Handle Zod validation errors
    if (err instanceof z.ZodError) {
        return res.status(400).json({
            success: false,
            error: 'Validation error',
            details: err.errors.map(e => ({
                path: e.path.join('.'),
                message: e.message,
                received: e.code === 'invalid_type' ? (e as any).received : undefined
            })),
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    // Handle unexpected errors
    console.error('Unexpected error:', err);
    return res.status(500).json({
        success: false,
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
            message: err.message,
            stack: err.stack
        })
    });
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

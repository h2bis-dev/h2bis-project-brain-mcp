import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { RegisterRequestDto, LoginRequestDto } from '../dtos/auth.dto.js';
import { registerUserHandler } from '../../application/handlers/auth/register-user.handler.js';
import { authenticateUserHandler } from '../../application/handlers/auth/authenticate-user.handler.js';

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

    // Send response
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

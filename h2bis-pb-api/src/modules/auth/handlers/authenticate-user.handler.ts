import { userRepository } from '../repositories/user.repository.js';
import { refreshTokenRepository } from '../repositories/refresh-token.repository.js';
import { verifyPassword } from '../services/password.service.js';
import { generateAccessToken, generateRefreshToken } from '../services/jwt.service.js';
import { getUserPermissions } from '../services/authorization.service.js';
import { UnauthorizedError } from '../../../core/errors/app.error.js';
import type { LoginRequestDto, LoginResponseDto } from '../auth.dto.js';

/**
 * Authenticate User Use Case
 * Handles the business logic for user authentication
 */
export class AuthenticateUserHandler {
    async execute(dto: LoginRequestDto): Promise<LoginResponseDto> {
        // Find user by email
        const user = await userRepository.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // Verify password
        const isValid = await verifyPassword(dto.password, user.passwordHash || '');

        if (!isValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // Check if account is active (pending approval logic)
        if (!user.isActive) {
            throw new UnauthorizedError('Account pending approval');
        }

        // Compute permissions based on user's roles
        const permissions = getUserPermissions(user.role || ['user']);

        // Generate JWT tokens
        const accessToken = generateAccessToken(
            user._id.toString(),
            user.email,
            user.role || ['user']
        );
        const refreshToken = generateRefreshToken(user._id.toString());

        // Store refresh token in database (creates a new token family)
        const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await refreshTokenRepository.create(refreshToken, user._id.toString(), refreshExpiry);

        // Return session data with tokens and permissions
        return {
            id: user._id.toString(),
            email: user.email,
            role: user.role || ['user'],
            permissions,
            isActive: user.isActive,
            accessToken,
            refreshToken
        };
    }
}

// Export singleton instance
export const authenticateUserHandler = new AuthenticateUserHandler();

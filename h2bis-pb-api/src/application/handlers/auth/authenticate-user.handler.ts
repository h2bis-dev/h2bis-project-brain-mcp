import { userRepository } from '../../../infrastructure/database/repositories/user.repository.js';
import { verifyPassword } from '../../../domain/services/password.service.js';
import { UnauthorizedError } from '../../../shared/errors/app.error.js';
import type { LoginRequestDto, LoginResponseDto } from '../../../api/dtos/auth.dto.js';

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
        const isValid = await verifyPassword(dto.password, user.passwordHash);

        if (!isValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // Check if account is active
        if (!user.isActive) {
            throw new UnauthorizedError('Account is inactive');
        }

        // Return session data
        return {
            id: user._id.toString(),
            email: user.email,
            role: user.role || ['user'],
            isActive: user.isActive
        };
    }
}

// Export singleton instance
export const authenticateUserHandler = new AuthenticateUserHandler();

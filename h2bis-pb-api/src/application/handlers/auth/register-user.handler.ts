import { userRepository } from '../../../infrastructure/database/repositories/user.repository.js';
import { hashPassword } from '../../../domain/services/password.service.js';
import type { RegisterRequestDto, RegisterResponseDto } from '../../../api/dtos/auth.dto.js';

/**
 * Register User Handler
 * Handles the business logic for user registration
 */
export class RegisterUserHandler {
    async execute(dto: RegisterRequestDto): Promise<RegisterResponseDto> {
        // Hash the password
        const passwordHash = await hashPassword(dto.password);

        // Create the user via repository
        const user = await userRepository.create({
            email: dto.email,
            passwordHash: passwordHash,
            name: dto.name,
            role: dto.role,
            isActive: true
        });

        // Return response DTO
        return {
            id: user._id.toString(),
            email: user.email,
            role: user.role
        };
    }
}

// Export singleton instance
export const registerUserHandler = new RegisterUserHandler();

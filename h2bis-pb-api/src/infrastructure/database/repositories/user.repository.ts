import { User } from '../../../domain/models/user_model.js';
import { ConflictError, NotFoundError } from '../../../shared/errors/app.error.js';

/**
 * User Repository
 * Handles all database operations for User entities
 */
export class UserRepository {
    /**
     * Find a user by email
     */
    async findByEmail(email: string) {
        const user = await User.findOne({ email: email.toLowerCase() });
        return user;
    }

    /**
     * Find a user by ID
     */
    async findById(id: string) {
        const user = await User.findById(id);
        return user;
    }

    /**
     * Create a new user
     */
    async create(userData: {
        email: string;
        passwordHash: string;
        name: string;
        role?: string[];
        isActive?: boolean;
    }) {
        // Check if user already exists
        const existing = await this.findByEmail(userData.email);
        if (existing) {
            throw new ConflictError('User with this email already exists');
        }

        // Create user
        const user = await User.create({
            email: userData.email.toLowerCase(),
            passwordHash: userData.passwordHash,
            name: userData.name,
            role: (userData.role || ['user']) as ("user" | "admin")[],
            isActive: userData.isActive ?? true
        });

        return user;
    }

    /**
     * Update user password
     */
    async updatePassword(userId: string, passwordHash: string): Promise<void> {
        const result = await User.updateOne(
            { _id: userId },
            { $set: { passwordHash } }
        );

        if (result.matchedCount === 0) {
            throw new NotFoundError('User not found');
        }
    }

    /**
     * Update user active status
     */
    async updateActiveStatus(userId: string, isActive: boolean): Promise<void> {
        const result = await User.updateOne(
            { _id: userId },
            { $set: { isActive } }
        );

        if (result.matchedCount === 0) {
            throw new NotFoundError('User not found');
        }
    }
}

// Export singleton instance
export const userRepository = new UserRepository();

import { User } from '../../../core/models/user_model.js';
import { ConflictError, NotFoundError } from '../../../core/errors/app.error.js';

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

    async findByGithubId(githubId: string) {
        return await User.findOne({ githubId });
    }

    async findAll(filter: { isActive?: boolean } = {}) {
        return await User.find(filter).sort({ createdAt: -1 }).select('-passwordHash');
    }

    async findPending() {
        return await User.find({ isActive: false }).sort({ createdAt: -1 }).select('-passwordHash');
    }

    async create(userData: {
        email: string;
        passwordHash?: string;
        name: string;
        role: string[];
        isActive?: boolean;
        githubId?: string;
    }) {
        // Check if user already exists by email or github
        const existingByEmail = await this.findByEmail(userData.email);
        if (existingByEmail) {
            throw new ConflictError('User with this email already exists');
        }

        if (userData.githubId) {
            const existingByGithub = await this.findByGithubId(userData.githubId);
            if (existingByGithub) {
                throw new ConflictError('User with this GitHub account already exists');
            }
        }

        // Create user
        const user = await User.create({
            email: userData.email.toLowerCase(),
            passwordHash: userData.passwordHash || '',
            githubId: userData.githubId || undefined,
            name: userData.name,
            role: userData.role as ("user" | "admin" | "agent")[],
            isActive: userData.isActive ?? false
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

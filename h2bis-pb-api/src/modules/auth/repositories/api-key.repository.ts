import { ApiKey } from '../../../core/models/api_key_model.js';
import { NotFoundError } from '../../../core/errors/app.error.js';

/**
 * API Key Repository
 * Handles all database operations for API Key entities
 */
export class ApiKeyRepository {
    /**
     * Create a new API key
     */
    async create(keyData: {
        keyPrefix: string;
        keyHash: string;
        name: string;
        userId: string;
        scopes: string[];
        expiresAt?: Date;
        createdBy: string;
        metadata?: {
            description?: string;
        };
    }) {
        const apiKey = await ApiKey.create({
            keyPrefix: keyData.keyPrefix,
            keyHash: keyData.keyHash,
            name: keyData.name,
            userId: keyData.userId,
            scopes: keyData.scopes,
            expiresAt: keyData.expiresAt || null,
            createdBy: keyData.createdBy,
            metadata: keyData.metadata || {},
            isActive: true,
        });

        return apiKey;
    }

    /**
     * Find an active API key by its prefix
     * Used during validation to find potential matching keys
     */
    async findActiveByPrefix(keyPrefix: string) {
        const apiKey = await ApiKey.findOne({
            keyPrefix,
            isActive: true,
            $or: [
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        });

        return apiKey;
    }

    /**
     * Find API key by ID
     */
    async findById(id: string) {
        const apiKey = await ApiKey.findById(id);
        return apiKey;
    }

    /**
     * Find all API keys for a user
     */
    async findByUserId(userId: string) {
        const apiKeys = await ApiKey.find({ userId })
            .select('-keyHash') // Never return the hash
            .sort({ createdAt: -1 });
        return apiKeys;
    }

    /**
     * Find all API keys (admin view)
     */
    async findAll(options: { includeInactive?: boolean } = {}) {
        const filter = options.includeInactive ? {} : { isActive: true };
        
        const apiKeys = await ApiKey.find(filter)
            .select('-keyHash')
            .populate('userId', 'email name role')
            .populate('createdBy', 'email name')
            .sort({ createdAt: -1 });
        
        return apiKeys;
    }

    /**
     * Update last used timestamp and metadata
     */
    async updateLastUsed(id: string, metadata?: { userAgent?: string; ipAddress?: string }) {
        const update: any = { lastUsedAt: new Date() };
        
        if (metadata?.userAgent) {
            update['metadata.userAgent'] = metadata.userAgent;
        }
        if (metadata?.ipAddress) {
            update['metadata.lastIpAddress'] = metadata.ipAddress;
        }

        await ApiKey.updateOne({ _id: id }, { $set: update });
    }

    /**
     * Revoke (deactivate) an API key
     */
    async revoke(id: string): Promise<void> {
        const result = await ApiKey.updateOne(
            { _id: id },
            { $set: { isActive: false } }
        );

        if (result.matchedCount === 0) {
            throw new NotFoundError('API key not found');
        }
    }

    /**
     * Delete an API key permanently
     */
    async delete(id: string): Promise<void> {
        const result = await ApiKey.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            throw new NotFoundError('API key not found');
        }
    }

    /**
     * Revoke all keys for a user (when user is deactivated)
     */
    async revokeAllForUser(userId: string): Promise<number> {
        const result = await ApiKey.updateMany(
            { userId, isActive: true },
            { $set: { isActive: false } }
        );

        return result.modifiedCount;
    }
}

// Export singleton instance
export const apiKeyRepository = new ApiKeyRepository();

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { apiKeyRepository } from '../repositories/api-key.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { NotFoundError, UnauthorizedError } from '../../../core/errors/app.error.js';

// Constants for API key generation
const API_KEY_PREFIX = 'h2b_agent_';
const KEY_LENGTH = 32; // 32 bytes = 256 bits of entropy
const SALT_ROUNDS = 12;

/**
 * API Key Service
 * Handles generation, validation, and management of API keys
 */
export class ApiKeyService {
    /**
     * Generate a new API key
     * Returns the plaintext key (shown once to user) and creates the hashed record
     */
    async generateApiKey(params: {
        userId: string;
        name: string;
        scopes: string[];
        expiresAt?: Date;
        createdBy: string;
        description?: string;
    }): Promise<{ key: string; keyId: string; keyPrefix: string }> {
        // Verify the target user exists
        const user = await userRepository.findById(params.userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Generate cryptographically secure random key
        const randomPart = crypto.randomBytes(KEY_LENGTH).toString('base64url');
        const fullKey = `${API_KEY_PREFIX}${randomPart}`;
        const keyPrefix = fullKey.substring(0, 12); // "h2b_agent_xx"

        // Hash the key for storage (never store plaintext)
        const keyHash = await bcrypt.hash(fullKey, SALT_ROUNDS);

        // Create the key record
        const keyDoc = await apiKeyRepository.create({
            keyPrefix,
            keyHash,
            name: params.name,
            userId: params.userId,
            scopes: params.scopes,
            expiresAt: params.expiresAt,
            createdBy: params.createdBy,
            metadata: {
                description: params.description,
            },
        });

        // Return the plaintext key (will only be shown once)
        return {
            key: fullKey,
            keyId: keyDoc._id.toString(),
            keyPrefix,
        };
    }

    /**
     * Validate an API key and return user info if valid
     * Returns null if invalid
     */
    async validateApiKey(
        apiKey: string,
        metadata?: { userAgent?: string; ipAddress?: string }
    ): Promise<{
        userId: string;
        email: string;
        roles: string[];
        scopes: string[];
        isServiceAccount: boolean;
    } | null> {
        // Quick validation of key format
        if (!apiKey || !apiKey.startsWith(API_KEY_PREFIX)) {
            return null;
        }

        const keyPrefix = apiKey.substring(0, 12);

        // Find potential matching key by prefix
        const keyDoc = await apiKeyRepository.findActiveByPrefix(keyPrefix);

        if (!keyDoc) {
            return null;
        }

        // Verify full key hash
        const isValid = await bcrypt.compare(apiKey, keyDoc.keyHash);

        if (!isValid) {
            return null;
        }

        // Get associated user
        const user = await userRepository.findById(keyDoc.userId.toString());

        if (!user || !user.isActive) {
            return null;
        }

        // Update last used timestamp and metadata (async, don't wait)
        apiKeyRepository.updateLastUsed(keyDoc._id.toString(), metadata).catch(err => {
            console.error('Failed to update API key last used:', err);
        });

        // Return user info in same format as JWT auth
        return {
            userId: user._id.toString(),
            email: user.email,
            roles: user.role,
            scopes: keyDoc.scopes,
            isServiceAccount: true,
        };
    }

    /**
     * List all API keys for a user
     */
    async listUserKeys(userId: string) {
        return apiKeyRepository.findByUserId(userId);
    }

    /**
     * List all API keys (admin only)
     */
    async listAllKeys(options?: { includeInactive?: boolean }) {
        return apiKeyRepository.findAll(options);
    }

    /**
     * Revoke an API key
     */
    async revokeKey(keyId: string, requestingUserId: string, isAdmin: boolean): Promise<void> {
        const key = await apiKeyRepository.findById(keyId);
        
        if (!key) {
            throw new NotFoundError('API key not found');
        }

        // Only owner or admin can revoke
        if (!isAdmin && key.userId.toString() !== requestingUserId) {
            throw new UnauthorizedError('Not authorized to revoke this key');
        }

        await apiKeyRepository.revoke(keyId);
    }

    /**
     * Delete an API key permanently
     */
    async deleteKey(keyId: string, requestingUserId: string, isAdmin: boolean): Promise<void> {
        const key = await apiKeyRepository.findById(keyId);
        
        if (!key) {
            throw new NotFoundError('API key not found');
        }

        // Only owner or admin can delete
        if (!isAdmin && key.userId.toString() !== requestingUserId) {
            throw new UnauthorizedError('Not authorized to delete this key');
        }

        await apiKeyRepository.delete(keyId);
    }

    /**
     * Revoke all keys for a user (called when user is deactivated)
     */
    async revokeAllUserKeys(userId: string): Promise<number> {
        return apiKeyRepository.revokeAllForUser(userId);
    }
}

// Export singleton instance
export const apiKeyService = new ApiKeyService();

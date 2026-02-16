import crypto from 'crypto';
import { RefreshToken } from '../../../core/models/refresh_token_model.js';
import { hashPassword, verifyPassword } from '../services/password.service.js';

/**
 * Refresh Token Repository
 * Handles database operations for refresh token persistence, rotation, and revocation.
 */
export class RefreshTokenRepository {
    /**
     * Create and store a new refresh token record.
     * Returns the familyId (new for login, reused for rotation).
     */
    async create(rawToken: string, userId: string, expiresAt: Date, familyId?: string): Promise<string> {
        const tokenHash = await hashPassword(rawToken);
        const family = familyId || crypto.randomUUID();

        await RefreshToken.create({
            tokenHash,
            userId,
            familyId: family,
            expiresAt,
        });

        return family;
    }

    /**
     * Find an active (non-revoked, non-expired) token record matching the raw token.
     * Uses bcrypt comparison since tokens are stored as salted hashes.
     */
    async findActiveByToken(rawToken: string, userId: string) {
        const candidates = await RefreshToken.find({
            userId,
            revokedAt: null,
            expiresAt: { $gt: new Date() },
        });

        for (const candidate of candidates) {
            const matches = await verifyPassword(rawToken, candidate.tokenHash);
            if (matches) {
                return candidate;
            }
        }
        return null;
    }

    /**
     * Find a revoked token matching the raw token (for theft detection).
     * If a revoked token is reused, the entire family should be revoked.
     */
    async findRevokedByToken(rawToken: string, userId: string) {
        const candidates = await RefreshToken.find({
            userId,
            revokedAt: { $ne: null },
        });

        for (const candidate of candidates) {
            const matches = await verifyPassword(rawToken, candidate.tokenHash);
            if (matches) {
                return candidate;
            }
        }
        return null;
    }

    /**
     * Revoke a specific token and optionally record what replaced it.
     */
    async revokeToken(tokenId: string, replacedByHash?: string): Promise<void> {
        await RefreshToken.updateOne(
            { _id: tokenId },
            { $set: { revokedAt: new Date(), replacedByHash: replacedByHash || null } }
        );
    }

    /**
     * Revoke all active tokens in a family (theft detected).
     */
    async revokeByFamily(familyId: string): Promise<void> {
        await RefreshToken.updateMany(
            { familyId, revokedAt: null },
            { $set: { revokedAt: new Date() } }
        );
    }

    /**
     * Revoke all tokens for a user (logout-all or password change).
     */
    async revokeAllForUser(userId: string): Promise<void> {
        await RefreshToken.updateMany(
            { userId, revokedAt: null },
            { $set: { revokedAt: new Date() } }
        );
    }
}

export const refreshTokenRepository = new RefreshTokenRepository();

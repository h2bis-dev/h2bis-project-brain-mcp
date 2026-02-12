import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema(
    {
        tokenHash: { type: String, required: true, index: true },
        userId: { type: String, required: true, index: true },
        familyId: { type: String, required: true, index: true },
        expiresAt: { type: Date, required: true },
        revokedAt: { type: Date, default: null },
        replacedByHash: { type: String, default: null },
    },
    { timestamps: true }
);

// TTL index: automatically remove expired tokens after 1 day
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

export const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

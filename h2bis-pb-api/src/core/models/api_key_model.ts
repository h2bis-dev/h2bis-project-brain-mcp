import mongoose from "mongoose";

/**
 * API Key Schema
 * Stores hashed API keys for machine-to-machine authentication
 */
const ApiKeySchema = new mongoose.Schema(
    {
        // First 12 chars for identification (e.g., "h2b_agent_xx")
        keyPrefix: { type: String, required: true, index: true },
        
        // bcrypt hash of the full key (never store plaintext)
        keyHash: { type: String, required: true },
        
        // Human-readable name (e.g., "Claude Desktop - Work PC")
        name: { type: String, required: true },
        
        // Link to service account user
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        
        // Scopes define what operations the key can perform
        scopes: { 
            type: [String], 
            enum: ['read', 'write', 'delete', 'admin'],
            default: ['read'] 
        },
        
        // Optional expiration date
        expiresAt: { type: Date, default: null },
        
        // Track last usage for monitoring
        lastUsedAt: { type: Date, default: null },
        
        // Active status for quick revocation
        isActive: { type: Boolean, default: true },
        
        // Who created this key (for audit)
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        
        // Additional metadata for debugging/auditing
        metadata: {
            userAgent: { type: String, default: null },
            lastIpAddress: { type: String, default: null },
            description: { type: String, default: null },
        },
    },
    { timestamps: true }
);

// Compound index for efficient lookups
ApiKeySchema.index({ keyPrefix: 1, isActive: 1 });

// TTL index: automatically remove expired keys after 30 days
ApiKeySchema.index(
    { expiresAt: 1 }, 
    { 
        expireAfterSeconds: 2592000, // 30 days
        partialFilterExpression: { expiresAt: { $ne: null } }
    }
);

export const ApiKey = mongoose.model("ApiKey", ApiKeySchema);

# Agent Authentication & Authorization Proposal

**Version**: 1.0  
**Date**: 2026-02-17  
**Pattern**: Machine-to-Machine (M2M) Authentication for MCP Agents

═══════════════════════════════════════════════════════════════════

## Executive Summary

This document outlines industry-standard approaches for securing MCP agent access to your API. The goal is to allow AI agents to authenticate and operate within the same RBAC system as human users, while maintaining security, auditability, and proper access control.

═══════════════════════════════════════════════════════════════════

## Current Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        HUMAN USERS                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │  h2bis-web  │───▶│  h2bis-api  │───▶│     MongoDB         │ │
│  │  (NextAuth) │    │  (Express)  │    │   (use_case_db)     │ │
│  └─────────────┘    └─────────────┘    └─────────────────────┘ │
│        │                  │                                      │
│   Email/Password    JWT + RBAC                                  │
│   → JWT tokens      Middleware                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         AI AGENTS                                │
│  ┌─────────────┐    ┌─────────────┐                             │
│  │   Claude    │───▶│  h2bis-mcp  │───▶  ??? API Access ???     │
│  │   Desktop   │    │  (stdio)    │                             │
│  └─────────────┘    └─────────────┘                             │
│                          │                                       │
│                    Needs secure auth                             │
└─────────────────────────────────────────────────────────────────┘
```

═══════════════════════════════════════════════════════════════════

## Industry Standard Options

### Option 1: Service Account with Long-Lived API Keys (Recommended for Simplicity)

**Pattern**: Pre-shared secret with dedicated service accounts

**How it works**:
1. Create dedicated "agent users" in your database with specific roles
2. Generate long-lived API keys (not JWT) for these accounts
3. MCP uses API key to authenticate requests
4. API validates key and enforces RBAC based on service account role

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Agent     │  API    │  h2bis-api  │  RBAC   │  MongoDB    │
│   (MCP)     │  Key    │             │  Check  │             │
└─────────────┘         └─────────────┘         └─────────────┘
       │                       │                       │
       │  X-API-Key: abc123    │                       │
       │──────────────────────▶│                       │
       │                       │ Validate key          │
       │                       │ Get service account   │
       │                       │ Check permissions     │
       │                       │──────────────────────▶│
       │                       │◀──────────────────────│
       │◀──────────────────────│                       │
```

**Pros**:
- Simple to implement
- No token refresh needed
- Easy to revoke (delete key from database)
- Clear audit trail (each agent has unique key)

**Cons**:
- Less secure than short-lived tokens (key exposure = longer window)
- No automatic expiration

**Industry Examples**: GitHub Personal Access Tokens, Stripe API Keys, OpenAI API Keys

---

### Option 2: OAuth 2.0 Client Credentials Flow (Industry Standard for M2M)

**Pattern**: RFC 6749 Client Credentials Grant

**How it works**:
1. Register MCP as an OAuth client with client_id and client_secret
2. MCP exchanges credentials for short-lived access token
3. MCP uses access token for API requests
4. Token includes scope/role information
5. MCP auto-refreshes token when expired

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Agent     │ OAuth   │  h2bis-api  │  RBAC   │  MongoDB    │
│   (MCP)     │ Flow    │ /auth       │  Check  │             │
└─────────────┘         └─────────────┘         └─────────────┘
       │                       │                       │
       │ POST /auth/token      │                       │
       │ grant_type=client_credentials                 │
       │ client_id=mcp-agent   │                       │
       │ client_secret=xxxxx   │                       │
       │──────────────────────▶│                       │
       │                       │ Validate credentials  │
       │ { access_token,       │ Generate JWT          │
       │   expires_in: 3600,   │                       │
       │   scope: "agent:rw" } │                       │
       │◀──────────────────────│                       │
       │                       │                       │
       │ GET /api/use-cases    │                       │
       │ Authorization: Bearer │                       │
       │──────────────────────▶│                       │
       │                       │ Verify JWT            │
       │                       │ Check RBAC            │
       │                       │──────────────────────▶│
```

**Pros**:
- Industry standard (well-documented)
- Short-lived tokens (reduced exposure window)
- Scoped access (can specify exact permissions)
- Supports token rotation

**Cons**:
- More complex to implement
- Requires token refresh logic
- Slight overhead for auth requests

**Industry Examples**: Auth0, AWS IAM, Google Cloud Service Accounts

---

### Option 3: JWT Service Tokens with Refresh (Hybrid Approach)

**Pattern**: Modified current JWT flow for service accounts

**How it works**:
1. Create service account users with "agent" role
2. Login once to get access + refresh tokens
3. Store refresh token securely
4. Auto-refresh access token when expired
5. Same RBAC middleware validates permissions

**This is essentially your current flow but formalized for agents.**

═══════════════════════════════════════════════════════════════════

## Recommended Implementation: API Key + Service Accounts

Based on your architecture, I recommend **Option 1 (API Keys)** with enhancements:

### Why API Keys for Your Use Case

1. **Simplicity**: Your MCP already supports env-based auth
2. **No Token Management**: No refresh logic needed
3. **Clear Audit Trail**: Each agent/IDE instance gets unique key
4. **Easy Revocation**: Delete key from DB to revoke access
5. **Same RBAC**: Works with your existing permission middleware

### Security Enhancements

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENHANCED SECURITY MODEL                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. API Keys are HASHED in database (like passwords)            │
│  2. Keys have PREFIX for identification (e.g., h2b_agent_xxx)   │
│  3. Keys can have EXPIRATION dates                              │
│  4. Keys tied to SERVICE ACCOUNTS with specific ROLES           │
│  5. All agent requests LOGGED for audit                         │
│  6. Rate limiting per API key                                   │
│  7. IP allowlisting (optional)                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

═══════════════════════════════════════════════════════════════════

## Implementation Plan

### Phase 1: Database Schema Updates

```typescript
// New collection: api_keys
interface ApiKey {
  _id: ObjectId;
  keyPrefix: string;        // First 8 chars for identification
  keyHash: string;          // bcrypt hash of full key
  name: string;             // "Claude Desktop - Work PC"
  userId: ObjectId;         // Link to service account user
  permissions: string[];    // Override permissions (optional)
  scopes: string[];         // Allowed operations ["read", "write", "delete"]
  expiresAt?: Date;         // Optional expiration
  lastUsedAt?: Date;        // Track usage
  createdAt: Date;
  createdBy: ObjectId;      // Admin who created the key
  isActive: boolean;
  metadata: {
    userAgent?: string;     // Track which IDE/agent
    ipAddress?: string;     // First seen IP
  };
}

// Service account user (existing users collection)
interface ServiceAccountUser {
  _id: ObjectId;
  email: string;            // "mcp-agent@h2bis.local"
  name: string;             // "MCP Agent - Development"
  role: string;             // "agent" or specific role
  isServiceAccount: true;   // Flag to identify service accounts
  isActive: boolean;
}
```

### Phase 2: API Changes

```typescript
// New endpoint: POST /api/auth/api-keys (admin only)
// Creates a new API key for a service account

// New middleware: apiKeyAuth.middleware.ts
// Validates X-API-Key header for agent requests

// Updated routes: Support both JWT Bearer AND API Key auth
// Example: GET /api/use-cases
//   - If Authorization: Bearer <jwt> → existing JWT flow
//   - If X-API-Key: <key> → new API key flow
```

### Phase 3: MCP Configuration

```bash
# .env for MCP
API_BASE_URL=http://localhost:4000
API_KEY=h2b_agent_xxxxxxxxxxxxxxxxxxxxx  # Generated via admin panel
```

═══════════════════════════════════════════════════════════════════

## Detailed Implementation

### 1. API Key Schema (api/src/core/schemas/api-key.schema.ts)

```typescript
import { z } from 'zod';

export const ApiKeySchema = z.object({
  keyPrefix: z.string().length(8),
  keyHash: z.string(),
  name: z.string().min(3).max(100),
  userId: z.string(),
  scopes: z.array(z.enum(['read', 'write', 'delete', 'admin'])),
  permissions: z.array(z.string()).optional(),
  expiresAt: z.date().optional(),
  isActive: z.boolean().default(true),
});

export type ApiKeyDocument = z.infer<typeof ApiKeySchema>;
```

### 2. API Key Service (api/src/modules/auth/services/api-key.service.ts)

```typescript
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

const API_KEY_PREFIX = 'h2b_agent_';
const KEY_LENGTH = 32;

export class ApiKeyService {
  /**
   * Generate a new API key
   * Returns: { key: 'h2b_agent_xxx...', keyPrefix: 'h2b_agen' }
   */
  async generateApiKey(
    userId: string,
    name: string,
    scopes: string[],
    expiresAt?: Date
  ): Promise<{ key: string; keyDoc: any }> {
    // Generate cryptographically secure random key
    const randomPart = crypto.randomBytes(KEY_LENGTH).toString('base64url');
    const fullKey = `${API_KEY_PREFIX}${randomPart}`;
    const keyPrefix = fullKey.substring(0, 12);
    
    // Hash the key for storage
    const keyHash = await bcrypt.hash(fullKey, 12);
    
    const keyDoc = {
      _id: new ObjectId(),
      keyPrefix,
      keyHash,
      name,
      userId: new ObjectId(userId),
      scopes,
      expiresAt,
      lastUsedAt: null,
      createdAt: new Date(),
      isActive: true,
      metadata: {},
    };
    
    return { key: fullKey, keyDoc };
  }
  
  /**
   * Validate an API key
   * Returns user info if valid, null if invalid
   */
  async validateApiKey(apiKey: string): Promise<any | null> {
    if (!apiKey.startsWith(API_KEY_PREFIX)) {
      return null;
    }
    
    const keyPrefix = apiKey.substring(0, 12);
    
    // Find potential matching keys by prefix
    const keyDoc = await this.apiKeyRepository.findByPrefix(keyPrefix);
    
    if (!keyDoc || !keyDoc.isActive) {
      return null;
    }
    
    // Check expiration
    if (keyDoc.expiresAt && keyDoc.expiresAt < new Date()) {
      return null;
    }
    
    // Verify full key hash
    const isValid = await bcrypt.compare(apiKey, keyDoc.keyHash);
    
    if (!isValid) {
      return null;
    }
    
    // Update last used timestamp
    await this.apiKeyRepository.updateLastUsed(keyDoc._id);
    
    // Get associated service account
    const user = await this.userRepository.findById(keyDoc.userId);
    
    return {
      userId: user._id.toString(),
      email: user.email,
      roles: [user.role],
      scopes: keyDoc.scopes,
      isServiceAccount: true,
    };
  }
}
```

### 3. API Key Authentication Middleware (api/src/core/middleware/api-key.middleware.ts)

```typescript
import { Request, Response, NextFunction } from 'express';
import { apiKeyService } from '../../modules/auth/services/api-key.service.js';
import { UnauthorizedError } from '../errors/app.error.js';

/**
 * API Key Authentication Middleware
 * Supports X-API-Key header for service account authentication
 */
export async function authenticateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      throw new UnauthorizedError('No API key provided');
    }
    
    const userInfo = await apiKeyService.validateApiKey(apiKey);
    
    if (!userInfo) {
      throw new UnauthorizedError('Invalid or expired API key');
    }
    
    // Attach user info to request (same format as JWT auth)
    (req as any).user = {
      userId: userInfo.userId,
      email: userInfo.email,
      roles: userInfo.roles,
    };
    
    // Also attach scopes for scope-based authorization
    (req as any).apiKeyScopes = userInfo.scopes;
    (req as any).isServiceAccount = true;
    
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError('API key authentication failed'));
    }
  }
}

/**
 * Combined Authentication Middleware
 * Supports both JWT Bearer tokens AND API keys
 */
export async function authenticateAny(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;
  
  // Prefer API key if provided
  if (apiKey) {
    return authenticateApiKey(req, res, next);
  }
  
  // Fall back to JWT Bearer token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Use existing JWT middleware
    return authenticate(req, res, next);
  }
  
  next(new UnauthorizedError('No authentication provided'));
}
```

### 4. Add Scope-Based Authorization (api/src/core/middleware/scope.middleware.ts)

```typescript
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/app.error.js';

/**
 * Require specific scope for API key access
 * Used in conjunction with authenticateApiKey middleware
 */
export function requireScope(scope: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip scope check for non-service accounts (JWT users)
    if (!(req as any).isServiceAccount) {
      return next();
    }
    
    const scopes: string[] = (req as any).apiKeyScopes || [];
    
    // Admin scope grants all access
    if (scopes.includes('admin')) {
      return next();
    }
    
    if (!scopes.includes(scope)) {
      return next(new ForbiddenError(`Insufficient scope: requires '${scope}'`));
    }
    
    next();
  };
}
```

### 5. Update MCP HTTP Client (mcp/src/core/infrastructure/http-client.ts)

```typescript
// Add API key support to existing HTTP client

export class HttpClient {
  private apiKey?: string;
  
  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { 'X-API-Key': config.apiKey } : {}),
      ...config.headers,
    };
    this.timeout = config.timeout || 30000;
  }
  
  // ... rest of implementation
}
```

### 6. Update MCP API Service (mcp/src/core/services/api.service.ts)

```typescript
class ApiService {
  private httpClient: HttpClient;

  constructor() {
    // Use API key if available (preferred for agents)
    if (config.apiKey) {
      this.httpClient = new HttpClient({
        baseUrl: config.apiBaseUrl,
        apiKey: config.apiKey,
      });
    } else {
      // Fall back to JWT flow for development/testing
      this.httpClient = new HttpClient({
        baseUrl: config.apiBaseUrl,
      });
      this.initializeJwtAuth();
    }
  }
  
  // ... rest of implementation
}
```

═══════════════════════════════════════════════════════════════════

## Security Best Practices

### 1. API Key Generation
- Use cryptographically secure random bytes (crypto.randomBytes)
- Include identifiable prefix (h2b_agent_) for key type recognition
- Minimum 32 bytes of random data
- Store only the hash in database

### 2. Key Storage (MCP Side)
```bash
# Store in environment variable (never in code)
# .env file should be in .gitignore
API_KEY=h2b_agent_xxxxxxxxxxxxxxxxxxxxx

# For production, use secure secret management:
# - VS Code settings (encrypted with OS keychain)
# - System environment variables
# - Secret manager (HashiCorp Vault, AWS Secrets Manager)
```

### 3. Key Rotation
- Set expiration dates on API keys
- Implement key rotation without downtime:
  1. Generate new key
  2. Update MCP config with new key
  3. Verify new key works
  4. Deactivate old key
  5. Delete old key after grace period

### 4. Audit Logging
```typescript
// Log all agent API requests
const agentRequestLog = {
  timestamp: new Date(),
  apiKeyPrefix: keyDoc.keyPrefix,
  userId: userInfo.userId,
  endpoint: req.path,
  method: req.method,
  statusCode: res.statusCode,
  responseTime: duration,
  userAgent: req.headers['user-agent'],
  ip: req.ip,
};
```

### 5. Rate Limiting
```typescript
// Per-API-key rate limits
import rateLimit from 'express-rate-limit';

const agentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  keyGenerator: (req) => {
    const apiKey = req.headers['x-api-key'] as string;
    return apiKey?.substring(0, 12) || req.ip;
  },
  message: 'Too many requests from this API key',
});
```

═══════════════════════════════════════════════════════════════════

## Role Configuration for Agents

### Recommended Agent Role

```typescript
// In authorization.service.ts
const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  // ... existing roles ...
  
  // Dedicated agent role with controlled permissions
  agent: [
    'view:dashboard',
    'view:use-case',
    'create:use-case',
    'edit:use-case',
    // NO delete:use-case (require human approval)
    'view:capability',
    // NO manage:capability
    // NO manage:users
    // NO access:develop
  ],
  
  // Full-access agent for admin use
  'agent-admin': [
    'view:dashboard',
    'view:use-case',
    'create:use-case',
    'edit:use-case',
    'delete:use-case',
    'view:capability',
    'manage:capability',
    // NO manage:users (never for agents)
    'access:develop',
  ],
};
```

═══════════════════════════════════════════════════════════════════

## Admin UI for API Key Management

### Required Features

1. **List API Keys**: Show all keys with:
   - Name/description
   - Key prefix (for identification)
   - Associated service account
   - Last used timestamp
   - Scopes
   - Status (active/expired)

2. **Create API Key**:
   - Name/description field
   - Select or create service account
   - Select scopes (read/write/delete/admin)
   - Optional expiration date
   - **Display key ONCE after creation** (never shown again)

3. **Revoke API Key**:
   - Deactivate immediately
   - Option to delete permanently

4. **View Usage**:
   - Request logs per key
   - Rate limit status
   - Error rates

═══════════════════════════════════════════════════════════════════

## Migration Steps

### Step 1: Backend Changes
1. Create api_keys collection and indexes
2. Add ApiKey model and repository
3. Add API key service
4. Add API key authentication middleware
5. Update routes to support both auth methods
6. Add admin endpoints for key management

### Step 2: MCP Changes
1. Update config to support API_KEY env var
2. Update HTTP client to use X-API-Key header
3. Update API service to prefer API key over JWT
4. Remove JWT refresh logic (not needed with API keys)

### Step 3: Admin UI Changes (Optional)
1. Add API Key management page
2. Add key creation flow with copy-to-clipboard
3. Add usage monitoring dashboard

### Step 4: Testing
1. Generate test API key
2. Test MCP with API key auth
3. Verify RBAC enforcement
4. Test rate limiting
5. Test key revocation

═══════════════════════════════════════════════════════════════════

## Quick Start Guide (After Implementation)

### For Developers

1. **Request API Key**: Contact admin or use admin panel
2. **Configure MCP**:
   ```bash
   # In h2bis-pb-mcp/.env
   API_BASE_URL=http://localhost:4000
   API_KEY=h2b_agent_xxxxxxxxxxxxxxxxxxxxx
   ```
3. **Start Using**: MCP will automatically authenticate

### For Admins

1. **Create Service Account**:
   ```bash
   curl -X POST http://localhost:4000/api/auth/service-accounts \
     -H "Authorization: Bearer <admin-jwt>" \
     -H "Content-Type: application/json" \
     -d '{"name": "Claude Desktop Agent", "role": "agent"}'
   ```

2. **Generate API Key**:
   ```bash
   curl -X POST http://localhost:4000/api/auth/api-keys \
     -H "Authorization: Bearer <admin-jwt>" \
     -H "Content-Type: application/json" \
     -d '{"userId": "<service-account-id>", "name": "Development Key", "scopes": ["read", "write"]}'
   ```

3. **Share Key Securely**: 
   - Never share via unencrypted channels
   - Use password managers or secure messaging
   - Key is shown only once upon creation

═══════════════════════════════════════════════════════════════════

## Comparison Summary

| Feature                  | API Key (Recommended) | OAuth Client Credentials | JWT Service Token |
|-------------------------|----------------------|-------------------------|-------------------|
| Complexity              | Low                  | Medium-High             | Medium            |
| Token Refresh           | Not needed           | Required                | Required          |
| Industry Standard       | Yes (common)         | Yes (formal)            | Yes               |
| Audit Trail             | Built-in             | Built-in                | Requires work     |
| Revocation              | Immediate            | Immediate               | Wait for expiry   |
| Fits Current Arch       | ✓ Excellent          | Requires auth server    | Minor changes     |
| Implementation Time     | 1-2 days             | 1 week+                 | 2-3 days          |

═══════════════════════════════════════════════════════════════════

## Next Steps

1. Review this proposal
2. Choose implementation approach (recommend API Keys)
3. Decide on scope granularity (read/write/delete vs permission-level)
4. Implement in phases
5. Test thoroughly before production use

═══════════════════════════════════════════════════════════════════

END OF PROPOSAL

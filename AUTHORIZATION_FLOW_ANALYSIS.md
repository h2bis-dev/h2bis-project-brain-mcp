# Authorization Flow Analysis: MCP → API → Database

## Current Status: ❌ AUTHENTICATION FAILING (401 Unauthorized)

## The Problem

The MCP server cannot connect to the API because **the API key exists in the `.env` file but NOT in the database**.

```
MCP .env file has:  h2b_agent_cHKJrw7BvcGo5-apCiUeI-w7w_nb3EY3x47fz4IgpOc
MongoDB api_keys collection: EMPTY (or doesn't have this key hashed)
```

---

## Complete Authorization Flow

### 1. **MCP Tool Call Initiated**
```
GitHub Copilot / Claude / Cursor Agent
    ↓
calls MCP tool (e.g., getProjectList)
```

### 2. **MCP Server → API Communication**

**File**: [`h2bis-pb-mcp/src/core/services/api.service.ts`](h2bis-pb-mcp/src/core/services/api.service.ts#L1-L60)

```typescript
// MCP loads API_KEY from .env
apiKey: process.env.API_KEY || '',

// MCP creates HTTP client with X-API-Key header
this.httpClient = new HttpClient({
    baseUrl: config.apiBaseUrl,  // http://localhost:4000
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.apiKey,  // h2b_agent_cHKJr...
    },
});
```

**HTTP Request**:
```http
GET http://localhost:4000/api/project/projects/list
Headers:
  X-API-Key: h2b_agent_cHKJrw7BvcGo5-apCiUeI-w7w_nb3EY3x47fz4IgpOc
  Content-Type: application/json
```

### 3. **API Authentication Middleware**

**File**: [`h2bis-pb-api/src/core/middleware/auth.middleware.ts`](h2bis-pb-api/src/core/middleware/auth.middleware.ts#L1-L80)

```typescript
// 1. Extract API key from header
const apiKey = req.headers['x-api-key'] as string | undefined;

// 2. Call validation service
const result = await apiKeyService.validateApiKey(apiKey, {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
});

// 3. If valid, attach user to request
if (result) {
    req.user = {
        userId: result.userId,
        email: result.email,
        roles: result.roles,
        scopes: result.scopes,
        isAgent: true,
    };
    next();
} else {
    // ❌ THIS IS WHERE IT FAILS
    next(new UnauthorizedError('Invalid or revoked API key'));
}
```

### 4. **API Key Validation Service**

**File**: [`h2bis-pb-api/src/modules/auth/services/api-key.service.ts`](h2bis-pb-api/src/modules/auth/services/api-key.service.ts#L60-L120)

```typescript
async validateApiKey(apiKey: string): Promise<UserInfo | null> {
    // 1. Check format (must start with 'h2b_agent_')
    if (!apiKey.startsWith('h2b_agent_')) {
        return null;  // Invalid format
    }

    // 2. Extract prefix (first 12 characters)
    const keyPrefix = apiKey.substring(0, 12);  // "h2b_agent_cH"

    // 3. Query MongoDB for matching key
    const keyDoc = await apiKeyRepository.findActiveByPrefix(keyPrefix);

    if (!keyDoc) {
        // ❌ THIS IS WHERE IT CURRENTLY FAILS
        return null;  // No key found in database
    }

    // 4. Verify full key using bcrypt
    const isValid = await bcrypt.compare(apiKey, keyDoc.keyHash);

    if (!isValid) {
        return null;  // Hash doesn't match
    }

    // 5. Get user info and return
    const user = await userRepository.findById(keyDoc.userId);
    return {
        userId: user._id,
        email: user.email,
        roles: user.role,
        scopes: keyDoc.scopes,
        isServiceAccount: true,
    };
}
```

### 5. **MongoDB Query**

**Collection**: `h2bis-project-brain.api_keys`  
**Model**: [`h2bis-pb-api/src/core/models/api_key_model.ts`](h2bis-pb-api/src/core/models/api_key_model.ts)

```javascript
db.api_keys.findOne({
    keyPrefix: "h2b_agent_cH",
    isActive: true,
    $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
    ]
})
```

**Current Result**: `null` (no matching document)

---

## Database Schema: `api_keys` Collection

```typescript
{
    _id: ObjectId,
    keyPrefix: "h2b_agent_cH",  // First 12 chars for lookup
    keyHash: "$2b$12$...",        // bcrypt hash of full key
    name: "MCP Server Key",       // Human-readable name
    userId: ObjectId("..."),      // Links to users collection
    scopes: ["read", "write"],    // Permissions
    expiresAt: null,              // Optional expiration
    lastUsedAt: Date,             // Last usage timestamp
    isActive: true,               // Can be revoked
    createdBy: ObjectId("..."),   // Audit trail
    metadata: {
        userAgent: "...",
        lastIpAddress: "...",
        description: "MCP authentication key"
    },
    createdAt: Date,
    updatedAt: Date
}
```

---

## The Solution: Create API Key in Database

### Option 1: Use API Endpoint (Requires Admin JWT)

**Step 1**: Login as admin user
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Step 2**: Create API key using the JWT token
```bash
curl -X POST http://localhost:4000/api/auth/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "userId": "<ADMIN_USER_ID>",
    "name": "MCP Server Key",
    "scopes": ["read", "write"],
    "description": "API key for MCP server authentication"
  }'
```

**Response**:
```json
{
    "key": "h2b_agent_NEW_KEY_HERE",
    "keyId": "...",
    "keyPrefix": "h2b_agent_NE",
    "message": "⚠️ IMPORTANT: This is the only time the full key will be shown."
}
```

**Step 3**: Update MCP `.env` file with the new key
```bash
API_KEY=h2b_agent_NEW_KEY_HERE
```

### Option 2: Direct MongoDB Insert (Development Only)

**⚠️ Warning**: This bypasses bcrypt hashing. Only use for testing.

```javascript
// Connect to MongoDB
use h2bis-project-brain;

// Insert API key document
db.api_keys.insertOne({
    keyPrefix: "h2b_agent_cH",
    keyHash: "$2b$12$...",  // ❌ NEED TO GENERATE PROPER BCRYPT HASH
    name: "MCP Server Key",
    userId: ObjectId("..."),  // Must exist in users collection
    scopes: ["read", "write"],
    expiresAt: null,
    lastUsedAt: null,
    isActive: true,
    createdBy: ObjectId("..."),
    metadata: {
        description: "MCP authentication key"
    },
    createdAt: new Date(),
    updatedAt: new Date()
});
```

**Problem**: You need to generate the bcrypt hash of:
```
h2b_agent_cHKJrw7BvcGo5-apCiUeI-w7w_nb3EY3x47fz4IgpOc
```

### Option 3: Create Script to Generate and Store Key

**File**: `h2bis-pb-api/scripts/create-api-key.ts`

```typescript
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { ApiKey } from '../src/core/models/api_key_model.js';

const MONGODB_URI = 'mongodb://localhost:27017/h2bis-project-brain';
const API_KEY = 'h2b_agent_cHKJrw7BvcGo5-apCiUeI-w7w_nb3EY3x47fz4IgpOc';
const SALT_ROUNDS = 12;

async function createApiKey() {
    await mongoose.connect(MONGODB_URI);
    
    const keyPrefix = API_KEY.substring(0, 12);
    const keyHash = await bcrypt.hash(API_KEY, SALT_ROUNDS);
    
    await ApiKey.create({
        keyPrefix,
        keyHash,
        name: 'MCP Server Key',
        userId: new mongoose.Types.ObjectId('...'), // Replace with real user ID
        scopes: ['read', 'write'],
        expiresAt: null,
        isActive: true,
        createdBy: new mongoose.Types.ObjectId('...'),
        metadata: { description: 'MCP authentication key' }
    });
    
    console.log('✅ API key created successfully');
    mongoose.disconnect();
}

createApiKey();
```

---

## Authentication Priority Chain

The MCP server tries authentication in this order:

1. **API Key** (`X-API-Key` header) ← **CURRENT METHOD**
2. **JWT Token** (from `API_TOKEN` env var)
3. **Email/Password** Login (generates JWT)
4. **Unauthenticated** (will fail for protected routes)

---

## Files Involved in Authorization Flow

| File | Role |
|------|------|
| **MCP Side** | |
| [`h2bis-pb-mcp/.env`](h2bis-pb-mcp/.env) | Stores `API_KEY` value |
| [`h2bis-pb-mcp/src/core/config/config.ts`](h2bis-pb-mcp/src/core/config/config.ts) | Loads config from .env |
| [`h2bis-pb-mcp/src/core/services/api.service.ts`](h2bis-pb-mcp/src/core/services/api.service.ts) | Adds `X-API-Key` header to requests |
| [`h2bis-pb-mcp/src/core/infrastructure/http-client.ts`](h2bis-pb-mcp/src/core/infrastructure/http-client.ts) | Sends HTTP requests |
| **API Side** | |
| [`h2bis-pb-api/src/core/middleware/auth.middleware.ts`](h2bis-pb-api/src/core/middleware/auth.middleware.ts) | Intercepts requests, validates auth |
| [`h2bis-pb-api/src/modules/auth/services/api-key.service.ts`](h2bis-pb-api/src/modules/auth/services/api-key.service.ts) | Validates API key against DB |
| [`h2bis-pb-api/src/modules/auth/repositories/api-key.repository.ts`](h2bis-pb-api/src/modules/auth/repositories/api-key.repository.ts) | Queries MongoDB |
| [`h2bis-pb-api/src/core/models/api_key_model.ts`](h2bis-pb-api/src/core/models/api_key_model.ts) | Mongoose schema for api_keys |
| [`h2bis-pb-api/src/modules/auth/auth.controller.ts`](h2bis-pb-api/src/modules/auth/auth.controller.ts) | Endpoint to create API keys |
| [`h2bis-pb-api/src/modules/auth/auth.routes.ts`](h2bis-pb-api/src/modules/auth/auth.routes.ts) | Routes for API key management |

---

## Next Steps

1. **Verify MongoDB has a user** (API keys must link to a userId)
2. **Create admin user** if needed (via registration endpoint)
3. **Generate API key** using one of the methods above
4. **Update MCP `.env`** with the generated key
5. **Test MCP connection** by calling `getProjectList()` again

---

## Testing the Flow

After creating the API key:

```bash
# Test API directly
curl http://localhost:4000/api/project/projects/list \
  -H "X-API-Key: h2b_agent_YOUR_KEY_HERE"

# Expected: { "projects": [...] }
# Current:  { "error": "Unauthorized" }
```

Once this returns data, the MCP tools will work.

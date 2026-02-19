# RBAC Implementation Reference

Pattern: Authorization Contract  
Version: 1.0  
Last Updated: 2026-01-21

═══════════════════════════════════════════════════════════════════

## Core Principle

Backend computes permissions → Frontend consumes permissions → No duplication

Flow:
  Database (roles) 
    → Backend (compute permissions) 
    → API Response (roles + permissions)
    → Frontend (read only)

═══════════════════════════════════════════════════════════════════

## Authorization Contract

```typescript
interface AuthorizationContext {
  roles: string[];        // From database
  permissions: string[];  // Computed by backend
}
```

Invariants:
  1. Permissions NEVER computed on frontend
  2. Role-to-permission mapping exists ONLY in backend
  3. Frontend ONLY reads session.user.permissions

═══════════════════════════════════════════════════════════════════

## File Locations

Backend (h2bis-pb-api)

  1. Authorization Service (src/domain/services/authorization.service.ts)
        Purpose: SINGLE SOURCE OF TRUTH for all permissions
        Exports: getUserPermissions(roles), hasPermission(), ROLE_PERMISSION_MAP

  2. Login Handler (src/application/handlers/auth/authenticate-user.handler.ts)
        Purpose: Computes permissions during login
        Line 31: getUserPermissions(user.role)

  3. Auth DTOs (src/api/dtos/auth.dto.ts)
        Purpose: Defines response shape with permissions
        Contains: LoginResponseDto.permissions: string[]

  4. Auth Middleware (src/api/middleware/auth.middleware.ts)
        Purpose: Extracts roles from JWT
        Action: Attaches req.user.roles

  5. Permission Middleware (src/api/middleware/permission.middleware.ts)
        Purpose: Validates API endpoint access
        Exports: requirePermission(permission)

Frontend (h2bis-pb-web)

  1. Type Extensions (src/types/next-auth.d.ts)
        Purpose: Adds permissions to Session, User, JWT types

  2. NextAuth Config (src/lib/auth/auth.config.ts)
        Purpose: Stores permissions in session
        Callbacks: authorize(), jwt(), session()

  3. Permission Hooks (src/hooks/usePermissions.ts)
        Purpose: Access permissions from session
        Exports: usePermissions(), useHasPermission()

  4. Permission Guard (src/components/auth/PermissionGuard.tsx)
        Purpose: Conditional rendering component
        Usage: <PermissionGuard permission="...">

═══════════════════════════════════════════════════════════════════

## Permission Definitions

Location: h2bis-pb-api/src/domain/services/authorization.service.ts

```typescript
// Permission constants
export const PERMISSIONS = {
  DASHBOARD: { VIEW: 'view:dashboard' },
  USE_CASE: { 
    VIEW: 'view:use-case',
    CREATE: 'create:use-case',
    EDIT: 'edit:use-case',
    DELETE: 'delete:use-case',
  },
  CAPABILITY: { 
    VIEW: 'view:capability',
    MANAGE: 'manage:capability',
  },
  ADMIN: { 
    MANAGE_USERS: 'manage:users',
    ACCESS_DEVELOP: 'access:develop',
  },
};

// Role mapping (BACKEND ONLY)
const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  user: [/* base permissions */],
  moderator: [/* user + delete */],
  admin: [/* all permissions */],
};
```

═══════════════════════════════════════════════════════════════════

## Execution Flow

Login Flow:

  1. authenticate-user.handler.ts:31
     └─ getUserPermissions(user.role)
  
  2. authorization.service.ts:67
     └─ Looks up ROLE_PERMISSION_MAP[role]
     └─ Returns permissions array
  
  3. authenticate-user.handler.ts:42
     └─ Returns { role, permissions, accessToken }
  
  4. Frontend auth.config.ts:37
     └─ Stores user.permissions
  
  5. Frontend auth.config.ts:60
     └─ token.permissions = user.permissions
  
  6. Frontend auth.config.ts:69
     └─ session.user.permissions = token.permissions

API Request Flow:

  1. auth.middleware.ts:22
     └─ Verifies JWT → extracts roles → req.user.roles
  
  2. permission.middleware.ts:13
     └─ hasPermission(req.user.roles, permission)
  
  3. authorization.service.ts:84
     └─ Computes permissions again → validates
  
  4. Returns 403 or allows request

═══════════════════════════════════════════════════════════════════

## Making Changes

Add New Permission:

  Step 1: Define in backend (authorization.service.ts)

  Step 2: Add to roles (same file)

  Step 3: Protect endpoint (any controller)

  Step 4: Use in frontend (any component)
    ```typescript
    <PermissionGuard permission="access:new-feature">
      <NewFeature />
    </PermissionGuard>
    ```

  Result: Users get new permission on next login. No frontend changes needed.

═══════════════════════════════════════════════════════════════════

## Critical Rules

MUST:
  ✓ Permissions computed in authorization.service.ts ONLY
  ✓ All API endpoints with sensitive operations MUST use requirePermission()
  ✓ Frontend MUST use usePermissions() hook, never infer from roles
  ✓ Login handler MUST call getUserPermissions() before returning

NEVER:
  ✗ Compute permissions on frontend
  ✗ Map roles to permissions on frontend
  ✗ Trust frontend for authorization decisions
  ✗ Skip permission middleware on backend endpoints

═══════════════════════════════════════════════════════════════════

## Common Operations

Check Permission in Frontend:
  ```typescript
  const canDelete = useHasPermission('delete:use-case');
  if (!canDelete) return null;
  ```

Protect Backend Endpoint:
  ```typescript
  import { PERMISSIONS } from '../../domain/services/authorization.service.js';
  import { requirePermission } from '../middleware/permission.middleware.js';

  router.delete('/endpoint', 
    authenticate, 
    requirePermission(PERMISSIONS.USE_CASE.DELETE),
    handler
  );
  ```

Debug Permissions:
  ```javascript
  // Browser console
  fetch('/api/auth/session')
    .then(r => r.json())
    .then(s => console.log(s.user.permissions));
  ```

═══════════════════════════════════════════════════════════════════

## Available Permissions

Permission            | Admin | Moderator | User | Agent
─────────────────────|───────|───────────|──────|───────
view:dashboard       |   ✓   |     ✓     |  ✓   |  ✓
view:projects        |   ✓   |     ✓     |  ✓   |  ✓
create:project       |   ✓   |     ✓     |  ✓   |  ✓
edit:project         |   ✓   |     ✓     |  ✓   |  ✓
delete:project       |   ✓   |     ✗     |  ✗   |  ✗
view:use-case        |   ✓   |     ✓     |  ✓   |  ✓
create:use-case      |   ✓   |     ✓     |  ✓   |  ✓
edit:use-case        |   ✓   |     ✓     |  ✓   |  ✓
delete:use-case      |   ✓   |     ✓     |  ✗   |  ✗
view:capability      |   ✓   |     ✓     |  ✓   |  ✓
manage:capability    |   ✓   |     ✓     |  ✗   |  ✗
manage:users         |   ✓   |     ✗     |  ✗   |  ✗
access:develop       |   ✓   |     ✗     |  ✗   |  ✗

Note: Agent role is for MCP/automated access. It has no delete or user 
management permissions for safety reasons. Use API Keys for agent auth.

═══════════════════════════════════════════════════════════════════

## Agent (MCP) Authentication

Agents authenticate using API Keys instead of JWT tokens.

### Create API Key (Admin Only)
```bash
curl -X POST http://localhost:4000/api/auth/api-keys \
  -H "Authorization: Bearer <admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<service-account-id>",
    "name": "MCP Agent - Development",
    "scopes": ["read", "write"],
    "description": "For Claude Desktop access"
  }'
```

### Configure MCP
```bash
# In h2bis-pb-mcp/.env
API_BASE_URL=http://localhost:4000
API_KEY=h2b_agent_xxxxxxxxxxxxxxxxxxxxx
```

### API Key Scopes
- `read` - Can read data
- `write` - Can create/update data
- `delete` - Can delete data
- `admin` - All operations

═══════════════════════════════════════════════════════════════════

## Architecture Diagram

```
┌────────────────────────────────────────┐
│ DB: role: ["admin"]                    │
└──────────────┬─────────────────────────┘
               ↓
┌────────────────────────────────────────┐
│ BACKEND                                │
│   getUserPermissions(["admin"])        │
│     → ROLE_PERMISSION_MAP["admin"]    │
│     → returns computed permissions     │
│                                        │
│ Response: {                            │
│   role: ["admin"],                     │
│   permissions: ["view:...", ...]       │
│ }                                       │
└──────────────┬─────────────────────────┘
               ↓ HTTP
┌────────────────────────────────────────┐
│ FRONTEND                               │
│   session.user.permissions             │
│   usePermissions() → reads session     │
│   NO MAPPING - just reads              │
└────────────────────────────────────────┘
```

═══════════════════════════════════════════════════════════════════

## Security Model

Layer      | Purpose           | Can be bypassed?
─────────--|──────────────────|──────────────────
Frontend   | UX (hide buttons) | Yes (DevTools)
Backend    | Security (enforce)| No

Principle: Frontend shows/hides UI. Backend enforces access. Both needed.

═══════════════════════════════════════════════════════════════════

## Testing Commands

Login and get permissions:
  ```bash
  curl -X POST http://localhost:4000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"user@ex.com","password":"pass"}' | jq '.permissions'
  ```

Test protected endpoint:
  ```bash
  curl -X DELETE http://localhost:4000/api/use-case/123 \
    -H "Authorization: Bearer <token>"
  # Expect: 200 (if has permission) or 403 (if lacks permission)
  ```

═══════════════════════════════════════════════════════════════════

## Migration to ABAC

To add attribute-based permissions:

  1. Extend contract:
     ```typescript
     interface AuthorizationContext {
       roles: string[];
       permissions: string[];
       attributes?: { department: string; /* ... */ };
     }
     ```

  2. Update getUserPermissions() to consider attributes

  3. Frontend code unchanged (still just reads permissions)

═══════════════════════════════════════════════════════════════════

END OF REFERENCE

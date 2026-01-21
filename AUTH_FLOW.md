# Auth & Authorization Flow

═══════════════════════════════════════════════════════════════════

## 1. REGISTRATION FLOW

```
POST /api/auth/register
{ email, password, name, role }
        ↓
┌─────────────────────────────────────────────────────────┐
│ auth.routes.ts:8                                        │
│   router.post('/register', authController.register)    │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ auth.controller.ts:11                                   │
│   register() → registerUserHandler.execute()           │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ register-user.handler.ts:10                             │
│   execute() {                                           │
│     1. hashPassword(dto.password)                       │
│     2. userRepository.create()                          │
│     3. return { id, email, role }                       │
│   }                                                      │
└─────────────────────┬───────────────────────────────────┘
                      ↓
Response: 201 { id, email, role }
```

═══════════════════════════════════════════════════════════════════

## 2. LOGIN FLOW

```
POST /api/auth/login
{ email, password }
        ↓
┌─────────────────────────────────────────────────────────┐
│ auth.routes.ts:11                                       │
│   router.post('/login', authController.login)          │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ auth.controller.ts:26                                   │
│   login() → authenticateUserHandler.execute()          │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ authenticate-user.handler.ts                            │
│                                                          │
│   execute() {                                           │
│     L14: user = userRepository.findByEmail()           │
│     L20: verifyPassword(password, hash)                │
│     L26: check isActive                                 │
│     L31: permissions = getUserPermissions(user.role) ★ │
│     L33: accessToken = generateAccessToken()           │
│     L38: refreshToken = generateRefreshToken()         │
│     L41: return Authorization Contract                  │
│   }                                                      │
└─────────────────────┬───────────────────────────────────┘
                      ↓
Response: 200 { id, email, role, permissions, accessToken, refreshToken }
```

═══════════════════════════════════════════════════════════════════

## 3. PROTECTED ROUTE (JWT Verification)

```
GET /api/auth/me
Headers: Authorization: Bearer <token>
        ↓
┌─────────────────────────────────────────────────────────┐
│ auth.routes.ts:14                                       │
│   router.get('/me', authenticate, getCurrentUser)      │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ auth.middleware.ts:9                                    │
│   authenticate() {                                      │
│     L12: extract token from header                     │
│     L22: decoded = verifyAccessToken(token)            │
│     L25: req.user = { userId, email, roles }           │
│     L30: next()                                         │
│   }                                                      │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ auth.controller.ts:41                                   │
│   getCurrentUser() {                                    │
│     L43: user = req.user                               │
│     L45: return user info                               │
│   }                                                      │
└─────────────────────┬───────────────────────────────────┘
                      ↓
Response: 200 { userId, email, roles }
```

═══════════════════════════════════════════════════════════════════

## 4. PERMISSION-BASED AUTHORIZATION

```
DELETE /api/use-case/:id
Headers: Authorization: Bearer <token>
        ↓
┌─────────────────────────────────────────────────────────┐
│ use-case.routes.ts                                      │
│   router.delete('/:id',                                 │
│     authenticate,                                       │
│     requirePermission('delete:use-case'),              │
│     deleteUseCase                                       │
│   )                                                      │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ MIDDLEWARE 1: auth.middleware.ts:9                      │
│   authenticate() {                                      │
│     L22: decoded = verifyAccessToken(token)            │
│     L25: req.user = { userId, email, roles }           │
│     L30: next()                                         │
│   }                                                      │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ MIDDLEWARE 2: permission.middleware.ts:9                │
│   requirePermission('delete:use-case') {               │
│     L11: user = req.user                               │
│     L13: if (!hasPermission(user.roles, permission))   │
│            → throws 403                                 │
│     L17: next()                                         │
│   }                                                      │
│        ↓                                                 │
│   authorization.service.ts:84                           │
│     hasPermission(roles, permission) {                  │
│       L85: permissions = getUserPermissions(roles)     │
│       L86: return permissions.includes(permission)     │
│     }                                                    │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ CONTROLLER: use-case.controller.ts                      │
│   deleteUseCase() {                                     │
│     - execute business logic                            │
│     - return response                                   │
│   }                                                      │
└─────────────────────┬───────────────────────────────────┘
                      ↓
Response: 200 OK or 403 Forbidden
```

═══════════════════════════════════════════════════════════════════

## 5. PERMISSION COMPUTATION

```
┌─────────────────────────────────────────────────────────┐
│ authorization.service.ts:67                             │
│                                                          │
│   getUserPermissions(roles) {                           │
│                                                          │
│     roles.forEach(role => {                             │
│       ROLE_PERMISSION_MAP[role]  ← Lookup              │
│         → returns permissions array                     │
│     })                                                   │
│                                                          │
│     return deduplicated permissions                     │
│   }                                                      │
│                                                          │
│ Example:                                                 │
│   Input: ["admin"]                                      │
│   ROLE_PERMISSION_MAP["admin"] = [                     │
│     "view:dashboard",                                   │
│     "view:use-case",                                    │
│     "create:use-case",                                  │
│     "edit:use-case",                                    │
│     "delete:use-case",                                  │
│     "view:capability",                                  │
│     "manage:capability",                                │
│     "manage:users",                                     │
│     "access:develop"                                    │
│   ]                                                      │
│   Output: array of 9 permissions                        │
└─────────────────────────────────────────────────────────┘
```

═══════════════════════════════════════════════════════════════════

## KEY FILES

Backend:
  auth.routes.ts                          - Route definitions
  auth.controller.ts                      - HTTP request handlers
  register-user.handler.ts                - Registration logic
  authenticate-user.handler.ts            - Login logic
  auth.middleware.ts                      - JWT verification
  permission.middleware.ts                - Permission validation
  authorization.service.ts                - Permission computation
  jwt.service.ts                          - JWT sign/verify
  password.service.ts                     - Bcrypt hash/verify
  user.repository.ts                      - Database operations

═══════════════════════════════════════════════════════════════════

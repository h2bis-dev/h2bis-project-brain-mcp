# Authentication Flow - Login & JWT Generation

## Overview

This document describes the authentication flow for user login and JWT token generation in the H2BIS ProjectBrain API. The system uses a layered architecture with JWT-based authentication.

---

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         API Layer (HTTP)                │  ← Entry point, routing, validation
├─────────────────────────────────────────┤
│      Application Layer (Handlers)      │  ← Business logic orchestration
├─────────────────────────────────────────┤
│       Domain Layer (Services)           │  ← Core business logic (JWT, password)
├─────────────────────────────────────────┤
│   Infrastructure Layer (Repository)     │  ← Data access (MongoDB)
└─────────────────────────────────────────┘
```

---

## Login Flow

### Request Flow Diagram

```
POST /api/auth/login
  ↓
[auth.controller.ts] → login()
  ↓
[auth.dto.ts] → LoginRequestDto.parse() ← Validate email & password
  ↓
[authenticate-user.handler.ts] → execute()
  ↓
[user.repository.ts] → findByEmail()
  ↓
[MongoDB] ← Query user by email
  ↓
[password.service.ts] → verifyPassword() ← Compare hashed password
  ↓
[jwt.service.ts] → generateAccessToken() ← Create JWT with user data
  ↓
[jwt.service.ts] → generateRefreshToken() ← Create refresh token
  ↓
[LoginResponseDto] ← Return user data + tokens
  ↓
HTTP 200 Response
```

---

## File & Method Reference

### 1. **API Layer**
**File**: `src/api/controllers/auth.controller.ts`
- **Method**: `login(req, res)`
- **Purpose**: HTTP endpoint handler for login requests
- **Route**: `POST /api/auth/login`

**File**: `src/api/dtos/auth.dto.ts`
- **Schemas**: `LoginRequestDto`, `LoginResponseDto`
- **Purpose**: Request validation and response type definition

**File**: `src/api/routes/auth.routes.ts`
- **Routes**: Maps `/login` to `authController.login`

---

### 2. **Application Layer**
**File**: `src/application/handlers/auth/authenticate-user.handler.ts`
- **Class**: `AuthenticateUserHandler`
- **Method**: `execute(dto: LoginRequestDto): Promise<LoginResponseDto>`
- **Purpose**: Orchestrates authentication logic
- **Steps**:
  1. Find user by email
  2. Verify password
  3. Check account status
  4. Generate JWT tokens
  5. Return response

---

### 3. **Domain Layer**

**File**: `src/domain/services/jwt.service.ts`
- **Functions**:
  - `generateAccessToken(userId, email, roles)` → Access token (1 hour)
  - `generateRefreshToken(userId)` → Refresh token (7 days)
  - `verifyAccessToken(token)` → Decode & validate access token
  - `verifyRefreshToken(token)` → Decode & validate refresh token
- **Purpose**: JWT token creation and verification
- **Payload**: `{ userId, email, roles }` (access token)

**File**: `src/domain/services/password.service.ts`
- **Function**: `verifyPassword(plaintext, hash)`
- **Purpose**: Compare password with bcrypt hash

**File**: `src/domain/models/user_model.ts`
- **Schema**: User schema with email, passwordHash, role, isActive
- **Purpose**: MongoDB user model definition

---

### 4. **Infrastructure Layer**

**File**: `src/infrastructure/database/repositories/user.repository.ts`
- **Class**: `UserRepository`
- **Methods**:
  - `findByEmail(email)` → Query user from MongoDB
  - `findById(id)` → Query user by ID
- **Purpose**: Data access abstraction for User entity

---

## JWT Token Structure

### Access Token Payload
```json
{
  "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "email": "user@example.com",
  "roles": ["user"],
  "iat": 1706000000,
  "exp": 1706003600
}
```
- **Expiration**: 1 hour (3600 seconds)
- **Purpose**: API authentication for protected routes

### Refresh Token Payload
```json
{
  "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "iat": 1706000000,
  "exp": 1706604800
}
```
- **Expiration**: 7 days (604800 seconds)
- **Purpose**: Obtain new access tokens without re-login

---

## Request/Response Examples

### Login Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Login Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "email": "user@example.com",
  "role": ["user"],
  "isActive": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYxYTJiM2M0ZDVlNmY3ZzhoOWkwajEiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTcwNjAwMDAwMCwiZXhwIjoxNzA2MDAzNjAwfQ...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYxYTJiM2M0ZDVlNmY3ZzhoOWkwajEiLCJpYXQiOjE3MDYwMDAwMDAsImV4cCI6MTcwNjYwNDgwMH0..."
}
```

---

## Conceptual Flow Summary

1. **Client** sends login credentials (email + password)
2. **Controller** validates request format using Zod schema
3. **Handler** orchestrates authentication:
   - Queries database for user
   - Verifies password hash
   - Checks account status
4. **JWT Service** generates signed tokens with user claims
5. **Response** includes user data + access/refresh tokens
6. **Client** stores tokens for subsequent authenticated requests

---

## Security Considerations

- Passwords are hashed using bcrypt (never stored plaintext)
- JWT tokens are signed with secret keys (configurable via environment variables)
- Access tokens are short-lived (1 hour) to limit exposure
- Refresh tokens allow seamless token renewal without re-authentication
- Token secrets should be cryptographically strong in production

---

## Configuration

**Environment Variables** (`.env`):
- `JWT_ACCESS_SECRET` - Secret key for access token signing
- `JWT_REFRESH_SECRET` - Secret key for refresh token signing

**Token Expiration** (hardcoded in `jwt.service.ts`):
- Access Token: 3600 seconds (1 hour)
- Refresh Token: 604800 seconds (7 days)

---

## Next: Token Verification & Authorization

To use these tokens for protected routes:
1. Create authentication middleware to verify tokens
2. Extract user info from token payload
3. Attach user context to request
4. Implement role-based access control (RBAC)

See `implementation_plan.md` for full RBAC implementation details.

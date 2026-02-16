# h2bis-pb-api — Module Structure Guide

> **For AI agents:** Read this file first to understand where code lives and how modules connect. Each module is self-contained — start by reading the module you need, then check `core/` only for shared contracts.

## Architecture

**Module-first Clean Architecture** — code is organized by business domain, not by technical layer.

```
src/
├── index.ts                    # Express app bootstrap, middleware, DB connection
├── routes.ts                   # Top-level router — mounts all module routes
├── init-indexes.ts             # MongoDB index creation on startup
│
├── core/                       # Shared cross-cutting concerns (no business logic)
│   ├── config/
│   │   ├── config.ts           # Environment variables (PORT, MONGO_URI, JWT secrets)
│   │   └── logger.ts           # Winston logger setup
│   ├── database/
│   │   └── connection.ts       # MongoDB/Mongoose connection manager
│   ├── errors/
│   │   └── app.error.ts        # Custom AppError class with HTTP status codes
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT token verification (req.user population)
│   │   ├── permission.middleware.ts  # RBAC permission checks
│   │   ├── error.middleware.ts  # Global Express error handler
│   │   └── async-handler.ts    # Async route wrapper (catches rejections)
│   ├── models/
│   │   ├── user_model.ts       # Mongoose User schema + model
│   │   └── refresh_token_model.ts  # Mongoose RefreshToken model
│   ├── schemas/                # Shared Zod data contracts (used by multiple modules)
│   │   ├── use_case_schema.ts  # UseCase validation schema
│   │   ├── capability_schema.ts # Capability validation schema
│   │   └── features_schema.ts  # Feature/sub-feature schema
│   ├── types/
│   │   └── common.types.ts     # Shared TypeScript interfaces (Pagination, etc.)
│   └── utils/
│       └── response.mapper.ts  # Standardized API response formatter
│
└── modules/                    # Business domain modules (self-contained)
    ├── auth/                   # Authentication & authorization
    ├── project/                # Project management
    ├── use-case/               # Use case CRUD + AI enhancement
    ├── capability/             # Capability breakdown generation
    └── knowledge/              # Raw MongoDB access (MCP bridge)
```

## Module Anatomy

Each module follows a consistent internal structure:

```
modules/{feature}/
├── {feature}.routes.ts         # Express router with path definitions
├── {feature}.controller.ts     # HTTP request/response handling
├── {feature}.dto.ts            # Zod validation schemas for request bodies
├── handlers/                   # Business logic orchestrators (1 per use-case)
│   ├── create-{feature}.handler.ts
│   ├── update-{feature}.handler.ts
│   └── get-{feature}.handler.ts
├── repositories/               # Database access layer (Mongoose queries)
│   └── {feature}.repository.ts
├── services/                   # Domain services (complex business rules)
│   └── {feature}.service.ts
└── types/                      # Module-specific TypeScript types (optional)
```

**Request flow:** Route → Controller → Handler → Service/Repository

## Module Quick Reference

### auth/
- **Purpose:** User registration, login, JWT token management, RBAC authorization
- **Key files:** `services/jwt.service.ts` (token creation/verification), `services/authorization.service.ts` (role-based checks), `services/password.service.ts` (bcrypt hashing)
- **Cross-module usage:** `authorization.service` is imported by project and use-case modules for permission checks
- **Routes:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`

### project/
- **Purpose:** CRUD for projects, dashboard statistics, project metadata management
- **Key files:** `project_schema.ts` (Mongoose schema), `handlers/get-dashboard-stats.handler.ts`
- **Routes:** `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/:id`, `GET /api/projects/dashboard/stats`

### use-case/
- **Purpose:** Full use case lifecycle — CRUD, AI-powered enhancement, normative validation, surgical fixes
- **Key files:** `services/transformation.service.ts` (AI pipeline), `services/surgical-fix.service.ts`, `services/validation.service.ts` (normative checks), `handlers/enhance-use-case.handler.ts`
- **External dependency:** Imports from `h2bis-pb-ai` package for LLM agents
- **Routes:** `GET/POST /api/use-cases`, `GET/PUT/DELETE /api/use-cases/:id`, `POST /api/use-cases/:id/enhance`

### capability/
- **Purpose:** Capability breakdown generation from use cases, dependency graph traversal
- **Key files:** `handlers/generate-capability.handler.ts`, `services/capability.service.ts`
- **Routes:** `GET/POST /api/capabilities`, `GET /api/capabilities/:id/dependencies`, `GET /api/capabilities/:id/impact`

### knowledge/
- **Purpose:** Raw MongoDB collection access for MCP bridge (no routes — repository only)
- **Key files:** `repositories/knowledge.repository.ts`

## Import Conventions

- **Cross-module imports:** Use relative paths (`../../auth/services/authorization.service.js`)
- **Core imports:** Use relative paths (`../../core/config/config.js`)
- **All imports use `.js` extension** (ESM module resolution)
- **External packages:** `h2bis-pb-ai` (AI agents), `mongoose`, `express`, `zod`, `jsonwebtoken`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js + TypeScript (ESM) |
| Framework | Express 4.18 |
| Database | MongoDB 7.x via Mongoose 9.x |
| Validation | Zod 3.22 |
| Auth | JWT (jsonwebtoken) + bcrypt |
| AI Integration | h2bis-pb-ai (local package) |
| Build | tsc → dist/ |

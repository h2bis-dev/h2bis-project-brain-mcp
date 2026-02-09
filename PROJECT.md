# H2BIS Project Brain

## Purpose
AI-powered software development assistant that automates the SDLC from requirements to implementation. Transforms business requirements into actionable development artifacts using agentic AI (OpenAI/Claude).

## Technology Stack

### Frontend (h2bis-pb-web)
- Next.js 15 (App Router), TypeScript, React 19
- UI: ShadCN UI, TailwindCSS
- State: React Query, NextAuth (JWT)

### Backend (h2bis-pb-api)
- Express.js, TypeScript, MongoDB (Mongoose)
- Auth: JWT + bcrypt, Validation: Zod
- AI: h2bis-pb-ai library (OpenAI GPT-4-turbo)

### AI Layer (h2bis-pb-ai)
- Shared library with reusable agents and services
- Agents: Intent Extraction, Use Case Generation
- Services: LLM Service, Cache Service

## Architecture
```
h2bis-pb/                    # Workspace root folder
├── h2bis-pb-api/            # Express backend API 
├── h2bis-pb-ai/             # AI utilities library 
├── h2bis-pb-mcp/            # MCP server with tools 
└── h2bis-pb-web/            # Next.js frontend
```

## Implementation Status

### ✅ Implemented
- **Auth**: JWT-based login/register with RBAC (owner, admin, moderator, viewer)
- **Projects**: Full CRUD with dashboard, multi-user access
- **Use Cases**: Full CRUD linked to projects, AI-assisted generation
- **Intent Extraction**: LLM-powered semantic analysis (goals, responsibilities, business value)

### 🚧 In Progress
- Capability generation from use cases
- Dependency graph visualization and impact analysis

### 📋 Planned
- Code generation from capabilities
- Test generation from acceptance criteria

## Key Structure
```
h2bis-pb/
├── h2bis-pb-web/     # Next.js: src/app, src/components, src/services
├── h2bis-pb-api/     # Express: src/api, src/application, src/domain
└── h2bis-pb-ai/      # Agents: src/agents, src/services
```

## Data Models
Available at `h2bis-pb-api/src/domain/models` (User, Project, UseCase, Capability)

## Auth & Permissions
- **JWT tokens** contain: userId, email, roles, permissions[]
- **Endpoints** protected by: `authenticate` + `requirePermission(permission)` middleware
- **Permissions**: `view:dashboard`, `create:use-case`, `delete:use-case`, `manage:users`
- **All endpoints** require `Authorization: Bearer <token>` (except `/auth/login`, `/auth/register`)

## AI Agent Notes
1. **Use Case Flow**: Text description → AI generates structured use case → User reviews → Save to DB
2. **Project Context**: All use cases linked via `projectId` field
3. **AI Layer**: Shared library imported by API (not a separate service)
4. **MCP Tools**: Can call API endpoints for CRUD operations
5. **Incomplete**: Capability graph partial, code generation planned

---
**Version**: 1.0.0 | **Updated**: 2026-02-09 | **Status**: Active Development

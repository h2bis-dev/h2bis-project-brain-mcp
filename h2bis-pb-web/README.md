# H2BIS ProjectBrain - Web Layer

Next.js 15 (App Router) | React 19 | TypeScript | Tailwind + shadcn/ui | TanStack Query 5 | NextAuth.js 4 (JWT) | Axios | React Hook Form + Zod | `@/*` = `src/*`

## Gotchas

- **Two API clients**: `services/api-client.ts` (Axios + JWT interceptors) used by project/use-case/capability/dashboard services. `services/api/client.ts` (fetch-based) used only by `auth.service.ts`.
- **`_id` -> `id` mapping** done in `project.service.ts` for all project responses.
- **Permissions** come from backend (Authorization Contract) - frontend only reads `session.user.permissions[]`, never computes them. `lib/auth/rbac.ts` is a reference, not the source of truth.
- **ProjectContext** is global - `useProject()` / `useSelectedProject()` used across navbar, sidebar, and all project-scoped hooks.
- **Query keys**: `['projects']`, `['use-cases', projectId]`, `['use-case', id, projectId]`, `['capabilities']`.

## Feature -> File Map

### Auth & Session
| Action | Page/Hook | Service | API |
|--------|-----------|---------|-----|
| Login | `login/page.tsx` -> `useLogin()` | NextAuth `authorize()` in `lib/auth/auth.config.ts` | `POST /api/auth/login` |
| Register | `register/page.tsx` -> `useRegister()` | `auth.service.ts` (uses fetch client) | `POST /api/auth/register` |
| Token refresh (proactive) | Request interceptor in `api-client.ts:22` | `getSession()` triggers `auth.config.ts` jwt callback | `POST /api/auth/refresh` |
| Token refresh (401 retry) | Response interceptor in `api-client.ts:63` | Queue-based retry, `signOut()` on failure | `POST /api/auth/refresh` |
| Idle timeout | `use-idle-timeout.ts` -> `signOut()` | - | Warns at 13min, logout at 15min |
| Route protection | `middleware.ts` | NextAuth `withAuth` | Public: `/login`, `/register`, `/forgot-password`, `/` |

**`signOut()` called from 3 places**: `api-client.ts:29`, `api-client.ts:105`, `use-idle-timeout.ts:56` (each with different redirect params).

### Project Management
| Action | Page/Component | Hook | Service Method | API |
|--------|---------------|------|----------------|-----|
| Load projects (global) | `providers.tsx` -> `ProjectContext.tsx` | `useProject()` | `projectService.getAll()` | `GET /api/projects` |
| Switch project | `navbar.tsx`, `ProjectCard.tsx` | `useSwitchProject()` | Context + invalidates `['use-cases']`, `['capabilities']` | - |
| Create project | `navbar.tsx` (gated: `create:project`) -> `CreateProjectModal.tsx` | - | `projectService.create()` | `POST /api/projects` |
| View/edit project | `projects/[id]/page.tsx` -> `ProjectMetadataForm.tsx`, `DomainModelTable.tsx`, `ConfigurationTable.tsx` | - | `projectService.getById()`, `.update()` | `GET/PUT /api/projects/{id}` |
| Dashboard stats | `dashboard/page.tsx` -> `ProjectCard.tsx` | - | `getDashboardStats()` | `GET /api/projects/dashboard` |

**`useSwitchProject()` used in 2 places**: `navbar.tsx` (dropdown) and `ProjectCard.tsx` (card click). Both invalidate query cache.
**`projectService.getAll()` called from 2 places**: `ProjectContext.loadProjects()` and `useProjects()` hook.

### Use Case Management
| Action | Page/Component | Hook | Service Method | API |
|--------|---------------|------|----------------|-----|
| List use cases | `use-cases/page.tsx` | `useUseCases()` | `useCaseService.getAll(projectId)` | `GET /api/use-cases?projectId=` |
| View detail (9 tabs) | `UseCaseDetail.tsx` | `useUseCase(id)` | `useCaseService.getById(id)` | `GET /api/use-cases/{id}` |
| Create use case | `create-use-case/page.tsx` | `useCreateUseCase()` | `useCaseService.create()` | `POST /api/use-cases` |
| Delete (admin) | `use-cases/page.tsx` (gated: `delete:use-case`) | `useDeleteUseCase()` | `useCaseService.delete(id)` | `DELETE /api/use-cases/{id}` |
| AI generate (stub) | `create-use-case/page.tsx` | - | `useCaseService.generate()` | `POST /api/use-cases/generate` |
| Auto-save draft | `create-use-case/page.tsx` | `useAutoSaveDraft()` | localStorage | - |

**`useSelectedProject()` depended on by**: `useUseCases()`, `useUseCase()`, `useCreateUseCase()`, `useProjectUseCases()`. All use-case queries are project-scoped.
**Query key `['use-cases', projectId]` invalidated by**: `useCreateUseCase()`, `useDeleteUseCase()`, `useSwitchProject()`.

### Capabilities (UI is stub, service layer complete)
| Service Method | API |
|----------------|-----|
| `getAllCapabilities(projectId?)` | `POST /api/find` |
| `getCapabilityById(id)` | `GET /api/capabilities/{id}` |
| `getFullContext(id)` | `GET /api/capabilities/{id}/full-context` |
| `getDependencies(id, depth)` | `GET /api/capabilities/{id}/dependencies` |
| `getDependents(id, depth)` | `GET /api/capabilities/{id}/dependents` |
| `detectCircular(id)` | `GET /api/capabilities/{id}/circular` |
| `analyzeImpact(id)` | `GET /api/capabilities/{id}/impact` |
| `getImplementationOrder(nodeIds[])` | `POST /api/capabilities/order` |
| `createCapability(data)` | `POST /api/capabilities` |
| `updateCapability(id, data)` | `PUT /api/capabilities/{id}` |
| `deleteCapability(id)` | `DELETE /api/capabilities/{id}` |
| `linkArtifact(id, artifact)` | `POST /api/capabilities/{id}/link-artifact` |
| `findByFile(filepath)` | `GET /api/capabilities/by-file/{path}` |

### RBAC & Permissions
Roles: `admin` (all), `user` (read+write), `viewer` (read-only). Check with `useHasPermission(p)` or `<PermissionGuard permission="p">`.

| Permission checked | File:Line | UI Element |
|--------------------|-----------|------------|
| `create:project` | `navbar.tsx:72` | "Create Project" button |
| `access:develop` | `sidebar.tsx:143` | "Develop" nav link |
| `delete:use-case` | `use-cases/page.tsx:35` | Delete button per use case |

## Cross-References (Multi-Use Exports)

| Export | Defined In | All Consumers |
|--------|-----------|---------------|
| `apiClient` (axios) | `services/api-client.ts` | `project.service`, `use-case.service`, `capability.service`, `dashboard.service` |
| `useProject()` | `contexts/ProjectContext.tsx` | `navbar.tsx`, `sidebar.tsx`, `hooks/useProject.ts` |
| `useSelectedProject()` | `hooks/useProject.ts` | `useUseCases.ts` (x4), `useProjectUseCases()` |
| `useSwitchProject()` | `hooks/useProject.ts` | `navbar.tsx`, `ProjectCard.tsx` |
| `PermissionGuard` | `components/auth/PermissionGuard.tsx` | `navbar.tsx`, `sidebar.tsx` |
| `useHasPermission()` | `hooks/usePermissions.ts` | `PermissionGuard.tsx`, `use-cases/page.tsx` |
| `API_ENDPOINTS` | `lib/config.ts` | All services |
| `API_BASE_URL` | `lib/config.ts` | `api-client.ts`, `api/client.ts`, `auth.config.ts` |
| `ROUTES` | `lib/constants.ts` | `navbar.tsx`, `sidebar.tsx`, `ProjectCard.tsx`, `use-cases/page.tsx` |
| `Project` type | `types/project.types.ts` | `ProjectContext`, `useProject.ts`, `ProjectCard`, `navbar`, `project.service` |
| `UseCase` type | `types/use-case.types.ts` | `useUseCases.ts`, `use-case.service`, `UseCaseDetail`, `use-cases/page` |
| `signOut()` | `next-auth/react` | `api-client.ts` (x2), `use-idle-timeout.ts` |

## Stubs (Placeholder Pages)

`/capabilities`, `/analytics`, `/summaries`, `/develop`, `knowledge.service.ts`, `SessionWarning.tsx`

## Env Vars

`NEXT_PUBLIC_API_URL` (default `http://localhost:4000`), `NEXTAUTH_SECRET` (required prod), `NEXTAUTH_URL` (auto), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

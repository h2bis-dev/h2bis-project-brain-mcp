# MCP Functional Improvement Proposals

> These are **not applied** changes. Each proposal describes a targeted improvement to
> the h2bis-pb-mcp architecture that goes beyond schema/handler separation. They are
> grouped by impact and listed from lowest to highest risk.

---

## Proposal 1 — Remove debug logging from `listProjects`

**File:** `src/modules/project/tools/listProjects.ts`

**Problem:** Three `console.error('DEBUG: ...')` calls were left in from development.
They write to stderr, which in an MCP server is the user-visible log channel, polluting
every call to `listProjects` with noise.

**Change (3 lines removed):**

```diff
-   console.error('DEBUG: Calling API endpoint:', endpoint);
    const result = await apiService.get<any>(endpoint);
-   console.error('DEBUG: API result:', JSON.stringify(result, null, 2));

    if (!result || !result.data || !result.data.projects) {
-       console.error('DEBUG: Result structure check failed', { ... });
```

**Risk:** None.

---

## Proposal 2 — Module barrel exports

**Problem:** Adding or removing a tool requires editing the global `tools/index.ts`, which
currently imports from every module directly. This breaks the open/closed principle — the
file must be changed for every new tool regardless of which module it belongs to.

**Proposed structure:**

Each module gets an `index.ts` that owns its tool registrations:

```
src/modules/project/index.ts        ← exports projectTools[]
src/modules/capability/index.ts     ← exports capabilityTools[]
src/modules/knowledge/index.ts      ← exports knowledgeTools[]
src/modules/use-case/index.ts       ← exports useCaseTools[]
```

**Example — `src/modules/project/index.ts`:**

```typescript
import {
    createProjectSchema, updateProjectSchema, getProjectByIdSchema,
    getProjectListSchema, listProjectsSchema,
    upsertProjectDomainModelSchema, removeProjectDomainModelSchema,
} from './schemas/project.schemas.js';
import { createProject }              from './tools/createProject.js';
import { updateProject }              from './tools/updateProject.js';
import { getProjectById }             from './tools/getProjectById.js';
import { getProjectList }             from './tools/getProjectList.js';
import { listProjects }               from './tools/listProjects.js';
import { upsertProjectDomainModel }   from './tools/upsertProjectDomainModel.js';
import { removeProjectDomainModel }   from './tools/removeProjectDomainModel.js';

export const projectTools = [
    { name: 'createProject',            schema: createProjectSchema,           handler: createProject,           description: '...' },
    { name: 'updateProject',            schema: updateProjectSchema,           handler: updateProject,           description: '...' },
    { name: 'getProjectById',           schema: getProjectByIdSchema,          handler: getProjectById,          description: '...' },
    { name: 'getProjectList',           schema: getProjectListSchema,          handler: getProjectList,          description: '...' },
    { name: 'listProjects',             schema: listProjectsSchema,            handler: listProjects,            description: '...' },
    { name: 'upsertProjectDomainModel', schema: upsertProjectDomainModelSchema, handler: upsertProjectDomainModel, description: '...' },
    { name: 'removeProjectDomainModel', schema: removeProjectDomainModelSchema, handler: removeProjectDomainModel, description: '...' },
];
```

**Resulting `src/tools/index.ts`:**

```typescript
import { knowledgeTools }    from '../modules/knowledge/index.js';
import { projectTools }      from '../modules/project/index.js';
import { useCaseTools }      from '../modules/use-case/index.js';
import { capabilityTools }   from '../modules/capability/index.js';

export const tools = [
    ...knowledgeTools,
    ...projectTools,
    ...useCaseTools,
    ...capabilityTools,
];
```

**Risk:** Low — purely structural, no logic changes.

---

## Proposal 3 — Decompose the `ApiService` god class

**File:** `src/core/services/api.service.ts` (392 lines)

**Problem:** The class currently handles four independent concerns in one place:

| Concern                      | Lines (approx) |
|------------------------------|---------------|
| Authentication initialization | ~80           |
| Generic HTTP delegation       | ~40           |
| Knowledge CRUD operations     | ~80           |
| Endpoint routing logic        | ~80           |
| Capability graph operations   | ~30           |

This makes it hard to add security layers (e.g., request signing) in one place, and makes
the class difficult to unit-test.

**Proposed split:**

```
src/core/services/
    auth.service.ts          ← auth init, token refresh, header injection
    api.service.ts           ← THIN: get/post/put/delete only (delegates to http-client)

src/modules/project/services/
    project.api.ts           ← /api/projects/... endpoints

src/modules/capability/services/
    capability.api.ts        ← /api/capabilities/... endpoints

src/modules/knowledge/services/
    knowledge.api.ts         ← /api/project-brain-system/mcp/... endpoints

src/modules/use-case/services/
    useCase.api.ts           ← /api/use-cases/... endpoints
```

**`api.service.ts` becomes a thin wrapper:**

```typescript
export class ApiService {
    constructor(
        private readonly http: HttpClient,
        private readonly auth: AuthService,
    ) {}

    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        await this.auth.ensureAuthenticated();
        return this.http.get<T>(endpoint, options);
    }
    async post<T>(endpoint: string, body?: any): Promise<T> { ... }
    async put<T>(endpoint: string, body?: any): Promise<T> { ... }
    async delete<T>(endpoint: string, body?: any): Promise<T> { ... }
}
```

**Tool handlers then import from their module-level service:**

```typescript
// capability/tools/analyzeCapabilityImpact.ts
import { capabilityApiService } from '../services/capability.api.js';

export async function analyzeCapabilityImpact({ nodeId }) {
    const result = await capabilityApiService.analyzeImpact(nodeId);
    // ...
}
```

**Risk:** Medium — requires updating all tool handlers and injecting the new services.
Recommend implementing incrementally, module by module.

---

## Proposal 4 — Standardise knowledge tool handler HTTP calls

**Problem:** Knowledge tools (`findDocument`, `insertDocument`, etc.) are the only ones
that call *domain-specific* methods on `apiService` (`apiService.findDocument()`,
`apiService.insertDocument()`) instead of plain HTTP verbs. All other tools call
`apiService.get/post/put/delete`. This inconsistency means the endpoint-building logic
lives inside `api.service.ts` for knowledge operations but inside tool handlers for
project and capability operations.

**Fix (dependent on Proposal 3):**
Move the endpoint-building into `knowledge.api.ts`. Tool handlers call
`knowledgeApiService.insert(collectionName, document)` which internally calls
`apiService.post('/api/project-brain-system/mcp/insert', ...)`.

This makes `api.service.ts` a uniform transport facade with zero domain knowledge.

**Risk:** Low in isolation, Medium when combined with Proposal 3.

---

## Summary

| # | Proposal                             | Risk   | Dependency |
|---|--------------------------------------|--------|------------|
| 1 | Remove debug logging                 | None   | —          |
| 2 | Module barrel exports                | Low    | —          |
| 3 | Decompose ApiService god class       | Medium | —          |
| 4 | Standardise knowledge tool HTTP calls | Medium | Proposal 3 |

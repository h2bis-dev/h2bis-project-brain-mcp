# h2bis-pb-mcp — Module Structure Guide

> **For AI agents:** Read this file first. This is a thin MCP-to-REST proxy — each tool calls the h2bis-pb-api via HTTP. Tools are grouped by domain module.

## Architecture

**Module-first MCP Server** — tools are organized by business domain under `modules/`, shared HTTP infrastructure lives in `core/`.

```
src/
├── index.ts                    # MCP server bootstrap (registers all tools, starts stdio transport)
│
├── core/                       # Shared infrastructure (no business logic)
│   ├── config/
│   │   └── config.ts           # Environment variables (API_BASE_URL, auth credentials)
│   ├── infrastructure/
│   │   └── http-client.ts      # Generic HTTP client wrapper around native fetch
│   └── services/
│       └── api.service.ts      # API service singleton — routes requests to correct REST endpoints
│                                 # Auto-authenticates on startup (token → login → unauthenticated fallback)
│
├── modules/                    # Domain-grouped MCP tools
│   ├── knowledge/tools/        # Generic MongoDB CRUD operations
│   │   ├── insertDocument.ts   # Insert a document into any collection
│   │   ├── findDocument.ts     # Find/query documents with filters
│   │   ├── updateDocument.ts   # Update a document by ID
│   │   ├── deleteDocument.ts   # Delete a document by ID
│   │   └── listCollections.ts  # List all MongoDB collections
│   ├── project/tools/
│   │   └── listProjects.ts     # List all projects
│   └── capability/tools/
│       ├── getCapabilityDependencies.ts  # Get dependency tree for a capability node
│       ├── analyzeCapabilityImpact.ts    # Analyze impact of changing a capability
│       └── getImplementationOrder.ts     # Topological sort for optimal build order
│
└── tools/
    └── index.ts                # Tool registry — aggregates all module tools into a single array
```

## Tool Pattern

Every tool file exports:
1. A **Zod schema** defining the input parameters
2. A **handler function** that calls `apiService` and returns MCP-formatted responses

```typescript
// Pattern for every tool:
import { apiService } from '../../../core/services/api.service.js';
import { z } from 'zod';

export const myToolSchema = z.object({ /* params */ });
export async function myTool(args: z.infer<typeof myToolSchema>) {
  const result = await apiService.someMethod(args);
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
}
```

## API Routing (inside api.service.ts)

The API service maps collection-based operations to REST endpoints on h2bis-pb-api:

| Collection | Endpoint Pattern |
|-----------|-----------------|
| `use_cases` | `/api/use-cases/mcp/{action}` |
| `projects` | `/api/projects/mcp/{action}` |
| `capabilities` | `/api/capabilities/{action}` |

Graph endpoints: `GET /api/capabilities/:id/dependencies`, `GET /api/capabilities/:id/impact`, `POST /api/capabilities/order`

## 9 Registered Tools

| # | Tool Name | Module | Description |
|---|-----------|--------|-------------|
| 1 | `insertDocument` | knowledge | Insert a document into a MongoDB collection |
| 2 | `findDocument` | knowledge | Find documents with query filters |
| 3 | `updateDocument` | knowledge | Update a document by ID |
| 4 | `deleteDocument` | knowledge | Delete a document by ID |
| 5 | `listCollections` | knowledge | List all MongoDB collections |
| 6 | `listProjects` | project | List all projects |
| 7 | `getCapabilityDependencies` | capability | Get dependency tree with configurable depth |
| 8 | `analyzeCapabilityImpact` | capability | Analyze change impact on a capability |
| 9 | `getImplementationOrder` | capability | Calculate optimal implementation order |

## Import Conventions

- **All imports use `.js` extension** (ESM module resolution)
- **Tool → API service:** `import { apiService } from '../../../core/services/api.service.js'`
- **Core files use relative imports** between each other
- **External packages:** `@modelcontextprotocol/sdk`, `zod`, `dotenv`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Protocol | Model Context Protocol (MCP) via stdio transport |
| SDK | @modelcontextprotocol/sdk 1.24.3 |
| HTTP | Native fetch (wrapped in HttpClient) |
| Validation | Zod |
| Auth | Auto-login to h2bis-pb-api (JWT) |
| Build | tsc → dist/ |

# H2BIS ProjectBrain — AI Agent Context

This file is automatically loaded by GitHub Copilot Chat in every session.
It provides the context needed for AI agents to work effectively with this project
without requiring manual re-explanation and without duplicating config in spawn files.

---

## Project Overview

**h2bis-pb** (ProjectBrain) is a software development lifecycle management platform
that helps manage use cases, capabilities, and project knowledge.

### Modules

| Folder | Role | Port |
|---|---|---|
| `h2bis-pb-api` | REST API backend (Express, MongoDB) | 4000 |
| `h2bis-pb-mcp` | MCP server for AI agents (stdio transport) | — |
| `h2bis-pb-web` | Next.js frontend | 3000 |
| `h2bis-pb-ai` | LLM agent pipeline (intent extraction, transformation) | — |

---

## Architecture

```
AI Agent (Copilot / Claude / Cursor)
    ↓ MCP Protocol (stdio)
h2bis-pb-mcp
    ↓ HTTP REST (API_BASE_URL = http://localhost:4000)
h2bis-pb-api
    ↓
MongoDB (h2bis-project-brain)
```

**The MCP server never connects to MongoDB directly.** All data access goes through
the REST API. The API owns the database connection and enforces auth/validation.

---

## Database

- **Engine**: MongoDB
- **Database name**: `h2bis-project-brain`
- **Connection**: `mongodb://localhost:27017/` (local, default port)
- **Managed by**: `h2bis-pb-api` exclusively

### Collections

| Collection | Contents |
|---|---|
| `projects` | Project records (id, name, description, lifecycle, metadata) |
| `use_cases` | Use case records linked to a project via `projectId` |
| `capabilities` | Capability graph nodes (auto-generated from use cases) |
| `features` | Feature records |

---

## MCP Tools Available

### Knowledge / Document Tools (route through API)
- `findDocument(collectionName, filter)` — query any supported collection
- `insertDocument(collectionName, json)` — insert a document; triggers capability generation for use_cases
- `updateDocument(collectionName, filter, update)` — update by id/key
- `deleteDocument(collectionName, filter)` — delete by id/key
- `listCollections()` — returns supported collection names

### Project Tools
- `getProjectList()` — lightweight id+name list (use this first)
- `getProjectById(projectId)` — full project detail
- `listProjects(status?, limit?, offset?)` — paginated list with filter
- `createProject(...)` — create new project
- `updateProject(projectId, ...)` — update project fields

### Capability Graph Tools
- `getCapabilityDependencies(nodeId, depth?)` — dependency traversal
- `analyzeCapabilityImpact(nodeId)` — impact analysis
- `getImplementationOrder(nodeIds[])` — topological sort

---

## Configuration Ownership

| Variable | Owner | File |
|---|---|---|
| `MONGODB_URI` | API only | `h2bis-pb-api/.env` |
| `DB_NAME` | API only | `h2bis-pb-api/.env` |
| `PORT` | API only | `h2bis-pb-api/.env` |
| `JWT_ACCESS_SECRET` | API only | `h2bis-pb-api/.env` |
| `API_BASE_URL` | MCP only | `h2bis-pb-mcp/.env` |
| `API_KEY` | MCP only | `h2bis-pb-mcp/.env` |
| `NODE_ENV` | Each module | respective `.env` |

**Rule**: `.env` files are the single source of truth for all runtime values.
MCP spawn configs (`.vscode/mcp.json`, `.mcp.json`, `settings.json`) only contain
`command` and `args` — never secrets or duplicated env vars.

---

## MCP Spawn Config Locations

| File | Used by |
|---|---|
| `.vscode/mcp.json` | GitHub Copilot Chat (primary) |
| `.vscode/settings.json` | Legacy `mcp.servers` + Antigravity extension |
| `.mcp.json` | Claude Code CLI, Claude Desktop |

All three point to: `node c:/My_work/RnD/h2bis-pb/h2bis-pb-mcp/dist/index.js`
Runtime config is loaded automatically from `h2bis-pb-mcp/.env` via dotenv.

---

## Authentication

MCP agents authenticate to the API using an **API Key** (`X-API-Key` header).
The key is stored in `h2bis-pb-mcp/.env` as `API_KEY`.

Fallback chain: API Key → JWT token → email/password login → unauthenticated.

---

## Common Tasks for AI Agents

- **List all projects**: use `getProjectList()` first, then `getProjectById()` for detail
- **Find use cases for a project**: `findDocument("use_cases", {"projectId": "<id>"})` 
- **Create a use case**: `insertDocument("use_cases", <json>)` — capability is auto-generated
- **Find a project by name**: `findDocument("projects", {"name": "<name>"})`

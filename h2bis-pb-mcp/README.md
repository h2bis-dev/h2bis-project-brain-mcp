# H2BIS ProjectBrain MCP Server

Connect AI agents to [H2BIS ProjectBrain](https://github.com/h2bis-dev/h2bis-project-brain-mcp) — a software development lifecycle management platform for managing projects, use cases, capabilities, and project knowledge.

## Features

- **Project Management** — Create, list, update, and query projects
- **Use Case Management** — Create and manage use cases linked to projects with auto-generated capabilities
- **Capability Graph** — Traverse dependencies, analyze impact, and get implementation order
- **Domain Model** — Upsert and manage project domain models
- **AI Enhancement** — Enhance use cases with AI-powered suggestions

## Installation

### VS Code (Copilot Chat)

Search for `h2bis` in the Extensions view (`Ctrl+Shift+X`) with the `@mcp` filter, or add manually to `.vscode/mcp.json`:

```json
{
  "servers": {
    "h2bis-pb-mcp": {
      "command": "npx",
      "args": ["-y", "h2bis-mcp"],
      "env": {
        "API_BASE_URL": "http://localhost:4000"
      }
    }
  }
}
```

### Claude Desktop

Add to your Claude Desktop config:

```json
{
  "mcpServers": {
    "h2bis-pb-mcp": {
      "command": "npx",
      "args": ["-y", "h2bis-mcp"],
      "env": {
        "API_BASE_URL": "http://localhost:4000"
      }
    }
  }
}
```

## Configuration

| Variable | Required | Description |
|---|---|---|
| `API_BASE_URL` | Yes | H2BIS ProjectBrain API base URL (e.g. `http://localhost:4000`) |
| `API_KEY` | No | API key for authentication |

## Available Tools

| Tool | Description |
|---|---|
| `listProjects` | List all projects with optional filtering |
| `getProjectById` | Get full project details by ID |
| `createProject` | Create a new project |
| `updateProject` | Update project fields |
| `listUseCases` | List use cases for a project |
| `getUseCaseById` | Get use case details |
| `createUseCase` | Create a use case (auto-generates capabilities) |
| `updateUseCase` | Update a use case |
| `deleteUseCase` | Delete a use case |
| `enhanceUseCase` | Enhance a use case with AI suggestions |
| `upsertProjectDomainModel` | Create or update a project's domain model |
| `removeProjectDomainModel` | Remove a project's domain model |

## Prerequisites

- [H2BIS ProjectBrain API](https://github.com/h2bis-dev/h2bis-project-brain-mcp) running and accessible
- Node.js 18+

## License

MIT

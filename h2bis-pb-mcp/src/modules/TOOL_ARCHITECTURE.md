# MCP Tool Architecture

Each domain lives in `src/modules/<domain>/` with three layers:

```
schemas/   ← Zod input validation (no logic)
services/  ← All HTTP calls via apiService (no formatting)
tools/     ← Thin handlers: call service → format MCP response
index.ts   ← Barrel: exports a tools[] array (name, description, schema, handler)
```

`src/tools/index.ts` spreads each module barrel:
```ts
export const tools = [...projectTools, ...otherModuleTools];
```

## Adding a new tool

1. **Schema** — add a `z.object({})` export to `schemas/<domain>.schemas.ts`
2. **Service** — add an async function to `services/<domain>.service.ts` that calls `apiService.get/post/put/delete`
3. **Handler** — create `tools/<toolName>.ts`; import schema + service; return `{ content: [{ type: 'text', text }] }`
4. **Register** — add `{ name, description, schema, handler }` to `index.ts`

> See `modules/project/` as the reference implementation.

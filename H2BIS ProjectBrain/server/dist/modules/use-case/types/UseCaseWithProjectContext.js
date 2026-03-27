/**
 * UseCaseWithProjectContext
 *
 * A composite model returned by the `getUseCaseWithProjectContext` MCP tool.
 * It bundles the fully-typed use case document together with the complete project
 * record so that an AI agent implementing a software feature has all the context
 * it needs — what to build (use case) and how to build it (project context).
 *
 * All interfaces are kept in strict 1-to-1 alignment with the h2bis-pb-api schemas:
 *  - Project  → ProjectResponseDto  / ProjectDocument  (project.dto.ts / project_schema.ts)
 *  - Use Case → UseCaseDetailResponseDto               (use-case.dto.ts)
 *
 * No fields are omitted from either side.
 */
export {};
//# sourceMappingURL=UseCaseWithProjectContext.js.map
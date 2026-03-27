import type { ProjectResponse, CreateProjectRequest, UpdateProjectRequest, UpsertDomainModelRequest } from '../types/project.types.js';
/**
 * ProjectService
 *
 * Single responsibility: own all HTTP interactions for the project domain.
 * Tool handlers must never contain endpoint strings — they call this service.
 *
 * Follows the Dependency Inversion principle: handlers depend on this
 * abstraction; the underlying HTTP client is injected via apiService.
 */
export interface ProjectListResult {
    projects: ProjectResponse[];
    total: number;
}
/**
 * List projects from the API and apply optional status filter + pagination
 * in the client (the MCP list endpoint returns all active projects at once).
 */
export declare function listProjects(status?: string, limit?: number, offset?: number): Promise<ProjectListResult>;
/**
 * Retrieve a single project by its ID.
 * Returns null when the project is not found (404 treated gracefully).
 */
export declare function getProjectById(projectId: string): Promise<ProjectResponse | null>;
/**
 * Create a new project.
 */
export declare function createProject(payload: CreateProjectRequest): Promise<ProjectResponse>;
/**
 * Update an existing project.
 */
export declare function updateProject(projectId: string, payload: UpdateProjectRequest): Promise<ProjectResponse>;
/**
 * Add or replace a domain model entry in a project's domain catalog.
 */
export declare function upsertDomainModel(projectId: string, modelPayload: UpsertDomainModelRequest): Promise<void>;
/**
 * Remove a domain model entry from a project's domain catalog.
 */
export declare function removeDomainModel(projectId: string, modelName: string): Promise<void>;
//# sourceMappingURL=project.service.d.ts.map
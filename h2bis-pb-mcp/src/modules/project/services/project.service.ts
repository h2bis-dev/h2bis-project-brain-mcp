import { apiService } from '../../../core/services/api.service.js';
import type {
    ProjectResponse,
    CreateProjectRequest,
    UpdateProjectRequest,
    UpsertDomainModelRequest,
} from '../types/project.types.js';

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

// ── Service methods ────────────────────────────────────────────────────────

/**
 * List projects from the API and apply optional status filter + pagination
 * in the client (the MCP list endpoint returns all active projects at once).
 */
export async function listProjects(
    status?: string,
    limit: number = 50,
    offset: number = 0,
): Promise<ProjectListResult> {
    const result = await apiService.get<{ data: { projects: ProjectResponse[] } }>('/api/projects/mcp/list');
    const allProjects: ProjectResponse[] = result?.data?.projects ?? [];

    const filtered = status
        ? allProjects.filter(p => p.status === status)
        : allProjects;

    return {
        projects: filtered.slice(offset, offset + limit),
        total: filtered.length,
    };
}

/**
 * Retrieve a single project by its ID.
 * Returns null when the project is not found (404 treated gracefully).
 */
export async function getProjectById(projectId: string): Promise<ProjectResponse | null> {
    try {
        const result = await apiService.get<{ success: boolean; data: ProjectResponse }>(`/api/projects/mcp/find/${projectId}`);
        return result?.data ?? null;
    } catch {
        return null;
    }
}

/**
 * Create a new project.
 */
export async function createProject(payload: CreateProjectRequest): Promise<ProjectResponse> {
    const result = await apiService.post<{ success: boolean; data: ProjectResponse }>('/api/projects/mcp/create', payload);
    return result.data;
}

/**
 * Update an existing project.
 */
export async function updateProject(
    projectId: string,
    payload: UpdateProjectRequest,
): Promise<ProjectResponse> {
    const result = await apiService.put<{ success: boolean; data: ProjectResponse }>(`/api/projects/${projectId}`, payload);
    return result.data;
}

/**
 * Add or replace a domain model entry in a project's domain catalog.
 */
export async function upsertDomainModel(
    projectId: string,
    modelPayload: UpsertDomainModelRequest,
): Promise<void> {
    await apiService.put(`/api/projects/mcp/domain-catalog/${projectId}`, modelPayload);
}

/**
 * Remove a domain model entry from a project's domain catalog.
 */
export async function removeDomainModel(
    projectId: string,
    modelName: string,
): Promise<void> {
    await apiService.delete(
        `/api/projects/mcp/domain-catalog/${projectId}/${encodeURIComponent(modelName)}`,
    );
}


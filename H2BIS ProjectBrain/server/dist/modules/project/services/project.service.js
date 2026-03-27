import { apiService } from '../../../core/services/api.service.js';
// ── Service methods ────────────────────────────────────────────────────────
/**
 * List projects from the API and apply optional status filter + pagination
 * in the client (the MCP list endpoint returns all active projects at once).
 */
export async function listProjects(status, limit = 50, offset = 0) {
    const result = await apiService.get('/api/projects/mcp/list');
    const allProjects = result?.data?.projects ?? [];
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
export async function getProjectById(projectId) {
    try {
        const result = await apiService.get(`/api/projects/mcp/find/${projectId}`);
        return result?.data ?? null;
    }
    catch {
        return null;
    }
}
/**
 * Create a new project.
 */
export async function createProject(payload) {
    const result = await apiService.post('/api/projects/mcp/create', payload);
    return result.data;
}
/**
 * Update an existing project.
 */
export async function updateProject(projectId, payload) {
    const result = await apiService.put(`/api/projects/${projectId}`, payload);
    return result.data;
}
/**
 * Add or replace a domain model entry in a project's domain catalog.
 */
export async function upsertDomainModel(projectId, modelPayload) {
    await apiService.put(`/api/projects/mcp/domain-catalog/${projectId}`, modelPayload);
}
/**
 * Remove a domain model entry from a project's domain catalog.
 */
export async function removeDomainModel(projectId, modelName) {
    await apiService.delete(`/api/projects/mcp/domain-catalog/${projectId}/${encodeURIComponent(modelName)}`);
}
//# sourceMappingURL=project.service.js.map
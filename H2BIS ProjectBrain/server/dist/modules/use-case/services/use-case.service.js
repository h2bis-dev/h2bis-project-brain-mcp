import { apiService } from '../../../core/services/api.service.js';
// ── Service methods ────────────────────────────────────────────────────────
/**
 * List use cases from the API and apply optional filters + pagination.
 * Supports filtering by projectId.
 */
export async function listUseCases(projectId, limit = 50, offset = 0) {
    const endpoint = projectId
        ? `/api/use-cases/mcp/list?projectId=${encodeURIComponent(projectId)}`
        : '/api/use-cases/mcp/list';
    // The use-case controller returns a raw array (no { success, data } envelope)
    const result = await apiService.get(endpoint);
    const allUseCases = Array.isArray(result) ? result : [];
    return {
        useCases: allUseCases.slice(offset, offset + limit),
        total: allUseCases.length,
    };
}
/**
 * Retrieve a single use case by its ID.
 * Returns null when the use case is not found (404 treated gracefully).
 */
export async function getUseCaseById(useCaseId) {
    try {
        return await apiService.get(`/api/use-cases/mcp/find/${useCaseId}`);
    }
    catch {
        return null;
    }
}
/**
 * Create a new use case.
 * Automatically triggers capability generation if projectId is provided.
 */
export async function createUseCase(payload) {
    return apiService.post('/api/use-cases/mcp/create', payload);
}
/**
 * Update an existing use case.
 */
export async function updateUseCase(useCaseId, payload) {
    return apiService.put(`/api/use-cases/mcp/update/${useCaseId}`, payload);
}
/**
 * Delete a use case (soft delete).
 */
export async function deleteUseCase(useCaseId) {
    await apiService.delete(`/api/use-cases/mcp/delete/${useCaseId}`);
}
/**
 * Enhance a use case using AI.
 * Fills in missing sections based on the current use case data.
 */
export async function enhanceUseCase(payload) {
    return apiService.post('/api/use-cases/mcp/enhance', payload);
}
/**
 * Update a use case with AI-driven changes based on natural language instructions.
 * Optionally preserves human edits.
 */
export async function updateUseCaseWithAI(payload) {
    return apiService.post('/api/use-cases/mcp/update-with-ai', payload);
}
//# sourceMappingURL=use-case.service.js.map
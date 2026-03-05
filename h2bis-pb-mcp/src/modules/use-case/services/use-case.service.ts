import { apiService } from '../../../core/services/api.service.js';
import type {
    UseCaseResponse,
    UseCaseListResponse,
    CreateUseCaseRequest,
    UpdateUseCaseRequest,
    EnhanceUseCaseRequest,
    UpdateWithAIRequest,
} from '../types/use-case.types.js';

/**
 * UseCaseService
 *
 * Single responsibility: own all HTTP interactions for the use case domain.
 * Tool handlers must never contain endpoint strings — they call this service.
 *
 * Follows the Dependency Inversion principle: handlers depend on this
 * abstraction; the underlying HTTP client is injected via apiService.
 */

export interface UseCaseListResult {
    useCases: UseCaseResponse[];
    total: number;
}

// ── Service methods ────────────────────────────────────────────────────────

/**
 * List use cases from the API and apply optional filters + pagination.
 * Supports filtering by projectId.
 */
export async function listUseCases(
    projectId?: string,
    limit: number = 50,
    offset: number = 0,
): Promise<UseCaseListResult> {
    const endpoint = projectId 
        ? `/api/use-cases/mcp/list?projectId=${encodeURIComponent(projectId)}`
        : '/api/use-cases/mcp/list';
    
    const result = await apiService.get<{ data: { useCases: UseCaseResponse[] } }>(endpoint);
    const allUseCases: UseCaseResponse[] = result?.data?.useCases ?? [];

    return {
        useCases: allUseCases.slice(offset, offset + limit),
        total: allUseCases.length,
    };
}

/**
 * Retrieve a single use case by its ID.
 * Returns null when the use case is not found (404 treated gracefully).
 */
export async function getUseCaseById(useCaseId: string): Promise<UseCaseResponse | null> {
    try {
        return await apiService.get<UseCaseResponse>(`/api/use-cases/mcp/find/${useCaseId}`);
    } catch {
        return null;
    }
}

/**
 * Create a new use case.
 * Automatically triggers capability generation if projectId is provided.
 */
export async function createUseCase(payload: CreateUseCaseRequest): Promise<UseCaseResponse> {
    return apiService.post<UseCaseResponse>('/api/use-cases/mcp/create', payload);
}

/**
 * Update an existing use case.
 */
export async function updateUseCase(
    useCaseId: string,
    payload: UpdateUseCaseRequest,
): Promise<UseCaseResponse> {
    return apiService.put<UseCaseResponse>(`/api/use-cases/mcp/update/${useCaseId}`, payload);
}

/**
 * Delete a use case (soft delete).
 */
export async function deleteUseCase(useCaseId: string): Promise<void> {
    await apiService.delete(`/api/use-cases/mcp/delete/${useCaseId}`);
}

/**
 * Enhance a use case using AI.
 * Fills in missing sections based on the current use case data.
 */
export async function enhanceUseCase(payload: EnhanceUseCaseRequest): Promise<UseCaseResponse> {
    return apiService.post<UseCaseResponse>('/api/use-cases/mcp/enhance', payload);
}

/**
 * Update a use case with AI-driven changes based on natural language instructions.
 * Optionally preserves human edits.
 */
export async function updateUseCaseWithAI(payload: UpdateWithAIRequest): Promise<UseCaseResponse> {
    return apiService.post<UseCaseResponse>('/api/use-cases/mcp/update-with-ai', payload);
}

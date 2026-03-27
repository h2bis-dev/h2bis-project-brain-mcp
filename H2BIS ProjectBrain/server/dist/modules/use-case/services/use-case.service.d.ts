import type { UseCaseResponse, CreateUseCaseRequest, UpdateUseCaseRequest, EnhanceUseCaseRequest, UpdateWithAIRequest } from '../types/use-case.types.js';
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
/**
 * List use cases from the API and apply optional filters + pagination.
 * Supports filtering by projectId.
 */
export declare function listUseCases(projectId?: string, limit?: number, offset?: number): Promise<UseCaseListResult>;
/**
 * Retrieve a single use case by its ID.
 * Returns null when the use case is not found (404 treated gracefully).
 */
export declare function getUseCaseById(useCaseId: string): Promise<UseCaseResponse | null>;
/**
 * Create a new use case.
 * Automatically triggers capability generation if projectId is provided.
 */
export declare function createUseCase(payload: CreateUseCaseRequest): Promise<UseCaseResponse>;
/**
 * Update an existing use case.
 */
export declare function updateUseCase(useCaseId: string, payload: UpdateUseCaseRequest): Promise<UseCaseResponse>;
/**
 * Delete a use case (soft delete).
 */
export declare function deleteUseCase(useCaseId: string): Promise<void>;
/**
 * Enhance a use case using AI.
 * Fills in missing sections based on the current use case data.
 */
export declare function enhanceUseCase(payload: EnhanceUseCaseRequest): Promise<UseCaseResponse>;
/**
 * Update a use case with AI-driven changes based on natural language instructions.
 * Optionally preserves human edits.
 */
export declare function updateUseCaseWithAI(payload: UpdateWithAIRequest): Promise<UseCaseResponse>;
//# sourceMappingURL=use-case.service.d.ts.map
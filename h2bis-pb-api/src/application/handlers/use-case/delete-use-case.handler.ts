import { useCaseRepository } from '../../../infrastructure/database/repositories/use-case.repository.js';
import { NotFoundError } from '../../../shared/errors/app.error.js';

/**
 * Delete Use Case Handler
 * Deletes a use case from the database (admin only)
 */
export class DeleteUseCaseHandler {
    async execute(id: string): Promise<{ success: boolean; message: string }> {
        // Check if use case exists
        const useCase = await useCaseRepository.findById(id);

        if (!useCase) {
            throw new NotFoundError(`Use case with ID ${id} not found`);
        }

        // Delete the use case
        const deleted = await useCaseRepository.delete(id);

        if (!deleted) {
            throw new Error('Failed to delete use case');
        }

        return {
            success: true,
            message: 'Use case deleted successfully'
        };
    }
}

// Export singleton instance
export const deleteUseCaseHandler = new DeleteUseCaseHandler();

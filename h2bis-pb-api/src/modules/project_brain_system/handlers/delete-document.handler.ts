import { projectBrainSystemRepository } from '../repositories/project_brain_system.repository.js';
import type { DocumentOperationResponseDto, DeleteDocumentRequest } from '../project_brain_system.dto.js';

/**
 * Delete Document Handler
 * Deletes a document from a specified collection
 */
export class DeleteDocumentHandler {
    async execute(request: DeleteDocumentRequest): Promise<DocumentOperationResponseDto> {
        const { collectionName, filter } = request;

        // Delete document via repository
        const deletedCount = await projectBrainSystemRepository.deleteDocument(
            collectionName,
            filter
        );

        // Return response DTO
        return {
            success: true,
            deletedCount,
            message: `Document deleted successfully from ${collectionName}`
        };
    }
}

// Export singleton instance
export const deleteDocumentHandler = new DeleteDocumentHandler();

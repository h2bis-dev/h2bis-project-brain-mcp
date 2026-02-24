import { projectBrainSystemRepository } from '../repositories/project_brain_system.repository.js';
import type { DocumentOperationResponseDto, UpdateDocumentRequest } from '../project_brain_system.dto.js';

/**
 * Update Document Handler
 * Updates a document in a specified collection
 */
export class UpdateDocumentHandler {
    async execute(request: UpdateDocumentRequest): Promise<DocumentOperationResponseDto> {
        const { collectionName, filter, update } = request;

        // Update document via repository
        const modifiedCount = await projectBrainSystemRepository.updateDocument(
            collectionName,
            filter,
            update
        );

        // Return response DTO
        return {
            success: true,
            modifiedCount,
            message: `Document updated successfully in ${collectionName}`
        };
    }
}

// Export singleton instance
export const updateDocumentHandler = new UpdateDocumentHandler();

import { projectBrainSystemRepository } from '../repositories/project_brain_system.repository.js';
import type { DocumentOperationResponseDto, InsertDocumentRequest } from '../project_brain_system.dto.js';

/**
 * Insert Document Handler
 * Inserts a new document into a specified collection
 */
export class InsertDocumentHandler {
    async execute(request: InsertDocumentRequest): Promise<DocumentOperationResponseDto> {
        const { collectionName, document } = request;

        // Insert document via repository
        const documentId = await projectBrainSystemRepository.insertDocument(
            collectionName,
            document
        );

        // Return response DTO
        return {
            success: true,
            documentId,
            message: `Document inserted successfully into ${collectionName}`
        };
    }
}

// Export singleton instance
export const insertDocumentHandler = new InsertDocumentHandler();

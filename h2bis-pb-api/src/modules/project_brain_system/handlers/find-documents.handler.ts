import { projectBrainSystemRepository } from '../repositories/project_brain_system.repository.js';
import type { DocumentsResponseDto, FindDocumentRequest } from '../project_brain_system.dto.js';

/**
 * Find Documents Handler
 * Retrieves documents from a specified collection
 */
export class FindDocumentsHandler {
    async execute(request: FindDocumentRequest): Promise<DocumentsResponseDto> {
        const { collectionName, filter = {}, limit, skip } = request;

        // Fetch documents from repository
        const documents = await projectBrainSystemRepository.findDocuments(
            collectionName,
            filter,
            { limit, skip }
        );

        // Return response DTO
        return {
            documents,
            total: documents.length,
            collectionName
        };
    }
}

// Export singleton instance
export const findDocumentsHandler = new FindDocumentsHandler();

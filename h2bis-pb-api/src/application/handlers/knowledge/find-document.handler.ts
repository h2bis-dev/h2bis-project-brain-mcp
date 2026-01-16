import { knowledgeRepository } from '../../../infrastructure/database/repositories/knowledge.repository.js';
import type { FindDocumentResponseDto } from '../../../api/dtos/knowledge.dto.js';

/**
 * Find Document Use Case
 * Simple pass-through to repository
 */
export class FindDocumentHandler {
    async execute(collectionName: string, filter: any): Promise<FindDocumentResponseDto> {
        const document = await knowledgeRepository.findOne(collectionName, filter);

        return {
            document
        };
    }
}

// Export singleton instance
export const findDocumentHandler = new FindDocumentHandler();

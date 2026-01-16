import { knowledgeRepository } from '../../../infrastructure/database/repositories/knowledge.repository.js';
import type { ListCollectionsResponseDto } from '../../../api/dtos/knowledge.dto.js';

/**
 * List Collections Use Case
 * Returns all collection names in the database
 */
export class ListCollectionsHandler {
    async execute(): Promise<ListCollectionsResponseDto> {
        const collections = await knowledgeRepository.listCollections();

        return {
            collections
        };
    }
}

// Export singleton instance
export const listCollectionsHandler = new ListCollectionsHandler();

import { projectBrainSystemRepository } from '../repositories/project_brain_system.repository.js';
import type { CollectionsResponseDto } from '../project_brain_system.dto.js';

/**
 * List Collections Handler
 * Retrieves all collections from the database
 */
export class ListCollectionsHandler {
    async execute(includeSystem?: boolean): Promise<CollectionsResponseDto> {
        // Fetch collections from repository
        const collections = await projectBrainSystemRepository.listCollections(includeSystem);

        // Return response DTO
        return {
            collections,
            total: collections.length
        };
    }
}

// Export singleton instance
export const listCollectionsHandler = new ListCollectionsHandler();

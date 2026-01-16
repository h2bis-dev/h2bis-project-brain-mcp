import { knowledgeRepository } from '../../../infrastructure/database/repositories/knowledge.repository.js';
import { capabilityRepository } from '../../../infrastructure/database/repositories/capability.repository.js';
import type { DeleteDocumentResponseDto } from '../../../api/dtos/knowledge.dto.js';

/**
 * Delete Document Use Case
 * Handles document deletion with automatic capability cleanup
 */
export class DeleteDocumentHandler {
    async execute(collectionName: string, filter: any): Promise<DeleteDocumentResponseDto> {
        // Get documents before deleting to check for capabilities
        const documentsToDelete = await knowledgeRepository.find(collectionName, filter);

        // Delete documents
        const result = await knowledgeRepository.deleteMany(collectionName, filter);

        // AUTO-DELETE CAPABILITIES
        let capabilitiesDeleted = 0;

        for (const doc of documentsToDelete) {
            if ('type' in doc && 'key' in doc && (doc.type === 'use_case' || doc.type === 'feature')) {
                const capabilityId = `cap-${doc.key}`;

                try {
                    const deleted = await capabilityRepository.delete(capabilityId);
                    if (deleted) {
                        capabilitiesDeleted++;
                        console.log(`✅ Auto-deleted capability ${capabilityId}`);
                    }
                } catch (error) {
                    console.warn(`⚠️ Failed to auto-delete capability ${capabilityId}:`, error);
                }
            }
        }

        return {
            deletedCount: result.deletedCount,
            capabilitiesDeleted
        };
    }
}

// Export singleton instance
export const deleteDocumentHandler = new DeleteDocumentHandler();

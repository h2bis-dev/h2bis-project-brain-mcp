import { knowledgeRepository } from '../../../infrastructure/database/repositories/knowledge.repository.js';
import { capabilityRepository } from '../../../infrastructure/database/repositories/capability.repository.js';
import { EntitySchema } from '../../../domain/schemas/entity_schema.js';
import { HandlerSchema } from '../../../domain/schemas/use_case_schema.js';
import { FeatureSchema } from '../../../domain/schemas/features_schema.js';
import { transformationService } from '../../../domain/services/transformation.service.js';
import type { UpdateDocumentResponseDto } from '../../../api/dtos/knowledge.dto.js';

/**
 * Update Document Use Case
 * Handles full document replacement with automatic capability update
 */
export class UpdateDocumentHandler {
    async execute(
        collectionName: string,
        filter: any,
        document: any
    ): Promise<UpdateDocumentResponseDto> {
        // Validate entity schema
        const validatedEntity = EntitySchema.parse(document);

        // Replace document with validated entity
        const result = await knowledgeRepository.replaceOne(collectionName, filter, validatedEntity);

        // AUTO-UPDATE CAPABILITY (if entity is Handler or Feature)
        let capabilityUpdated = false;

        if ('type' in validatedEntity && 'key' in validatedEntity) {
            const capabilityId = `cap-${(validatedEntity as any).key}`;

            // Check if corresponding capability exists
            const existingCapability = await capabilityRepository.findById(capabilityId);

            if (existingCapability) {
                if ((validatedEntity as any).type === 'use_case') {
                    const HandlerResult = HandlerSchema.safeParse(validatedEntity);

                    if (HandlerResult.success) {
                        try {
                            // Use LLM-based transformation
                            const updatedCapability = await transformationService.transformHandlerToCapabilityWithIntent(
                                HandlerResult.data,
                                { generateId: false } // Keep existing ID
                            );

                            // Update capability
                            await capabilityRepository.update(capabilityId, updatedCapability);
                            capabilityUpdated = true;
                            console.log(`✅ Auto-updated capability ${capabilityId} from use case update`);
                        } catch (error) {
                            console.warn(`⚠️ Failed to auto-update capability:`, error);
                        }
                    }
                } else if ((validatedEntity as any).type === 'feature') {
                    const featureResult = FeatureSchema.safeParse(validatedEntity);

                    if (featureResult.success) {
                        try {
                            const updatedCapability = transformationService.transformFeatureToCapability(featureResult.data);

                            await capabilityRepository.update(capabilityId, updatedCapability);
                            capabilityUpdated = true;
                            console.log(`✅ Auto-updated capability ${capabilityId} from feature update`);
                        } catch (error) {
                            console.warn(`⚠️ Failed to auto-update capability:`, error);
                        }
                    }
                }
            }
        }

        return {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            capabilityUpdated
        };
    }
}

// Export singleton instance
export const updateDocumentHandler = new UpdateDocumentHandler();

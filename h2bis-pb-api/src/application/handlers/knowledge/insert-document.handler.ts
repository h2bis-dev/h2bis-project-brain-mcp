import { knowledgeRepository } from '../../../infrastructure/database/repositories/knowledge.repository.js';
import { EntitySchema } from '../../../domain/schemas/entity_schema.js';
import { HandlerSchema } from '../../../domain/schemas/use_case_schema.js';
import { FeatureSchema } from '../../../domain/schemas/features_schema.js';
import {
    generateCapabilityFromHandlerHandler,
    generateCapabilityFromFeatureHandler
} from '../capability/generate-capability.handler.js';
import type { InsertDocumentResponseDto } from '../../../api/dtos/knowledge.dto.js';

/**
 * Insert Document Use Case
 * Handles document insertion with automatic capability generation for use cases and features
 */
export class InsertDocumentHandler {
    async execute(
        collectionName: string,
        document: any
    ): Promise<InsertDocumentResponseDto> {
        // Validate entity schema
        const validatedEntity = EntitySchema.parse(document);

        // Insert validated entity into database
        const result = await knowledgeRepository.insertOne(collectionName, validatedEntity);

        // AUTO-GENERATE CAPABILITY (if entity is Handler or Feature)
        console.log('🔍 Checking for capability auto-generation...');
        console.log('   Entity has "type" field:', 'type' in validatedEntity);

        if (!('type' in validatedEntity)) {
            console.log('ℹ️  Entity does not have "type" field, skipping auto-generation');
            return {
                insertedId: result.insertedId.toString(),
                capabilityGenerated: false
            };
        }

        console.log('Entity type:', (validatedEntity as any).type);

        // Handle Handler
        if ((validatedEntity as any).type === 'use_case') {
            const HandlerResult = HandlerSchema.safeParse(validatedEntity);

            if (HandlerResult.success) {
                const capabilityResult = await generateCapabilityFromHandlerHandler.execute(HandlerResult.data);

                if (capabilityResult.mode === 'REJECTED' && capabilityResult.insufficiencyReport) {
                    // Normative use case was incomplete
                    return {
                        insertedId: result.insertedId.toString(),
                        capabilityGenerated: false,
                        mode: 'REJECTED',
                        insufficiencyReport: capabilityResult.insufficiencyReport
                    };
                }

                if (capabilityResult.mode === 'REJECTED' && capabilityResult.validationReport) {
                    // Validation failed after retries
                    return {
                        insertedId: result.insertedId.toString(),
                        capabilityGenerated: false,
                        mode: 'REJECTED',
                        validationReport: capabilityResult.validationReport
                    };
                }

                return {
                    insertedId: result.insertedId.toString(),
                    capabilityGenerated: capabilityResult.generated,
                    capabilityId: capabilityResult.capabilityId,
                    mode: capabilityResult.mode
                };
            } else {
                console.warn('⚠️ Handler validation failed:', HandlerResult.error.errors);
            }
        }

        // Handle Feature
        else if ((validatedEntity as any).type === 'feature') {
            const featureResult = FeatureSchema.safeParse(validatedEntity);

            if (featureResult.success) {
                const capabilityResult = await generateCapabilityFromFeatureHandler.execute(featureResult.data);

                return {
                    insertedId: result.insertedId.toString(),
                    capabilityGenerated: capabilityResult.generated,
                    capabilityId: capabilityResult.capabilityId
                };
            } else {
                console.warn('⚠️ Feature validation failed:', featureResult.error.errors);
            }
        } else {
            console.log(`ℹ️  Entity type "${(validatedEntity as any).type}" is not use_case or feature, skipping capability generation`);
        }

        // Default return (no capability generated)
        return {
            insertedId: result.insertedId.toString(),
            capabilityGenerated: false
        };
    }
}

// Export singleton instance
export const insertDocumentHandler = new InsertDocumentHandler();

import type { UseCase } from '../../../core/schemas/use_case_schema.js';
import { UseCaseGenerationAgent } from 'h2bis-pb-ai';
import type { UseCaseGenerationInput } from 'h2bis-pb-ai';
import type { UpdateWithAIRequestDto, UpdateWithAIResponseDto } from '../use-case.dto.js';
import { useCaseRepository } from '../repositories/use-case.repository.js';
import { NotFoundError } from '../../../core/errors/app.error.js';

/**
 * Update Use Case with AI Handler
 * Uses AI to generate an updated use case while respecting project-level constraints.
 * Automatically saves the AI-generated changes to the database.
 */
export class UpdateWithAIHandler {
    private agent: UseCaseGenerationAgent;

    constructor() {
        this.agent = new UseCaseGenerationAgent();
    }

    async execute(dto: UpdateWithAIRequestDto): Promise<UpdateWithAIResponseDto> {
        // Fetch existing use case
        const existing = await useCaseRepository.findById(dto.useCaseId);
        if (!existing) {
            throw new NotFoundError(`Use case with ID ${dto.useCaseId} not found`);
        }

        // Build description with project context constraints
        let description = dto.instructions;

        // Inject project context as constraints so AI doesn't conflict
        if (dto.projectContext) {
            const ctx = dto.projectContext;
            const constraints: string[] = [];

            if (ctx.name) constraints.push(`Project: ${ctx.name}`);
            if (ctx.language) constraints.push(`Language: ${ctx.language}`);
            if (ctx.framework) constraints.push(`Framework: ${ctx.framework}`);
            if (ctx.techStack?.length) constraints.push(`Tech Stack: ${ctx.techStack.join(', ')}`);
            if (ctx.architectureStyle) constraints.push(`Architecture Style: ${ctx.architectureStyle}`);
            if (ctx.architectureOverview) constraints.push(`Architecture Overview: ${ctx.architectureOverview}`);

            if (ctx.standards) {
                if (ctx.standards.codingStyle?.guide) constraints.push(`Coding Style Guide: ${ctx.standards.codingStyle.guide}`);
                if (ctx.standards.namingConventions?.length) constraints.push(`Naming Conventions: ${ctx.standards.namingConventions.join(', ')}`);
                if (ctx.standards.errorHandling?.length) constraints.push(`Error Handling Patterns: ${ctx.standards.errorHandling.join(', ')}`);
            }

            if (ctx.qualityGates) {
                if (ctx.qualityGates.testTypes?.length) constraints.push(`Required Test Types: ${ctx.qualityGates.testTypes.join(', ')}`);
                if (ctx.qualityGates.definitionOfDone?.length) constraints.push(`Definition of Done: ${ctx.qualityGates.definitionOfDone.join(', ')}`);
            }

            if (ctx.authStrategy?.approach) constraints.push(`Auth Strategy: ${ctx.authStrategy.approach}`);

            if (ctx.domainCatalog?.length) {
                const entityNames = ctx.domainCatalog.map(e => e.name).join(', ');
                constraints.push(`Existing Domain Entities: ${entityNames}`);
            }

            if (constraints.length > 0) {
                description += `\n\n--- PROJECT CONSTRAINTS (Do NOT contradict these) ---\n${constraints.join('\n')}`;
            }
        }

        if (dto.fieldsToUpdate && dto.fieldsToUpdate.length > 0) {
            description += `\n\nFocus on updating these specific fields: ${dto.fieldsToUpdate.join(', ')}`;
        }

        // Strip _id and audit from existingData to keep AI input clean
        const { _id, audit, ...existingData } = existing as any;

        const input: UseCaseGenerationInput = {
            description,
            existingData,
        };

        console.log(`[UpdateWithAIHandler] Generating AI update for use case: ${existing.key}`);
        console.log(`[UpdateWithAIHandler] Instructions: ${dto.instructions.substring(0, 200)}...`);
        console.log(`[UpdateWithAIHandler] Project context provided: ${!!dto.projectContext}`);

        const result = await this.agent.generate(input);

        console.log(`[UpdateWithAIHandler] AI generation complete for ${existing.key}, ${result.generatedFields.length} fields updated`);

        // Sanitize AI-generated data to ensure valid enum values
        const sanitizedUseCase = this.sanitizeAIGeneratedData(result.useCase);

        // Merge AI-generated fields with existing use case
        const merged = {
            ...existing,
            ...sanitizedUseCase,
            // Preserve key and ID
            key: existing.key,
            projectId: existing.projectId,
            // Update status to reflect AI modification
            status: {
                ...existing.status,
                generatedByAI: true,
                reviewedByHuman: false,
            },
            // Update audit trail
            audit: {
                createdAt: existing.audit?.createdAt || new Date(),
                createdBy: existing.audit?.createdBy || 'system',
                updatedAt: new Date(),
                updatedBy: 'ai-system',
            },
        };

        // Remove _id from merged to avoid conflicts (repository adds it back)
        delete (merged as any)._id;

        // Save the updated use case to the database
        await useCaseRepository.update(dto.useCaseId, merged as any);

        console.log(`[UpdateWithAIHandler] Use case ${existing.key} saved to database`);

        // Return the updated use case data with metadata
        return {
            useCase: sanitizedUseCase as unknown as Partial<UseCase>,
            updatedFields: result.generatedFields,
            confidence: result.confidence,
        };
    }

    /**
     * Sanitize AI-generated data to ensure valid enum values
     */
    private sanitizeAIGeneratedData(data: any): any {
        const sanitized = { ...data };

        // Sanitize aiMetadata.estimatedComplexity
        if (sanitized.aiMetadata?.estimatedComplexity) {
            const complexity = sanitized.aiMetadata.estimatedComplexity;
            if (!['low', 'medium', 'high'].includes(complexity)) {
                console.warn(`[UpdateWithAIHandler] Invalid estimatedComplexity: "${complexity}", defaulting to "medium"`);
                sanitized.aiMetadata.estimatedComplexity = 'medium';
            }
        }

        // Sanitize status.lifecycle
        if (sanitized.status?.lifecycle) {
            const validLifecycles = ['idea', 'planned', 'in_development', 'ai_generated', 'human_reviewed', 'completed'];
            if (!validLifecycles.includes(sanitized.status.lifecycle)) {
                console.warn(`[UpdateWithAIHandler] Invalid lifecycle: "${sanitized.status.lifecycle}", defaulting to "ai_generated"`);
                sanitized.status.lifecycle = 'ai_generated';
            }
        }

        // Sanitize interfaces.type
        if (sanitized.interfaces?.type) {
            const validTypes = ['REST', 'GraphQL', 'Event', 'UI'];
            if (!validTypes.includes(sanitized.interfaces.type)) {
                console.warn(`[UpdateWithAIHandler] Invalid interface type: "${sanitized.interfaces.type}", defaulting to "REST"`);
                sanitized.interfaces.type = 'REST';
            }
        }

        // Sanitize quality.testTypes
        if (sanitized.quality?.testTypes && Array.isArray(sanitized.quality.testTypes)) {
            const validTestTypes = ['unit', 'integration', 'e2e', 'security'];
            sanitized.quality.testTypes = sanitized.quality.testTypes.filter((type: string) => {
                if (validTestTypes.includes(type)) {
                    return true;
                }
                console.warn(`[UpdateWithAIHandler] Removing invalid test type: "${type}"`);
                return false;
            });
        }

        return sanitized;
    }
}

// Export singleton instance
export const updateWithAIHandler = new UpdateWithAIHandler();

import { z } from 'zod';
import { getUseCaseWithProjectContextSchema } from '../schemas/useCase.schemas.js';
import * as useCaseService from '../services/use-case.service.js';
import * as projectService from '../../project/services/project.service.js';
import type {
    UseCaseWithProjectContext,
    ProjectContext,
    UseCaseData,
} from '../types/UseCaseWithProjectContext.js';

/**
 * Get Use Case with Project Context
 * 
 * Retrieves a use case and its owning project, combining them into a single
 * composite model with all the context an AI agent needs to implement a feature.
 * 
 * Architecture:
 * - Uses useCaseService.getUseCaseById() (no direct API calls)
 * - Uses projectService.getProjectById() (no direct API calls)
 * - Reuses existing service layer and type definitions
 */
export async function getUseCaseWithProjectContext(
    args: z.infer<typeof getUseCaseWithProjectContextSchema>
): Promise<{ content: { type: string; text: string }[] }> {
    const { useCaseId } = args;

    try {
        // ── 1. Fetch the use case via service ───────────────────────────────
        const useCase = await useCaseService.getUseCaseById(useCaseId);

        if (!useCase) {
            return text(`Use case with ID "${useCaseId}" not found`);
        }

        // ── 2. Resolve the owning project ───────────────────────────────────
        const projectId = useCase.projectId;

        if (!projectId) {
            return text(
                `Use case "${useCaseId}" has no projectId — cannot retrieve project context.\n\n` +
                `Use Case: ${useCase.key} - ${useCase.name}`
            );
        }

        const project = await projectService.getProjectById(projectId);

        if (!project) {
            return text(
                `Project "${projectId}" referenced by use case "${useCaseId}" was not found.\n\n` +
                `Use Case: ${useCase.key} - ${useCase.name}`
            );
        }

        // ── 3. Map to composite model ───────────────────────────────────────
        
        // Both service responses are properly typed and come from the same API
        // The composite model types (UseCaseData, ProjectContext) are compatible
        const result: UseCaseWithProjectContext = {
            useCase: useCase as any as UseCaseData,
            projectContext: project as any as ProjectContext,
        };

        // ── 4. Return composite object ──────────────────────────────────────
        return text(JSON.stringify(result, null, 2));

    } catch (error) {
        return text(
            `Error retrieving use case with project context: ` +
            (error instanceof Error ? error.message : String(error))
        );
    }
}

function text(message: string) {
    return { content: [{ type: 'text', text: message }] };
}

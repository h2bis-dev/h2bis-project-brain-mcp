import { z } from 'zod';
import { getUseCaseWithProjectContextSchema } from '../schemas/useCase.schemas.js';
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
export declare function getUseCaseWithProjectContext(args: z.infer<typeof getUseCaseWithProjectContextSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=getUseCaseWithProjectContext.d.ts.map
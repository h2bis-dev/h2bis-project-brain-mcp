import { z } from 'zod';
import { removeProjectDomainModelSchema } from '../schemas/project.schemas.js';
import * as projectService from '../services/project.service.js';

export async function removeProjectDomainModel(
    args: z.infer<typeof removeProjectDomainModelSchema>,
): Promise<{ content: { type: string; text: string }[] }> {
    try {
        await projectService.removeDomainModel(args.projectId, args.modelName);
        return text(`Domain model '${args.modelName}' removed from project '${args.projectId}'.`);
    } catch (error) {
        return text(`Error removing domain model: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function text(message: string) {
    return { content: [{ type: 'text', text: message }] };
}

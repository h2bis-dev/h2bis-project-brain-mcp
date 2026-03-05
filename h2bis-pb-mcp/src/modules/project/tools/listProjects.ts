import { z } from 'zod';
import { listProjectsSchema } from '../schemas/project.schemas.js';
import * as projectService from '../services/project.service.js';

export async function listProjects(args?: z.infer<typeof listProjectsSchema>) {
    try {
        const { projects, total } = await projectService.listProjects(
            args?.status,
            args?.limit,
            args?.offset,
        );

        if (projects.length === 0) {
            return text('No projects found.');
        }

        const formatted = projects.map(p => ({
            id: p._id,
            name: p.name,
            description: p.description ?? '',
            status: p.status ?? 'active',
            lifecycle: p.lifecycle ?? 'planning',
            owner: p.owner,
            stats: p.stats ?? { useCaseCount: 0, capabilityCount: 0, completionPercentage: 0 },
        }));

        return text(
            `Found ${formatted.length} project(s) (${total} total):\n\n${JSON.stringify(formatted, null, 2)}`,
        );
    } catch (error) {
        return text(`Error listing projects: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function text(message: string) {
    return { content: [{ type: 'text', text: message }] };
}

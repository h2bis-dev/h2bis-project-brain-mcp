import { apiService } from '../../../core/services/api.service.js';
import { z } from 'zod';

export const listProjectsSchema = z.object({});

export async function listProjects() {
    try {
        // Use findDocument to get all projects from the projects collection
        const result = await apiService.findDocument('projects', {});

        if (!result.document) {
            return {
                content: [
                    {
                        type: "text",
                        text: 'No projects found in database',
                    },
                ],
            };
        }

        // Format the projects list
        const projects = Array.isArray(result.document) ? result.document : [result.document];
        const formattedProjects = projects.map((p: any) => ({
            id: p._id,
            name: p.name,
            description: p.description || '',
            status: p.status || 'N/A',
            owner: p.owner || 'N/A'
        }));

        return {
            content: [
                {
                    type: "text",
                    text: `Found ${formattedProjects.length} project(s):\n\n${JSON.stringify(formattedProjects, null, 2)}`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error listing projects: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}

import { apiService } from '../../../core/services/api.service.js';
import { z } from 'zod';

export const listProjectsSchema = z.object({
    status: z.enum(['active', 'archived', 'deleted']).optional().describe('Filter projects by status'),
    limit: z.number().optional().default(50).describe('Maximum number of projects to return'),
    offset: z.number().optional().default(0).describe('Number of projects to skip for pagination')
});

export async function listProjects(args?: z.infer<typeof listProjectsSchema>) {
    try {
        // Use the dedicated MCP endpoint to list projects
        const endpoint = '/api/projects/mcp/list';
        const result = await apiService.get<any>(endpoint);

        if (!result || !result.data || !result.data.projects) {
            return {
                content: [
                    {
                        type: "text",
                        text: 'No projects found in database',
                    },
                ],
            };
        }

        let projects = result.data.projects;
        
        // Apply filters if provided
        if (args?.status) {
            projects = projects.filter((p: any) => p.status === args.status);
        }

        // Apply pagination
        const offset = args?.offset || 0;
        const limit = args?.limit || 50;
        const paginatedProjects = projects.slice(offset, offset + limit);

        // Format the projects list
        const formattedProjects = paginatedProjects.map((p: any) => ({
            id: p._id,
            name: p.name,
            description: p.description || '',
            status: p.status || 'active',
            lifecycle: p.lifecycle || 'planning',
            owner: p.owner,
            stats: p.stats || { useCaseCount: 0, capabilityCount: 0, completionPercentage: 0 }
        }));

        return {
            content: [
                {
                    type: "text",
                    text: `Found ${formattedProjects.length} project(s) (${projects.length} total):\n\n${JSON.stringify(formattedProjects, null, 2)}`,
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

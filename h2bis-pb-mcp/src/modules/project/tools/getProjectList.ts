import { apiService } from '../../../core/services/api.service.js';
import { z } from 'zod';

export const getProjectListSchema = z.object({
    status: z.enum(['active', 'archived', 'deleted']).optional().describe('Filter projects by status (defaults to active only)')
});

export async function getProjectList(args?: z.infer<typeof getProjectListSchema>) {
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
        
        // Apply status filter - default to active only
        const statusFilter = args?.status || 'active';
        projects = projects.filter((p: any) => p.status === statusFilter);

        // Return only essential info: id and name
        const projectList = projects.map((p: any) => ({
            id: p._id,
            name: p.name
        }));

        // Format as a simple, easy-to-parse list
        const formattedList = projectList.map((p: any) => `- ${p.name} (ID: ${p.id})`).join('\n');

        return {
            content: [
                {
                    type: "text",
                    text: `Available Projects (${projectList.length}):\n\n${formattedList}\n\nUse getProjectById with the ID to retrieve full project details.`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error retrieving project list: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}

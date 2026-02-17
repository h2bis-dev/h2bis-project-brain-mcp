import { apiService } from '../../../core/services/api.service.js';
import { z } from 'zod';

export const getProjectByIdSchema = z.object({
    projectId: z.string().describe('The unique identifier of the project to retrieve')
});

export async function getProjectById(args: z.infer<typeof getProjectByIdSchema>) {
    try {
        const { projectId } = args;
        
        // Use the dedicated MCP endpoint to get project by ID
        const endpoint = `/api/projects/mcp/find/${projectId}`;
        const result = await apiService.get<any>(endpoint);

        if (!result) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Project with ID "${projectId}" not found`,
                    },
                ],
            };
        }

        // Format the full project data with all fields
        const project = {
            // Basic Info
            id: result._id,
            name: result.name,
            description: result.description || '',
            status: result.status || 'active',
            lifecycle: result.lifecycle || 'planning',
            
            // Ownership & Access
            owner: result.owner,
            members: result.members || [],
            accessControl: result.accessControl || { allowAdmins: true, allowedRoles: [] },
            
            // Endpoints
            developedEndpoints: result.developedEndpoints || [],
            
            // Metadata
            metadata: result.metadata || {},
            
            // Stats
            stats: result.stats || { useCaseCount: 0, capabilityCount: 0, completionPercentage: 0 },
            
            // Timestamps
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        };

        return {
            content: [
                {
                    type: "text",
                    text: `Project Details:\n\n${JSON.stringify(project, null, 2)}`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error retrieving project: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}

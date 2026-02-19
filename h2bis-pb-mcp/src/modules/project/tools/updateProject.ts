import { apiService } from '../../../core/services/api.service.js';
import { z } from 'zod';

// Schema matching the API's UpdateProjectRequestSchema
export const updateProjectSchema = z.object({
    projectId: z.string().min(1).describe('The unique identifier of the project to update'),
    name: z.string().min(1).optional().describe('Updated project name'),
    description: z.string().optional().describe('Updated project description'),
    lifecycle: z.enum(['planning', 'in_development', 'in_review', 'in_testing', 'staging', 'production', 'maintenance', 'archived']).optional().describe('Updated project lifecycle stage'),
    accessControl: z.object({
        allowAdmins: z.boolean().optional(),
        allowedRoles: z.array(z.string()).optional(),
    }).optional().describe('Updated access control settings'),
    metadata: z.object({
        repository: z.string().optional(),
        techStack: z.array(z.string()).optional(),
        language: z.string().optional(),
        framework: z.string().optional(),
        architecture: z.object({
            overview: z.string().optional(),
            style: z.string().optional(),
            directoryStructure: z.string().optional(),
            stateManagement: z.array(z.string()).optional()
        }).optional(),
        authStrategy: z.object({
            approach: z.string().optional(),
            implementation: z.array(z.string()).optional()
        }).optional(),
        deployment: z.object({
            environment: z.string().optional(),
            cicd: z.array(z.string()).optional()
        }).optional(),
        externalServices: z.array(z.object({
            name: z.string(),
            purpose: z.string().optional(),
            apiDocs: z.string().optional()
        })).optional(),
        standards: z.object({
            codingStyle: z.object({
                guide: z.string().optional(),
                linter: z.array(z.string()).optional()
            }).optional(),
            namingConventions: z.array(z.string()).optional(),
            errorHandling: z.array(z.string()).optional(),
            loggingConvention: z.array(z.string()).optional()
        }).optional(),
        qualityGates: z.object({
            definitionOfDone: z.array(z.string()).optional(),
            codeReviewChecklist: z.array(z.string()).optional(),
            testingRequirements: z.object({
                coverage: z.number().min(0).max(100).optional(),
                testTypes: z.array(z.string()).optional(),
                requiresE2ETests: z.boolean().optional()
            }).optional(),
            documentationStandards: z.string().optional()
        }).optional()
    }).optional().describe('Updated project metadata')
});

export async function updateProject(args: z.infer<typeof updateProjectSchema>) {
    try {
        const { projectId, ...updateData } = args;
        
        // Use direct API call to update the project
        const endpoint = `/api/projects/${projectId}`;
        const result = await apiService.put<any>(endpoint, updateData);

        if (!result) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to update project "${projectId}"`,
                    },
                ],
            };
        }

        // Format the updated project response
        const updatedProject = {
            id: result._id || projectId,
            name: result.name,
            description: result.description || '',
            status: result.status,
            lifecycle: result.lifecycle,
            updatedAt: result.updatedAt
        };

        return {
            content: [
                {
                    type: "text",
                    text: `Project "${projectId}" updated successfully.\n\nUpdated fields: ${Object.keys(updateData).join(', ')}\n\n${JSON.stringify(updatedProject, null, 2)}`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error updating project: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}

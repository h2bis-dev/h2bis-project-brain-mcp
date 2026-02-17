import { apiService } from '../../../core/services/api.service.js';
import { z } from 'zod';

// Schema matching the API's CreateProjectRequestSchema
export const createProjectSchema = z.object({
    _id: z.string().min(1).describe('Unique project identifier (e.g., "my-project")'),
    name: z.string().min(1).describe('Project name'),
    description: z.string().optional().describe('Project description'),
    lifecycle: z.enum(['planning', 'in_development', 'in_review', 'in_testing', 'staging', 'production', 'maintenance', 'archived']).optional().describe('Project lifecycle stage'),
    accessControl: z.object({
        allowAdmins: z.boolean().optional(),
        allowedRoles: z.array(z.string()).optional(),
    }).optional().describe('Access control settings'),
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
    }).optional().describe('Project metadata including tech stack, architecture, standards, etc.')
});

export async function createProject(args: z.infer<typeof createProjectSchema>) {
    try {
        // Use the dedicated MCP endpoint to create project
        const endpoint = '/api/projects/mcp/create';
        const result = await apiService.post<any>(endpoint, args);

        if (!result) {
            return {
                content: [
                    {
                        type: "text",
                        text: 'Failed to create project',
                    },
                ],
            };
        }

        // Format the created project data
        const project = {
            id: result._id,
            name: result.name,
            description: result.description || '',
            status: result.status,
            lifecycle: result.lifecycle,
            owner: result.owner,
            createdAt: result.createdAt
        };

        return {
            content: [
                {
                    type: "text",
                    text: `Project created successfully:\n\n${JSON.stringify(project, null, 2)}`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error creating project: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}

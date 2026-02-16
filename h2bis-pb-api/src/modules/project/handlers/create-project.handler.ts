import type { CreateProjectRequestDto } from '../project.dto.js';
import { projectRepository } from '../repositories/project.repository.js';
import { hasPermission } from '../../auth/services/authorization.service.js';
import type { ProjectDocument } from '../project_schema.js';

/**
 * Create Project Handler
 * Handles project creation with RBAC validation
 */
export class CreateProjectHandler {
    /**
     * Execute project creation
     * 
     * @param userId - User ID of the creator
     * @param userRoles - User's system roles
     * @param data - Project creation data
     * @returns Created project document
     */
    async execute(
        userId: string,
        userRoles: string[],
        data: CreateProjectRequestDto
    ): Promise<ProjectDocument> {
        // Check if user has permission to create projects
        if (!hasPermission(userRoles, 'create:project')) {
            throw new Error('Permission denied: create:project');
        }

        // Create project document
        const project: ProjectDocument = {
            _id: data._id,
            name: data.name,
            description: data.description || '',
            status: 'active',
            lifecycle: data.lifecycle || 'planning',
            owner: userId,
            members: [
                {
                    userId: userId,
                    role: 'owner',
                    addedAt: new Date()
                }
            ],
            accessControl: data.accessControl || {
                allowAdmins: true,
                allowedRoles: ['user', 'moderator', 'admin']
            },
            type: 'software_development',
            developedEndpoints: [],
            metadata: {
                repository: data.metadata?.repository || '',
                techStack: data.metadata?.techStack || [],
                language: data.metadata?.language || '',
                framework: data.metadata?.framework || '',
                architecture: {
                    overview: data.metadata?.architecture?.overview || '',
                    style: data.metadata?.architecture?.style || '',
                    directoryStructure: data.metadata?.architecture?.directoryStructure || '',
                    stateManagement: data.metadata?.architecture?.stateManagement || []
                },
                authStrategy: {
                    approach: data.metadata?.authStrategy?.approach || '',
                    implementation: data.metadata?.authStrategy?.implementation || []
                },
                deployment: {
                    environment: data.metadata?.deployment?.environment || '',
                    cicd: data.metadata?.deployment?.cicd || []
                },
                externalServices: data.metadata?.externalServices || [],
                standards: {
                    codingStyle: {
                        guide: data.metadata?.standards?.codingStyle?.guide || '',
                        linter: data.metadata?.standards?.codingStyle?.linter || []
                    },
                    namingConventions: data.metadata?.standards?.namingConventions || [],
                    errorHandling: data.metadata?.standards?.errorHandling || [],
                    loggingConvention: data.metadata?.standards?.loggingConvention || []
                },
                qualityGates: {
                    definitionOfDone: data.metadata?.qualityGates?.definitionOfDone || [],
                    codeReviewChecklist: data.metadata?.qualityGates?.codeReviewChecklist || [],
                    testingRequirements: {
                        coverage: data.metadata?.qualityGates?.testingRequirements?.coverage || 0,
                        testTypes: data.metadata?.qualityGates?.testingRequirements?.testTypes || [],
                        requiresE2ETests: data.metadata?.qualityGates?.testingRequirements?.requiresE2ETests || false
                    },
                    documentationStandards: data.metadata?.qualityGates?.documentationStandards || ''
                }
            },
            stats: {
                useCaseCount: 0,
                capabilityCount: 0,
                completionPercentage: 0
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Save to database
        await projectRepository.create(project);

        return project;
    }
}

export const createProjectHandler = new CreateProjectHandler();

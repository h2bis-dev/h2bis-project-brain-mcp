import type { CreateProjectRequestDto } from '../../../api/dtos/project.dto.js';
import { projectRepository } from '../../../infrastructure/database/repositories/project.repository.js';
import { hasPermission } from '../../../domain/services/authorization.service.js';
import type { ProjectDocument } from '../../../domain/schemas/project_schema.js';

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
            metadata: data.metadata || {
                repository: '',
                techStack: [],
                language: '',
                framework: ''
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

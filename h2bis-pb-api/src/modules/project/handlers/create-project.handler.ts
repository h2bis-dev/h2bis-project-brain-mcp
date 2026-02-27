import type { CreateProjectRequestDto } from '../project.dto.js';
import { projectRepository } from '../repositories/project.repository.js';
import { hasPermission } from '../../auth/services/authorization.service.js';
import { createProject, type ProjectDocument } from '../project_schema.js';

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

        // Create project document using factory
        const project = createProject({
            ...data,
            owner: userId
        });

        // Save to database
        await projectRepository.create(project);

        return project;
    }
}

export const createProjectHandler = new CreateProjectHandler();

import { projectRepository } from '../repositories/project.repository.js';
import { hasPermission } from '../../auth/services/authorization.service.js';

/**
 * Delete Project Handler
 * Handles soft-deletion of projects in the 'planning' lifecycle stage
 * Restricted to admin roles only
 */
export class DeleteProjectHandler {
    /**
     * Execute project deletion
     *
     * Rules:
     *  - User must have 'delete:project' permission (admin only)
     *  - Project must exist
     *  - Project lifecycle must be 'planning'
     *
     * @param projectId - The project ID to delete
     * @param userId    - The requesting user's ID
     * @param userRoles - The requesting user's system roles
     */
    async execute(projectId: string, userId: string, userRoles: string[]): Promise<void> {
        // Permission check – only admins carry delete:project
        if (!hasPermission(userRoles, 'delete:project')) {
            throw new Error('Permission denied: delete:project');
        }

        const project = await projectRepository.findById(projectId);
        if (!project) {
            throw new Error(`Project not found: ${projectId}`);
        }

        // Lifecycle guard – only planning-stage projects may be deleted
        if (project.lifecycle !== 'planning') {
            throw new Error(
                `Only projects in the 'planning' lifecycle stage can be deleted. Current lifecycle: ${project.lifecycle}`
            );
        }

        await projectRepository.softDelete(projectId);
    }
}

export const deleteProjectHandler = new DeleteProjectHandler();

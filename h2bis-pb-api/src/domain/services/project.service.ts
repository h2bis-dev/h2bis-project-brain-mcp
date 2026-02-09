import { projectRepository } from '../../infrastructure/database/repositories/project.repository.js';
import { hasPermission } from './authorization.service.js';
import type { ProjectDocument, ProjectMember } from '../schemas/project_schema.js';

/**
 * Project Service
 * Handles project-related business logic with RBAC
 */
export class ProjectService {
    /**
     * Get all projects accessible by the user
     * Applies RBAC filtering based on user's roles
     * 
     * @param userId - The user ID
     * @param userRoles - The user's system roles
     * @returns Array of projects the user can access
     */
    async getAccessibleProjects(userId: string, userRoles: string[]): Promise<ProjectDocument[]> {
        // Check if user has permission to view projects
        if (!hasPermission(userRoles, 'view:projects')) {
            return [];
        }

        // Get projects accessible to the user
        const projects = await projectRepository.findAccessibleProjects(userId, userRoles);

        // Filter out archived projects for regular users
        // Admins and moderators can see archived projects
        if (!userRoles.includes('admin') && !userRoles.includes('moderator')) {
            return projects.filter((p: any) => p.status !== 'archived');
        }

        return projects;
    }

    /**
     * Get a single project with permission check
     * User must be owner, member, or project must allow their role
     */
    async getProjectById(
        projectId: string,
        userId: string,
        userRoles: string[]
    ): Promise<ProjectDocument> {
        // Check base permission
        if (!hasPermission(userRoles, 'view:projects')) {
            throw new Error('Permission denied: view:projects');
        }

        const project = await projectRepository.findById(projectId);
        if (!project) {
            throw new Error(`Project not found: ${projectId}`);
        }

        // Check access
        if (!this.canAccessProject(project, userId, userRoles)) {
            throw new Error('Access denied to this project');
        }

        return project;
    }

    /**
     * Get user's owned projects
     */
    async getUserOwnedProjects(userId: string): Promise<ProjectDocument[]> {
        return projectRepository.findByOwnerId(userId);
    }

    /**
     * Get user's member projects (not owned)
     */
    async getUserMemberProjects(userId: string): Promise<ProjectDocument[]> {
        const memberProjects = await projectRepository.findByMemberId(userId);
        // Filter out owned projects
        return memberProjects.filter((p: any) => p.owner !== userId);
    }

    /**
     * Check if user can access a project
     * 
     * User can access project if:
     * 1. User is the owner
     * 2. User is a member of the project
     * 3. Project's accessControl allows the user's role
     * 4. User is admin and project allows admin access
     */
    canAccessProject(
        project: ProjectDocument,
        userId: string,
        userRoles: string[]
    ): boolean {
        // Owner has access
        if (project.owner === userId) {
            return true;
        }

        // Check if user is a member
        if (project.members.some(m => m.userId === userId)) {
            return true;
        }

        // Check access control
        if (project.accessControl.allowedRoles.some(role => userRoles.includes(role))) {
            return true;
        }

        // Admin check
        if (userRoles.includes('admin') && project.accessControl.allowAdmins) {
            return true;
        }

        return false;
    }

    /**
     * Check if user can manage a project
     * Only owner and admins can manage
     */
    canManageProject(
        project: ProjectDocument,
        userId: string,
        userRoles: string[]
    ): boolean {
        // Owner can manage
        if (project.owner === userId) {
            return true;
        }

        // Check if user is admin member
        const adminMember = project.members.find(
            m => m.userId === userId && (m.role === 'admin' || m.role === 'owner')
        );
        if (adminMember) {
            return true;
        }

        // System admin can manage if project allows
        if (userRoles.includes('admin') && project.accessControl.allowAdmins) {
            return true;
        }

        return false;
    }

    /**
     * Get user's role in a project
     */
    getUserProjectRole(
        project: ProjectDocument,
        userId: string
    ): 'owner' | 'admin' | 'moderator' | 'viewer' | null {
        if (project.owner === userId) {
            return 'owner';
        }

        const member = project.members.find((m: ProjectMember) => m.userId === userId);
        return member?.role || null;
    }

    /**
     * Get dashboard statistics
     * Returns all accessible projects with their use case counts
     */
    async getDashboardStats(userId: string, userRoles: string[]): Promise<Array<ProjectDocument & { useCaseCount: number }>> {
        return await projectRepository.getDashboardStats(userId, userRoles);
    }
}

export const projectService = new ProjectService();

import { projectService } from '../../../domain/services/project.service.js';
import type { GetProjectsResponseDto, GetProjectByIdResponseDto } from '../../../api/dtos/project.dto.js';

export class GetProjectsHandler {
    async execute(
        userId: string,
        userRoles: string[],
        options?: { status?: string; limit?: number; offset?: number }
    ): Promise<GetProjectsResponseDto> {
        const limit = options?.limit || 50;
        const offset = options?.offset || 0;

        const projects = await projectService.getAccessibleProjects(userId, userRoles);

        // Filter by status if provided
        let filtered = projects;
        if (options?.status) {
            filtered = projects.filter((p: any) => p.status === options.status);
        }

        // Apply pagination
        const total = filtered.length;
        const paginated = filtered.slice(offset, offset + limit);

        // Map to DTOs
        const projectDtos = paginated.map((project: any) => ({
            _id: project._id,
            name: project.name,
            description: project.description || '',
            owner: project.owner,
            members: (project.members || []).map((m: any) => ({
                userId: m.userId,
                role: m.role,
                addedAt: m.addedAt instanceof Date ? m.addedAt.toISOString() : m.addedAt
            })),
            accessControl: project.accessControl || { allowAdmins: true, allowedRoles: [] },
            status: project.status,
            createdAt: project.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: project.updatedAt?.toISOString() || new Date().toISOString(),
        }));

        return {
            projects: projectDtos,
            total,
            limit,
            offset,
        };
    }
}

export class GetProjectByIdHandler {
    async execute(
        projectId: string,
        userId: string,
        userRoles: string[]
    ): Promise<GetProjectByIdResponseDto> {
        const project = await projectService.getProjectById(projectId, userId, userRoles);

        if (!project) {
            throw new Error('Project not found or access denied');
        }

        const userRole = projectService.getUserProjectRole(project, userId);
        const canManage = projectService.canManageProject(project, userId, userRoles);

        return {
            _id: project._id,
            name: project.name,
            description: project.description || '',
            owner: project.owner,
            members: (project.members || []).map((m: any) => ({
                userId: m.userId,
                role: m.role,
                addedAt: m.addedAt instanceof Date ? m.addedAt.toISOString() : m.addedAt
            })),
            accessControl: project.accessControl || { allowAdmins: true, allowedRoles: [] },
            status: project.status,
            createdAt: project.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: project.updatedAt?.toISOString() || new Date().toISOString(),
            userRole,
            canManage,
        };
    }
}

export const getProjectsHandler = new GetProjectsHandler();
export const getProjectByIdHandler = new GetProjectByIdHandler();

import { projectService } from '../services/project.service.js';
import type { GetProjectsResponseDto, GetProjectByIdResponseDto } from '../project.dto.js';
import { toProjectResponseDto, toProjectByIdResponseDto } from '../project.mapper.js';

export class GetProjectsHandler {
    async execute(
        userId: string,
        userRoles: string[],
        options?: { status?: string; limit?: number; offset?: number }
    ): Promise<GetProjectsResponseDto> {
        const limit = options?.limit || 50;
        const offset = options?.offset || 0;

        const projects = await projectService.getAccessibleProjects(userId, userRoles);

        let filtered = projects;
        if (options?.status) {
            filtered = projects.filter((p: any) => p.status === options.status);
        }

        const total = filtered.length;
        const paginated = filtered.slice(offset, offset + limit);

        return {
            projects: paginated.map(toProjectResponseDto),
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

        return toProjectByIdResponseDto(project, userRole, canManage);
    }
}

export const getProjectsHandler = new GetProjectsHandler();
export const getProjectByIdHandler = new GetProjectByIdHandler();

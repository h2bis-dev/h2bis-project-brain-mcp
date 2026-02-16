import type { ProjectDocument } from '../project_schema.js';
import { projectService } from '../services/project.service.js';
import { logger } from '../../../core/config/logger.js';

/**
 * Handler for getting dashboard statistics
 * Returns all accessible projects with their use case counts
 */
class GetDashboardStatsHandler {
    /**
     * Execute the handler
     * @param userId - The user ID
     * @param userRoles - The user's system roles
     * @returns Array of projects with use case counts
     */
    async execute(
        userId: string,
        userRoles: string[]
    ): Promise<Array<ProjectDocument & { useCaseCount: number }>> {
        logger.info(`Fetching dashboard stats for user ${userId}`);

        const projects = await projectService.getDashboardStats(userId, userRoles);

        logger.info(`Retrieved ${projects.length} projects for dashboard`);

        return projects;
    }
}

export const getDashboardStatsHandler = new GetDashboardStatsHandler();

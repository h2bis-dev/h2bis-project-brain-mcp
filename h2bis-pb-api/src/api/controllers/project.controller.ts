import { Request, Response, NextFunction } from 'express';
import { GetProjectsResponseDto, GetProjectByIdResponseDto, GetProjectsQuerySchema, CreateProjectRequestSchema } from '../dtos/project.dto.js';
import { getProjectsHandler, getProjectByIdHandler } from '../../application/handlers/project/get-projects.handler.js';
import { createProjectHandler } from '../../application/handlers/project/create-project.handler.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { logger } from '../../infrastructure/config/logger.js';

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        roles: string[];
    };
}

export const projectController = {
    /**
     * POST /api/projects
     * Creates a new software development project
     */
    createProject: asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const user = (req as any).user;
                if (!user) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }

                // Validate request body
                const validationResult = CreateProjectRequestSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return res.status(400).json({ error: 'Invalid request data', details: validationResult.error });
                }

                logger.info(`Creating project for user ${user.userId}`);

                const project = await createProjectHandler.execute(
                    user.userId,
                    user.roles,
                    validationResult.data
                );

                logger.info(`Project created: ${project._id} by user ${user.userId}`);

                return res.status(201).json({
                    success: true,
                    data: project,
                });
            } catch (error) {
                logger.error(`Error creating project: ${error}`);
                if (error instanceof Error && error.message.includes('Permission denied')) {
                    return res.status(403).json({ error: 'Permission denied' });
                }
                return res.status(500).json({ error: 'Failed to create project' });
            }
        }
    ),

    /**
     * GET /api/projects
     * Retrieves all projects accessible to the current user based on RBAC
     */
    getProjects: asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const user = (req as any).user;
                if (!user) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }

                // Validate query parameters
                const queryParams = GetProjectsQuerySchema.safeParse(req.query);
                if (!queryParams.success) {
                    return res.status(400).json({ error: 'Invalid query parameters', details: queryParams.error });
                }

                const { status, limit, offset } = queryParams.data;
                const limitNum = parseInt(limit || '50', 10);
                const offsetNum = parseInt(offset || '0', 10);

                logger.info(`Fetching projects for user ${user.userId} with roles: ${user.roles.join(', ')}`);

                const response: GetProjectsResponseDto = await getProjectsHandler.execute(
                    user.userId,
                    user.roles,
                    {
                        status,
                        limit: limitNum,
                        offset: offsetNum,
                    }
                );

                logger.info(`Found ${response.projects.length} accessible projects for user ${user.userId}`);

                return res.status(200).json({
                    success: true,
                    data: response,
                });
            } catch (error) {
                logger.error(`Error fetching projects: ${error}`);
                return res.status(500).json({ error: 'Failed to fetch projects' });
            }
        }
    ),

    /**
     * GET /api/projects/:projectId
     * Retrieves a specific project with user's access details
     */
    getProjectById: asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const user = (req as any).user;
                if (!user) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }

                const { projectId } = req.params;

                logger.info(`Fetching project ${projectId} for user ${user.userId}`);

                const response: GetProjectByIdResponseDto = await getProjectByIdHandler.execute(
                    projectId,
                    user.userId,
                    user.roles
                );

                logger.info(`Retrieved project ${projectId} for user ${user.userId}`);

                return res.status(200).json({
                    success: true,
                    data: response,
                });
            } catch (error) {
                if (error instanceof Error && error.message.includes('not found')) {
                    logger.warn(`Project not found or access denied for user ${(req as any).user?.userId}`);
                    return res.status(404).json({ error: 'Project not found or access denied' });
                }
                logger.error(`Error fetching project ${req.params.projectId}: ${error}`);
                return res.status(500).json({ error: 'Failed to fetch project' });
            }
        }
    ),
};

import { Request, Response, NextFunction } from 'express';
import { GetProjectsResponseDto, GetProjectByIdResponseDto, GetProjectsQuerySchema, CreateProjectRequestSchema, UpdateProjectRequestSchema, DomainModelEntrySchema } from './project.dto.js';
import { toProjectResponseDto } from './project.mapper.js';
import { Project } from './project_schema.js';
import { getProjectsHandler, getProjectByIdHandler } from './handlers/get-projects.handler.js';
import { getDashboardStatsHandler } from './handlers/get-dashboard-stats.handler.js';
import { createProjectHandler } from './handlers/create-project.handler.js';
import { updateProjectHandler } from './handlers/update-project.handler.js';
import { deleteProjectHandler } from './handlers/delete-project.handler.js';
import { projectService } from './services/project.service.js';
import { asyncHandler } from '../../core/middleware/async-handler.js';
import { logger } from '../../core/config/logger.js';

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
     * Also used for MCP endpoint - creates project without user if no auth
     */
    createProject: asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const user = (req as any).user;

                // Validate request body
                const validationResult = CreateProjectRequestSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return res.status(400).json({ error: 'Invalid request data', details: validationResult.error });
                }

                // For MCP agent requests (API Key auth) or unauthenticated, create project with system owner
                if (!user || user.isAgent) {
                    const projectData = {
                        ...validationResult.data,
                        owner: 'system-mcp',
                        members: [{
                            userId: 'system-mcp',
                            role: 'owner',
                            addedAt: new Date()
                        }],
                        status: 'active',
                        type: 'software_development',
                        stats: {
                            useCaseCount: 0,
                            capabilityCount: 0,
                            completionPercentage: 0
                        }
                    };
                    
                    const project = await Project.create(projectData);

                    return res.status(201).json({
                        success: true,
                        data: toProjectResponseDto(project.toObject() as any),
                    });
                }

                // For authenticated requests
                logger.info(`Creating project for user ${user.userId}`);

                const project = await createProjectHandler.execute(
                    user.userId,
                    user.roles,
                    validationResult.data
                );

                logger.info(`Project created: ${project._id} by user ${user.userId}`);

                return res.status(201).json({
                    success: true,
                    data: toProjectResponseDto(project),
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
     * Also used for MCP endpoint - returns all projects if no user authenticated
     */
    getProjects: asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const user = (req as any).user;
                
                // For MCP agent requests (API Key auth) or unauthenticated, return all active projects
                if (!user || user.isAgent) {
                    const projects = await Project.find({ status: 'active' }).lean();

                    return res.status(200).json({
                        success: true,
                        data: {
                            projects: projects.map(p => toProjectResponseDto(p as any)),
                            total: projects.length,
                            limit: projects.length,
                            offset: 0,
                        },
                    });
                }

                // For authenticated requests, use RBAC
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
     * Also used for MCP endpoint - returns project without access checks if no user
     */
    getProjectById: asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const user = (req as any).user;
                const { projectId } = req.params;

                // For MCP agent requests (API Key auth) or unauthenticated, return project directly
                if (!user || user.isAgent) {
                    const project = await Project.findById(projectId).lean();

                    if (!project) {
                        return res.status(404).json({ error: 'Project not found' });
                    }

                    return res.status(200).json({
                        success: true,
                        data: toProjectResponseDto(project as any),
                    });
                }

                // For authenticated requests, use RBAC
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

    /**
     * GET /api/projects/dashboard
     * Retrieves dashboard statistics with all accessible projects and their use case counts
     */
    getDashboardStats: asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const user = (req as any).user;
                if (!user) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }

                logger.info(`Fetching dashboard stats for user ${user.userId}`);

                const projects = await getDashboardStatsHandler.execute(
                    user.userId,
                    user.roles
                );

                logger.info(`Retrieved ${projects.length} projects for dashboard`);

                return res.status(200).json({
                    success: true,
                    data: { projects },
                });
            } catch (error) {
                logger.error(`Error fetching dashboard stats: ${error}`);
                return res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
            }
        }
    ),

    /**
     * DELETE /api/projects/:projectId
     * Soft-deletes a project (admin only, planning lifecycle only)
     */
    deleteProject: asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const user = (req as any).user;
                if (!user) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }

                const { projectId } = req.params;

                logger.info(`Deleting project ${projectId} by user ${user.userId}`);

                await deleteProjectHandler.execute(projectId, user.userId, user.roles);

                logger.info(`Project deleted: ${projectId} by user ${user.userId}`);

                return res.status(200).json({
                    success: true,
                    message: 'Project deleted successfully',
                });
            } catch (error) {
                logger.error(`Error deleting project: ${error}`);
                if (error instanceof Error && error.message.includes('not found')) {
                    return res.status(404).json({ error: 'Project not found' });
                }
                if (error instanceof Error && error.message.includes('Permission denied')) {
                    return res.status(403).json({ error: 'Permission denied' });
                }
                if (error instanceof Error && error.message.includes("lifecycle stage")) {
                    return res.status(422).json({ error: error.message });
                }
                return res.status(500).json({ error: 'Failed to delete project' });
            }
        }
    ),

    /**
     * PUT /api/projects/:projectId
     * Updates an existing project
     */
    updateProject: asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const user = (req as any).user;
                if (!user) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }

                const { projectId } = (req as any).params;

                // Validate request body
                const validationResult = UpdateProjectRequestSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return res.status(400).json({ error: 'Invalid request data', details: validationResult.error });
                }

                logger.info(`Updating project ${projectId} by user ${user.userId}`);

                const updatedProject = await updateProjectHandler.execute(
                    projectId,
                    user.userId,
                    user.roles,
                    validationResult.data
                );

                logger.info(`Project updated: ${projectId} by user ${user.userId}`);

                return res.status(200).json({
                    success: true,
                    data: updatedProject,
                });
            } catch (error) {
                logger.error(`Error updating project: ${error}`);
                if (error instanceof Error && error.message.includes('not found')) {
                    return res.status(404).json({ error: 'Project not found' });
                }
                if (error instanceof Error && error.message.includes('Permission denied')) {
                    return res.status(403).json({ error: 'Permission denied' });
                }
                return res.status(500).json({ error: 'Failed to update project' });
            }
        }
    ),

    /**
     * GET /api/projects/mcp/domain-catalog/:projectId
     * Returns the full domain model catalog for a project.
     */
    getDomainCatalog: asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const { projectId } = (req as any).params;
                const catalog = await projectService.getDomainCatalog(projectId);
                return res.status(200).json({ success: true, data: catalog });
            } catch (error) {
                logger.error(`Error fetching domain catalog: ${error}`);
                if (error instanceof Error && error.message.includes('not found')) {
                    return res.status(404).json({ error: 'Project not found' });
                }
                return res.status(500).json({ error: 'Failed to fetch domain catalog' });
            }
        }
    ),

    /**
     * PUT /api/projects/mcp/domain-catalog/:projectId
     * Upsert a domain model into the project catalog.
     * Body: DomainModelEntrySchema payload
     */
    upsertDomainModel: asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const { projectId } = (req as any).params;
                const parsed = DomainModelEntrySchema.safeParse(req.body);
                if (!parsed.success) {
                    return res.status(400).json({ error: 'Invalid domain model data', details: parsed.error });
                }

                const addedBy =
                    (req as any).user?.userId ??
                    (req as any).agent?.agentId ??
                    'system-mcp';

                await projectService.upsertDomainModel(projectId, parsed.data as any, addedBy);
                return res.status(200).json({ success: true, message: `Domain model '${parsed.data.name}' upserted.` });
            } catch (error) {
                logger.error(`Error upserting domain model: ${error}`);
                if (error instanceof Error && error.message.includes('not found')) {
                    return res.status(404).json({ error: 'Project not found' });
                }
                return res.status(500).json({ error: 'Failed to upsert domain model' });
            }
        }
    ),

    /**
     * DELETE /api/projects/mcp/domain-catalog/:projectId/:modelName
     * Remove a domain model by name from the project catalog.
     */
    removeDomainModel: asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const { projectId, modelName } = (req as any).params;
                await projectService.removeDomainModel(projectId, modelName);
                return res.status(200).json({ success: true, message: `Domain model '${modelName}' removed.` });
            } catch (error) {
                logger.error(`Error removing domain model: ${error}`);
                if (error instanceof Error && error.message.includes('not found')) {
                    return res.status(404).json({ error: 'Project not found' });
                }
                return res.status(500).json({ error: 'Failed to remove domain model' });
            }
        }
    ),
};

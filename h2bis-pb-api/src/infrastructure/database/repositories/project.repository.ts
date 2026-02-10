import { getDb } from '../connection.js';
import type { ProjectDocument } from '../../../domain/schemas/project_schema.js';
import { NotFoundError } from '../../../shared/errors/app.error.js';
import type { Filter } from 'mongodb';

/**
 * Project Repository
 * Handles all database operations for projects
 */
export class ProjectRepository {
    private readonly collectionName = 'projects';

    /**
     * Find all active projects
     * Returns all non-deleted projects
     */
    async findAllActive(): Promise<ProjectDocument[]> {
        const db = await getDb();
        const projects = await db.collection(this.collectionName)
            .find({ status: { $ne: 'deleted' } })
            .sort({ createdAt: -1 })
            .toArray();
        return projects as unknown as ProjectDocument[];
    }

    /**
     * Find a project by ID (key)
     */
    async findById(id: string): Promise<ProjectDocument | null> {
        const db = await getDb();
        const project = await db.collection(this.collectionName)
            .findOne({ _id: id, status: { $ne: 'deleted' } } as Filter<any>);
        return project as ProjectDocument | null;
    }

    /**
     * Find projects by owner ID
     * Used to get all projects owned by a user
     */
    async findByOwnerId(userId: string): Promise<ProjectDocument[]> {
        const db = await getDb();
        const projects = await db.collection(this.collectionName)
            .find({ owner: userId, status: { $ne: 'deleted' } })
            .sort({ createdAt: -1 })
            .toArray();
        return projects as unknown as ProjectDocument[];
    }

    /**
     * Find projects where user is a member
     * Used to get all projects user has access to
     */
    async findByMemberId(userId: string): Promise<ProjectDocument[]> {
        const db = await getDb();
        const projects = await db.collection(this.collectionName)
            .find({
                $or: [
                    { owner: userId },
                    { 'members.userId': userId }
                ],
                status: { $ne: 'deleted' }
            })
            .sort({ createdAt: -1 })
            .toArray();
        return projects as unknown as ProjectDocument[];
    }

    /**
     * Find projects accessible by a user based on RBAC
     * Considers: user roles, project members, and project access control
     * 
     * @param userId - The user ID
     * @param userRoles - The user's system roles (user, moderator, admin)
     * @returns Array of accessible projects
     */
    async findAccessibleProjects(userId: string, userRoles: string[]): Promise<ProjectDocument[]> {
        const db = await getDb();

        // Build query for accessible projects
        const query = {
            status: { $ne: 'deleted' },
            $or: [
                // User is the owner (always has access)
                { owner: userId },
                // User is a member of the project
                { 'members.userId': userId },
                // Project allows user's system role
                {
                    'accessControl.allowedRoles': {
                        $in: userRoles
                    }
                },
                // Admin users can access all projects with allowAdmins=true
                ...(userRoles.includes('admin') ? [{ 'accessControl.allowAdmins': true }] : [])
            ]
        };

        const projects = await db.collection(this.collectionName)
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        return projects as unknown as ProjectDocument[];
    }

    /**
     * Create a new project
     */
    async create(project: ProjectDocument): Promise<string> {
        const db = await getDb();
        await db.collection(this.collectionName).insertOne({ ...project } as any);
        return project._id;
    }

    /**
     * Update a project
     */
    async update(id: string, data: Partial<ProjectDocument>): Promise<ProjectDocument> {
        const db = await getDb();
        const result = await db.collection(this.collectionName)
            .findOneAndUpdate(
                { _id: id, status: { $ne: 'deleted' } } as Filter<any>,
                {
                    $set: {
                        ...data,
                        updatedAt: new Date()
                    }
                },
                { returnDocument: 'after' }
            );

        if (!result) {
            throw new NotFoundError(`Project not found: ${id}`);
        }

        return result as unknown as ProjectDocument;
    }

    /**
     * Add a member to a project
     */
    async addMember(projectId: string, userId: string, role: string): Promise<void> {
        const db = await getDb();
        await db.collection(this.collectionName)
            .updateOne(
                { _id: projectId, status: { $ne: 'deleted' } } as Filter<any>,
                {
                    $addToSet: {
                        members: {
                            userId,
                            role,
                            addedAt: new Date()
                        }
                    }
                }
            );
    }

    /**
     * Remove a member from a project
     */
    async removeMember(projectId: string, userId: string): Promise<void> {
        const db = await getDb();
        await db.collection(this.collectionName)
            .updateOne(
                { _id: projectId, status: { $ne: 'deleted' } } as Filter<any>,
                {
                    $pull: {
                        members: { userId }
                    } as any
                }
            );
    }

    /**
     * Soft delete a project (mark as deleted)
     */
    async softDelete(id: string): Promise<void> {
        const db = await getDb();
        await db.collection(this.collectionName)
            .updateOne(
                { _id: id } as Filter<any>,
                {
                    $set: {
                        status: 'deleted',
                        updatedAt: new Date()
                    }
                }
            );
    }

    /**
     * Get dashboard statistics for accessible projects
     * Returns projects with aggregated use case counts
     * 
     * @param userId - The user ID
     * @param userRoles - The user's system roles (user, moderator, admin)
     * @returns Array of projects with use case counts
     */
    async getDashboardStats(userId: string, userRoles: string[]): Promise<Array<ProjectDocument & { useCaseCount: number }>> {
        const db = await getDb();

        // Build query for accessible projects (same as findAccessibleProjects)
        const query = {
            status: { $ne: 'deleted' },
            $or: [
                { owner: userId },
                { 'members.userId': userId },
                {
                    'accessControl.allowedRoles': {
                        $in: userRoles
                    }
                },
                ...(userRoles.includes('admin') ? [{ 'accessControl.allowAdmins': true }] : [])
            ]
        };

        // Aggregation pipeline to join with use_cases and count
        const pipeline = [
            { $match: query },
            {
                $lookup: {
                    from: 'use_cases',
                    localField: '_id',
                    foreignField: 'projectId',
                    as: 'useCases'
                }
            },
            {
                $addFields: {
                    useCaseCount: { $size: '$useCases' }
                }
            },
            {
                $project: {
                    useCases: 0 // Remove the useCases array from the result
                }
            },
            { $sort: { createdAt: -1 } }
        ];

        const projects = await db.collection(this.collectionName)
            .aggregate(pipeline)
            .toArray();

        return projects as unknown as Array<ProjectDocument & { useCaseCount: number }>;
    }

    /**
     * Add a developed endpoint to the project registry
     * @param projectId - The project ID
     * @param endpointPath - Endpoint path in format "{METHOD} {path}" (e.g., "POST /api/projects")
     */
    async addDevelopedEndpoint(projectId: string, endpointPath: string): Promise<void> {
        const db = await getDb();
        await db.collection(this.collectionName)
            .updateOne(
                { _id: projectId, status: { $ne: 'deleted' } } as Filter<any>,
                {
                    $addToSet: {
                        developedEndpoints: endpointPath
                    },
                    $set: {
                        updatedAt: new Date()
                    }
                }
            );
    }

    /**
     * Remove a developed endpoint from the project registry
     * @param projectId - The project ID
     * @param endpointPath - Endpoint path to remove
     */
    async removeDevelopedEndpoint(projectId: string, endpointPath: string): Promise<void> {
        const db = await getDb();
        await db.collection(this.collectionName)
            .updateOne(
                { _id: projectId, status: { $ne: 'deleted' } } as Filter<any>,
                {
                    $pull: {
                        developedEndpoints: endpointPath
                    } as any,
                    $set: {
                        updatedAt: new Date()
                    }
                }
            );
    }

    /**
     * Get all developed endpoints for a project
     * @param projectId - The project ID
     * @returns Array of endpoint paths
     */
    async getDevelopedEndpoints(projectId: string): Promise<string[]> {
        const db = await getDb();
        const project = await db.collection(this.collectionName)
            .findOne(
                { _id: projectId, status: { $ne: 'deleted' } } as Filter<any>,
                { projection: { developedEndpoints: 1 } }
            );

        return (project?.developedEndpoints as string[]) || [];
    }
}

export const projectRepository = new ProjectRepository();

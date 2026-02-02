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

        if (!result || !result.value) {
            throw new NotFoundError(`Project not found: ${id}`);
        }

        return result.value as unknown as ProjectDocument;
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
}

export const projectRepository = new ProjectRepository();

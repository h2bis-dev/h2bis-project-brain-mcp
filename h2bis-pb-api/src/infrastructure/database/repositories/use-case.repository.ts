import { getDb } from '../connection.js';
import type { UseCase } from '../../../domain/schemas/use_case_schema.js';
import { NotFoundError } from '../../../shared/errors/app.error.js';

/**
 * Use Case Repository
 * Handles all database operations for use case nodes
 */
export class UseCaseRepository {
    private readonly collectionName = 'use_cases';

    /**
     * Find all use cases
     */
    async findAll(): Promise<UseCase[]> {
        const db = await getDb();
        const useCases = await db.collection(this.collectionName)
            .find({})
            .toArray();
        return useCases as unknown as UseCase[];
    }

    /**
     * Find all use cases for a specific project
     */
    async findByProjectId(projectId: string): Promise<UseCase[]> {
        const db = await getDb();
        const useCases = await db.collection(this.collectionName)
            .find({ projectId })
            .toArray();
        return useCases as unknown as UseCase[];
    }

    /**
     * Find a use case by ID (supports both key-based _id and MongoDB ObjectId)
     */
    async findById(id: string): Promise<UseCase | null> {
        const db = await getDb();

        // Try to find by _id first (which is set to the key)
        const useCase = await db.collection(this.collectionName).findOne({ _id: id } as any);

        // If not found and id looks like a key, try findByKey as fallback
        if (!useCase && id.includes('-')) {
            return this.findByKey(id);
        }

        return useCase as UseCase | null;
    }

    /**
     * Find a use case by key
     */
    async findByKey(key: string): Promise<UseCase | null> {
        const db = await getDb();
        const useCase = await db.collection(this.collectionName).findOne({ key });
        return useCase as UseCase | null;
    }

    /**
     * Create a new use case
     */
    async create(useCase: UseCase): Promise<string> {
        const db = await getDb();
        const doc = { _id: useCase.key, ...useCase };
        await db.collection(this.collectionName).insertOne(doc as any);
        return useCase.key;
    }

    /**
     * Update a use case
     */
    async update(id: string, useCase: UseCase): Promise<void> {
        const db = await getDb();
        const result = await db.collection(this.collectionName).replaceOne(
            { _id: id as any },
            { _id: id, ...useCase } as any
        );

        if (result.matchedCount === 0) {
            throw new NotFoundError(`Use case with ID ${id} not found`);
        }
    }

    /**
     * Delete a use case
     */
    async delete(id: string): Promise<boolean> {
        const db = await getDb();
        const result = await db.collection(this.collectionName).deleteOne({ _id: id as any });
        return result.deletedCount > 0;
    }
}

// Export singleton instance
export const useCaseRepository = new UseCaseRepository();

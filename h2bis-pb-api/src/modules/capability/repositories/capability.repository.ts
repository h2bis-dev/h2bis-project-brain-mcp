import { getDb } from '../../../core/database/connection.js';
import type { CapabilityNode } from '../../../core/schemas/capability_schema.js';
import { NotFoundError } from '../../../core/errors/app.error.js';

/**
 * Capability Repository
 * Handles all database operations for capability nodes
 */
export class CapabilityRepository {
    private readonly collectionName = 'capabilities';

    /**
     * Create a new capability node
     */
    async create(capability: CapabilityNode): Promise<string> {
        const db = await getDb();

        // Use capability.id as _id for consistent querying
        const doc = { _id: capability.id, ...capability };
        await db.collection(this.collectionName).insertOne(doc as any);

        return capability.id;
    }

    /**
     * Find a capability by ID
     */
    async findById(id: string): Promise<CapabilityNode | null> {
        const db = await getDb();
        const capability = await db.collection(this.collectionName).findOne({ _id: id as any });
        return capability as CapabilityNode | null;
    }

    /**
     * Update a capability node
     */
    async update(id: string, capability: CapabilityNode): Promise<void> {
        const db = await getDb();

        const result = await db.collection(this.collectionName).replaceOne(
            { _id: id as any },
            { _id: id, ...capability } as any
        );

        if (result.matchedCount === 0) {
            throw new NotFoundError(`Capability with ID ${id} not found`);
        }
    }

    /**
     * Delete a capability node
     */
    async delete(id: string): Promise<boolean> {
        const db = await getDb();
        const result = await db.collection(this.collectionName).deleteOne({ _id: id as any });
        return result.deletedCount > 0;
    }

    /**
     * Find multiple capabilities by IDs
     */
    async findByIds(ids: string[]): Promise<CapabilityNode[]> {
        const db = await getDb();
        const capabilities = await db.collection(this.collectionName)
            .find({ _id: { $in: ids as any } })
            .toArray();
        return capabilities as unknown as CapabilityNode[];
    }
}

// Export singleton instance
export const capabilityRepository = new CapabilityRepository();

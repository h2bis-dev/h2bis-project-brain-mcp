import { getDb } from '../db.js';
import { z } from 'zod';

export const listCollectionsSchema = z.object({});

export async function listCollections(_args: z.infer<typeof listCollectionsSchema>) {
    try {
        const db = await getDb();
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        return {
            content: [
                {
                    type: "text",
                    text: collectionNames.length > 0
                        ? `Available collections:\n${collectionNames.map(name => `- ${name}`).join('\n')}`
                        : 'No collections found in the database',
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error listing collections: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}

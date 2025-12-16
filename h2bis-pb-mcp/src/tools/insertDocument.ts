import { getDb } from '../db.js';
import { z } from 'zod';

export const insertDocumentSchema = z.object({
    collectionName: z.string().min(1),
    json: z.string().min(1),
});

export async function insertDocument({ collectionName, json }: z.infer<typeof insertDocumentSchema>) {
    try {
        const db = await getDb();
        const data = JSON.parse(json);
        const result = await db.collection(collectionName).insertOne(data);
        return {
            content: [
                {
                    type: "text",
                    text: `Inserted document with ID: ${result.insertedId}`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error inserting document: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}
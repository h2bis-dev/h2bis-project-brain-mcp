import { getDb } from '../db.js';
import { z } from 'zod';

export const deleteDocumentSchema = z.object({
    collectionName: z.string().min(1),
    filter: z.string().min(1),
});

export async function deleteDocument({ collectionName, filter }: z.infer<typeof deleteDocumentSchema>) {
    try {
        const db = await getDb();
        const filterObj = JSON.parse(filter);
        const result = await db.collection(collectionName).deleteOne(filterObj);
        return {
            content: [
                {
                    type: "text",
                    text: result.deletedCount > 0
                        ? `Deleted ${result.deletedCount} document(s)`
                        : 'No document matched the filter',
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error deleting document: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}

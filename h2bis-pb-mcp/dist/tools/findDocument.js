import { getDb } from '../db.js';
import { z } from 'zod';
export const findDocumentSchema = z.object({
    collectionName: z.string().min(1),
    filter: z.string().default('{}'),
});
export async function findDocument({ collectionName, filter }) {
    try {
        const db = await getDb();
        const filterObj = JSON.parse(filter);
        const document = await db.collection(collectionName).findOne(filterObj);
        return {
            content: [
                {
                    type: "text",
                    text: document ? JSON.stringify(document) : 'No document found',
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error finding document: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}
//# sourceMappingURL=findDocument.js.map
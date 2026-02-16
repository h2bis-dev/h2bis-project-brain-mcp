import { apiService } from '../../../core/services/api.service.js';
import { z } from 'zod';

export const findDocumentSchema = z.object({
    collectionName: z.string().min(1),
    filter: z.string().default('{}'),
});

export async function findDocument({ collectionName, filter }: z.infer<typeof findDocumentSchema>) {
    try {
        const filterObj = JSON.parse(filter);
        const result = await apiService.findDocument(collectionName, filterObj);
        return {
            content: [
                {
                    type: "text",
                    text: result.document ? JSON.stringify(result.document) : 'No document found',
                },
            ],
        };
    } catch (error) {
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
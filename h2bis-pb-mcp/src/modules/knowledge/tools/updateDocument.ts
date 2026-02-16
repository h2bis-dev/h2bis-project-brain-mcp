import { apiService } from '../../../core/services/api.service.js';
import { z } from 'zod';

export const updateDocumentSchema = z.object({
  collectionName: z.string().min(1),
  filter: z.string().default('{}'),
  update: z.string().min(1),
});

export async function updateDocument({ collectionName, filter, update }: z.infer<typeof updateDocumentSchema>) {
  try {
    const filterObj = JSON.parse(filter);
    const updateObj = JSON.parse(update);
    const result = await apiService.updateDocument(collectionName, filterObj, updateObj);
    return {
      content: [
        {
          type: "text",
          text: `Updated ${result.modifiedCount} document(s) (matched: ${result.matchedCount})`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error updating document: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}
import { apiService } from '../../../core/services/api.service.js';
export async function updateDocument({ collectionName, filter, update }) {
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
    }
    catch (error) {
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
//# sourceMappingURL=updateDocument.js.map
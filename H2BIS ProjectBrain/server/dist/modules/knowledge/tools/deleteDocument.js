import { apiService } from '../../../core/services/api.service.js';
export async function deleteDocument({ collectionName, filter }) {
    try {
        const filterObj = JSON.parse(filter);
        const result = await apiService.deleteDocument(collectionName, filterObj);
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
    }
    catch (error) {
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
//# sourceMappingURL=deleteDocument.js.map
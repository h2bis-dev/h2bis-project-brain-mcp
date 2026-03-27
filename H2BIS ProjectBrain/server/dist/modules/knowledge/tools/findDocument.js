import { apiService } from '../../../core/services/api.service.js';
export async function findDocument({ collectionName, filter }) {
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
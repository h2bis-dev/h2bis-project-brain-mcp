import { apiService } from '../../../core/services/api.service.js';
export async function listCollections(_args) {
    try {
        const result = await apiService.listCollections();
        const collectionNames = result.collections;
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
    }
    catch (error) {
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
//# sourceMappingURL=listCollections.js.map
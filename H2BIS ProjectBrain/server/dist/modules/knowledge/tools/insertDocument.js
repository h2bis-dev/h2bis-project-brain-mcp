import { apiService } from '../../../core/services/api.service.js';
export async function insertDocument({ collectionName, json }) {
    try {
        const data = JSON.parse(json);
        const result = await apiService.insertDocument(collectionName, data);
        let message = `✅ Inserted document with ID: ${result.insertedId}`;
        if (result.capabilityGenerated) {
            message += `\n✅ Auto-generated capability with ID: ${result.capabilityId}`;
            message += `\n\n📊 Summary:`;
            message += `\n  - UseCase stored in "${collectionName}" collection`;
            message += `\n  - Capability stored in "capabilities" collection`;
            message += `\n  - Both schemas are synchronized`;
        }
        else {
            message += `\n\nℹ️  No capability was auto-generated (document type may not be use_case or feature)`;
        }
        return {
            content: [
                {
                    type: "text",
                    text: message,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `❌ Error inserting document: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}
//# sourceMappingURL=insertDocument.js.map
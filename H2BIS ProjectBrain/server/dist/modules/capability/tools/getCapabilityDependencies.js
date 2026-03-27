import { apiService } from '../../../core/services/api.service.js';
export async function getCapabilityDependencies({ nodeId, depth }) {
    try {
        const result = await apiService.getCapabilityDependencies(nodeId, depth);
        if (!result.dependencies || result.dependencies.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Node "${nodeId}" has no dependencies.`,
                    },
                ],
            };
        }
        const depList = result.dependencies.map((dep, index) => `${index + 1}. ${dep.intent?.userGoal || dep.id} (${dep.kind})`).join('\n');
        return {
            content: [
                {
                    type: "text",
                    text: `Dependencies for "${nodeId}" (depth: ${depth}):\n\n${depList}\n\nTotal: ${result.dependencies.length} node(s)`,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error getting dependencies: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}
//# sourceMappingURL=getCapabilityDependencies.js.map
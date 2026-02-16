import { apiService } from '../../../core/services/api.service.js';
import { z } from 'zod';

export const getCapabilityDependenciesSchema = z.object({
    nodeId: z.string().min(1).describe('The ID of the capability node to get dependencies for'),
    depth: z.number().min(1).max(10).optional().default(1).describe('How many levels deep to traverse (default: 1)')
});

export async function getCapabilityDependencies({ nodeId, depth }: z.infer<typeof getCapabilityDependenciesSchema>) {
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

        const depList = result.dependencies.map((dep: any, index: number) =>
            `${index + 1}. ${dep.intent?.userGoal || dep.id} (${dep.kind})`
        ).join('\n');

        return {
            content: [
                {
                    type: "text",
                    text: `Dependencies for "${nodeId}" (depth: ${depth}):\n\n${depList}\n\nTotal: ${result.dependencies.length} node(s)`,
                },
            ],
        };
    } catch (error) {
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

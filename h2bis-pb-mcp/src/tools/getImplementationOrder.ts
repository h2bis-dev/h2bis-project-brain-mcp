import { apiService } from '../services/api.service.js';
import { z } from 'zod';

export const getImplementationOrderSchema = z.object({
    nodeIds: z.array(z.string()).min(1).describe('Array of capability node IDs to order')
});

export async function getImplementationOrder({ nodeIds }: z.infer<typeof getImplementationOrderSchema>) {
    try {
        const result = await apiService.getImplementationOrder(nodeIds);

        if (!result.order || result.order.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No nodes found for the provided IDs.`,
                    },
                ],
            };
        }

        const orderList = result.order.map((item: any) =>
            `${item.position}. ${item.name} (${item.kind}) - ID: ${item.id}`
        ).join('\n');

        return {
            content: [
                {
                    type: "text",
                    text: `Implementation Order (${result.order.length} nodes):\n\n${orderList}\n\nℹ️ Nodes are ordered based on dependencies. Implement from top to bottom.`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error getting implementation order: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}

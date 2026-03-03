import { z } from 'zod';
import { apiService } from '../../../core/services/api.service.js';

// ── Input schema ──────────────────────────────────────────────────────────────

export const removeProjectDomainModelSchema = z.object({
    projectId: z
        .string()
        .min(1)
        .describe('The _id of the project that owns the domain catalog'),
    modelName: z
        .string()
        .min(1)
        .describe(
            'Exact name of the domain model to remove (case-sensitive, e.g. "UserDocument")'
        ),
});

// ── Tool handler ──────────────────────────────────────────────────────────────

export async function removeProjectDomainModel(
    args: z.infer<typeof removeProjectDomainModelSchema>
): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const { projectId, modelName } = args;

        const endpoint = `/api/projects/mcp/domain-catalog/${projectId}/${encodeURIComponent(modelName)}`;
        await apiService.delete<any>(endpoint);

        return {
            content: [
                {
                    type: 'text',
                    text: `Domain model '${modelName}' removed from project '${projectId}'.`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error removing domain model: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}

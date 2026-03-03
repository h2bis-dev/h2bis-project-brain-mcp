import { z } from 'zod';
import { apiService } from '../../../core/services/api.service.js';

// ── Field sub-schema ──────────────────────────────────────────────────────────

const DomainModelFieldSchema = z.object({
    name: z
        .string()
        .min(1)
        .describe('Field name (e.g. "userId", "createdAt")'),
    type: z
        .string()
        .min(1)
        .describe(
            'TypeScript-style type string: "string", "number", "boolean", "Date", "string[]", "ObjectId", or any custom class name'
        ),
    required: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether the field is mandatory'),
    description: z
        .string()
        .optional()
        .describe('Human-readable description of the field'),
    defaultValue: z
        .string()
        .optional()
        .describe('Default value expressed as a string (e.g. "false", "[]", "null")'),
    constraints: z
        .array(z.string())
        .optional()
        .default([])
        .describe('Validation constraints (e.g. ["unique", "min:0", "max:255"])'),
});

// ── Top-level schema ──────────────────────────────────────────────────────────

export const upsertProjectDomainModelSchema = z.object({
    projectId: z
        .string()
        .min(1)
        .describe('The _id of the project that owns this domain catalog'),
    name: z
        .string()
        .min(1)
        .describe(
            'Domain model name (e.g. "UserDocument", "ProjectDto"). Case-sensitive — acts as the unique key for upsert.'
        ),
    description: z
        .string()
        .optional()
        .describe('What this model represents'),
    layer: z
        .enum(['data', 'dto', 'domain', 'response', 'request', 'event', 'other'])
        .optional()
        .describe(
            'Architectural layer: data=DB document, dto=transport, domain=domain object, response/request=API shapes, event=async message, other.'
        ),
    fields: z
        .array(DomainModelFieldSchema)
        .optional()
        .default([])
        .describe('Field definitions for this model'),
    usedByUseCases: z
        .array(z.string())
        .optional()
        .default([])
        .describe('List of use case IDs that reference this model'),
    addedBy: z
        .string()
        .optional()
        .describe('Agent or user identifier who is adding/updating this model (defaults to "system-mcp")'),
});

// ── Tool handler ──────────────────────────────────────────────────────────────

export async function upsertProjectDomainModel(
    args: z.infer<typeof upsertProjectDomainModelSchema>
): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const { projectId, ...modelPayload } = args;

        const endpoint = `/api/projects/mcp/domain-catalog/${projectId}`;
        await apiService.put<any>(endpoint, modelPayload);

        return {
            content: [
                {
                    type: 'text',
                    text: `Domain model '${args.name}' successfully upserted into project '${projectId}'.`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error upserting domain model: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}

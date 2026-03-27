import { z } from 'zod';
export const insertDocumentSchema = z.object({
    collectionName: z.string().min(1),
    json: z.string().min(1),
});
export const findDocumentSchema = z.object({
    collectionName: z.string().min(1),
    filter: z.string().default('{}'),
});
export const updateDocumentSchema = z.object({
    collectionName: z.string().min(1),
    filter: z.string().default('{}'),
    update: z.string().min(1),
});
export const deleteDocumentSchema = z.object({
    collectionName: z.string().min(1),
    filter: z.string().min(1),
});
export const listCollectionsSchema = z.object({});
//# sourceMappingURL=knowledge.schemas.js.map
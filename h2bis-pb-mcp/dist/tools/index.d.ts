import { insertDocument } from "./insertDocument.js";
import { findDocument } from "./findDocument.js";
import { updateDocument } from "./updateDocument.js";
import { deleteDocument } from "./deleteDocument.js";
import { listCollections } from "./listCollections.js";
export declare const tools: ({
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        collectionName: import("zod").ZodString;
        json: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        collectionName: string;
        json: string;
    }, {
        collectionName: string;
        json: string;
    }>;
    handler: typeof insertDocument;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        collectionName: import("zod").ZodString;
        filter: import("zod").ZodDefault<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
        collectionName: string;
        filter: string;
    }, {
        collectionName: string;
        filter?: string | undefined;
    }>;
    handler: typeof findDocument;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        collectionName: import("zod").ZodString;
        filter: import("zod").ZodDefault<import("zod").ZodString>;
        update: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        collectionName: string;
        filter: string;
        update: string;
    }, {
        collectionName: string;
        update: string;
        filter?: string | undefined;
    }>;
    handler: typeof updateDocument;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        collectionName: import("zod").ZodString;
        filter: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        collectionName: string;
        filter: string;
    }, {
        collectionName: string;
        filter: string;
    }>;
    handler: typeof deleteDocument;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    handler: typeof listCollections;
})[];
//# sourceMappingURL=index.d.ts.map
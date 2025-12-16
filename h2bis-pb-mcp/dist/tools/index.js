import { insertDocument, insertDocumentSchema } from "./insertDocument.js";
import { findDocument, findDocumentSchema } from "./findDocument.js";
import { updateDocument, updateDocumentSchema } from "./updateDocument.js";
import { deleteDocument, deleteDocumentSchema } from "./deleteDocument.js";
import { listCollections, listCollectionsSchema } from "./listCollections.js";
export const tools = [
    {
        name: "insertDocument",
        description: "Insert a document into a MongoDB collection",
        schema: insertDocumentSchema,
        handler: insertDocument,
    },
    {
        name: "findDocument",
        description: "Find documents in a MongoDB collection",
        schema: findDocumentSchema,
        handler: findDocument,
    },
    {
        name: "updateDocument",
        description: "Update a document in a MongoDB collection",
        schema: updateDocumentSchema,
        handler: updateDocument,
    },
    {
        name: "deleteDocument",
        description: "Delete a document from a MongoDB collection",
        schema: deleteDocumentSchema,
        handler: deleteDocument,
    },
    {
        name: "listCollections",
        description: "List all collections in the MongoDB database",
        schema: listCollectionsSchema,
        handler: listCollections,
    },
];
//# sourceMappingURL=index.js.map
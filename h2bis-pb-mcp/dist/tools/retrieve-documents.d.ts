import { ToolResponse } from '../types/index.js';
/**
 * Retrieve multiple documents from MongoDB
 */
export declare function retrieveDocuments(args: any): Promise<ToolResponse>;
/**
 * Tool definition for retrieve_documents
 */
export declare const retrieveDocumentsTool: {
    name: string;
    description: string;
    inputSchema: any;
    handler: typeof retrieveDocuments;
};
//# sourceMappingURL=retrieve-documents.d.ts.map
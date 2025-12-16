import { ToolResponse } from '../types/index.js';
/**
 * Retrieve a single document from MongoDB
 */
export declare function retrieveDocument(args: any): Promise<ToolResponse>;
/**
 * Tool definition for retrieve_document
 */
export declare const retrieveDocumentTool: {
    name: string;
    description: string;
    inputSchema: any;
    handler: typeof retrieveDocument;
};
//# sourceMappingURL=retrieve-document.d.ts.map
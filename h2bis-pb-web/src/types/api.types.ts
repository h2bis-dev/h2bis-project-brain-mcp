/**
 * Common API types
 */

export interface APIResponse<T = any> {
    data: T;
    message?: string;
    error?: string;
}

export interface InsertResponse {
    insertedId: string;
    acknowledged: boolean;
}

export interface UpdateResponse {
    modifiedCount: number;
    acknowledged: boolean;
}

export interface DeleteResponse {
    deletedCount: number;
    acknowledged: boolean;
}

export interface FindQuery {
    collection: string;
    query: Record<string, any>;
    projection?: Record<string, any>;
}

export interface InsertRequest {
    collection: string;
    document: Record<string, any>;
}

export interface UpdateRequest {
    collection: string;
    query: Record<string, any>;
    update: Record<string, any>;
}

export interface DeleteRequest {
    collection: string;
    query: Record<string, any>;
}

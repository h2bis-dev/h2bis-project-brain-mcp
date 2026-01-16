// Common types and interfaces used across the application

export type Result<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
};

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

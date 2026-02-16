// Response formatting utilities

export class ResponseMapper {
    /**
     * Format a successful response
     */
    static success<T>(data: T, statusCode: number = 200) {
        return {
            success: true,
            data,
            statusCode
        };
    }

    /**
     * Format an error response
     */
    static error(message: string, statusCode: number = 500, details?: any) {
        return {
            success: false,
            error: message,
            details,
            statusCode
        };
    }
}

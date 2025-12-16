/**
 * Log levels
 */
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
/**
 * Log entry structure
 */
export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: Record<string, any>;
    error?: Error;
}
/**
 * Logger configuration
 */
export interface LoggerConfig {
    level: LogLevel;
    enableConsole: boolean;
    prettyPrint: boolean;
}
/**
 * Simple structured logger for the MCP server
 * Provides consistent logging with context and error tracking
 */
export declare class Logger {
    private config;
    private context;
    constructor(config: LoggerConfig, context?: Record<string, any>);
    /**
     * Create a child logger with additional context
     */
    child(additionalContext: Record<string, any>): Logger;
    /**
     * Log a debug message
     */
    debug(message: string, context?: Record<string, any>): void;
    /**
     * Log an info message
     */
    info(message: string, context?: Record<string, any>): void;
    /**
     * Log a warning message
     */
    warn(message: string, context?: Record<string, any>): void;
    /**
     * Log an error message
     */
    error(message: string, error?: Error, context?: Record<string, any>): void;
    /**
     * Core logging method
     */
    private log;
    /**
     * Check if a log level should be output based on configuration
     */
    private shouldLog;
    /**
     * Output the log entry
     */
    private output;
    /**
     * Format log entry as JSON
     */
    private formatJSON;
    /**
     * Format log entry in a human-readable format
     */
    private formatPretty;
}
/**
 * Create a logger instance with the given configuration
 */
export declare function createLogger(config?: Partial<LoggerConfig>, context?: Record<string, any>): Logger;
//# sourceMappingURL=index.d.ts.map
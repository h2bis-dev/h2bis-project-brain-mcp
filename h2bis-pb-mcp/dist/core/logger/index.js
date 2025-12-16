/**
 * Log levels
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (LogLevel = {}));
/**
 * Simple structured logger for the MCP server
 * Provides consistent logging with context and error tracking
 */
export class Logger {
    constructor(config, context = {}) {
        this.config = config;
        this.context = context;
    }
    /**
     * Create a child logger with additional context
     */
    child(additionalContext) {
        return new Logger(this.config, {
            ...this.context,
            ...additionalContext,
        });
    }
    /**
     * Log a debug message
     */
    debug(message, context) {
        this.log(LogLevel.DEBUG, message, context);
    }
    /**
     * Log an info message
     */
    info(message, context) {
        this.log(LogLevel.INFO, message, context);
    }
    /**
     * Log a warning message
     */
    warn(message, context) {
        this.log(LogLevel.WARN, message, context);
    }
    /**
     * Log an error message
     */
    error(message, error, context) {
        this.log(LogLevel.ERROR, message, { ...context, error });
    }
    /**
     * Core logging method
     */
    log(level, message, context) {
        // Check if this log level should be output
        if (!this.shouldLog(level)) {
            return;
        }
        const logEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            context: { ...this.context, ...context },
        };
        this.output(logEntry);
    }
    /**
     * Check if a log level should be output based on configuration
     */
    shouldLog(level) {
        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
        const configuredLevelIndex = levels.indexOf(this.config.level);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex >= configuredLevelIndex;
    }
    /**
     * Output the log entry
     */
    output(entry) {
        if (!this.config.enableConsole) {
            return;
        }
        const output = this.config.prettyPrint
            ? this.formatPretty(entry)
            : this.formatJSON(entry);
        // Use stderr for all logs to avoid interfering with MCP stdio transport
        const logMethod = entry.level === LogLevel.ERROR ? console.error : console.error;
        logMethod(output);
    }
    /**
     * Format log entry as JSON
     */
    formatJSON(entry) {
        return JSON.stringify(entry);
    }
    /**
     * Format log entry in a human-readable format
     */
    formatPretty(entry) {
        const timestamp = entry.timestamp;
        const level = entry.level.toUpperCase().padEnd(5);
        const message = entry.message;
        let output = `[${timestamp}] ${level} ${message}`;
        if (entry.context && Object.keys(entry.context).length > 0) {
            const contextStr = JSON.stringify(entry.context, null, 2);
            output += `\n  Context: ${contextStr}`;
        }
        return output;
    }
}
/**
 * Create a logger instance with the given configuration
 */
export function createLogger(config, context) {
    const defaultConfig = {
        level: LogLevel.INFO,
        enableConsole: true,
        prettyPrint: true,
    };
    return new Logger({ ...defaultConfig, ...config }, context);
}
//# sourceMappingURL=index.js.map
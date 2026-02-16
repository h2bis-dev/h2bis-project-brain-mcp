type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
    level: LogLevel;

    constructor() {
        this.level = (process.env.LOG_LEVEL as LogLevel) || 'info';
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.level);
    }

    debug(message: string, meta?: any) {
        if (this.shouldLog('debug')) {
            console.log(`[DEBUG] ${message}`, meta || '');
        }
    }

    info(message: string, meta?: any) {
        if (this.shouldLog('info')) {
            console.log(`[INFO] ${message}`, meta || '');
        }
    }

    warn(message: string, meta?: any) {
        if (this.shouldLog('warn')) {
            console.warn(`[WARN] ${message}`, meta || '');
        }
    }

    error(message: string, meta?: any) {
        if (this.shouldLog('error')) {
            console.error(`[ERROR] ${message}`, meta || '');
        }
    }
}

export const logger = new Logger();

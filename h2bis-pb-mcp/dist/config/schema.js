import { z } from 'zod';
import { LogLevel } from '../core/logger/index.js';
/**
 * Configuration schema with validation
 */
export const configSchema = z.object({
    // Database configuration
    database: z.object({
        uri: z.string().url('MongoDB URI must be a valid URL'),
        dbName: z.string().min(1, 'Database name is required'),
        maxPoolSize: z.number().min(1).default(10),
        minPoolSize: z.number().min(0).default(2),
        serverSelectionTimeoutMS: z.number().min(1000).default(5000),
        socketTimeoutMS: z.number().min(1000).default(45000),
    }),
    // Server configuration
    server: z.object({
        name: z.string().default('h2bis-pb-mcp'),
        version: z.string().default('1.0.0'),
    }),
    // Logging configuration
    logging: z.object({
        level: z.nativeEnum(LogLevel).default(LogLevel.INFO),
        enableConsole: z.boolean().default(true),
        prettyPrint: z.boolean().default(true),
    }),
    // Environment
    environment: z.enum(['development', 'production', 'test']).default('development'),
});
//# sourceMappingURL=schema.js.map
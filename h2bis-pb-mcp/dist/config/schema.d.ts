import { z } from 'zod';
import { LogLevel } from '../core/logger/index.js';
/**
 * Configuration schema with validation
 */
export declare const configSchema: z.ZodObject<{
    database: z.ZodObject<{
        uri: z.ZodString;
        dbName: z.ZodString;
        maxPoolSize: z.ZodDefault<z.ZodNumber>;
        minPoolSize: z.ZodDefault<z.ZodNumber>;
        serverSelectionTimeoutMS: z.ZodDefault<z.ZodNumber>;
        socketTimeoutMS: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        uri: string;
        dbName: string;
        maxPoolSize: number;
        minPoolSize: number;
        serverSelectionTimeoutMS: number;
        socketTimeoutMS: number;
    }, {
        uri: string;
        dbName: string;
        maxPoolSize?: number | undefined;
        minPoolSize?: number | undefined;
        serverSelectionTimeoutMS?: number | undefined;
        socketTimeoutMS?: number | undefined;
    }>;
    server: z.ZodObject<{
        name: z.ZodDefault<z.ZodString>;
        version: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name?: string | undefined;
        version?: string | undefined;
    }>;
    logging: z.ZodObject<{
        level: z.ZodDefault<z.ZodNativeEnum<typeof LogLevel>>;
        enableConsole: z.ZodDefault<z.ZodBoolean>;
        prettyPrint: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        level: LogLevel;
        enableConsole: boolean;
        prettyPrint: boolean;
    }, {
        level?: LogLevel | undefined;
        enableConsole?: boolean | undefined;
        prettyPrint?: boolean | undefined;
    }>;
    environment: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
}, "strip", z.ZodTypeAny, {
    database: {
        uri: string;
        dbName: string;
        maxPoolSize: number;
        minPoolSize: number;
        serverSelectionTimeoutMS: number;
        socketTimeoutMS: number;
    };
    server: {
        name: string;
        version: string;
    };
    logging: {
        level: LogLevel;
        enableConsole: boolean;
        prettyPrint: boolean;
    };
    environment: "development" | "production" | "test";
}, {
    database: {
        uri: string;
        dbName: string;
        maxPoolSize?: number | undefined;
        minPoolSize?: number | undefined;
        serverSelectionTimeoutMS?: number | undefined;
        socketTimeoutMS?: number | undefined;
    };
    server: {
        name?: string | undefined;
        version?: string | undefined;
    };
    logging: {
        level?: LogLevel | undefined;
        enableConsole?: boolean | undefined;
        prettyPrint?: boolean | undefined;
    };
    environment?: "development" | "production" | "test" | undefined;
}>;
export type Config = z.infer<typeof configSchema>;
//# sourceMappingURL=schema.d.ts.map
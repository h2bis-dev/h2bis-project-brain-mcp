import { z } from 'zod';
import { createLogger } from '../../core/logger/index.js';
import { config } from '../../config/index.js';
import { ValidationError } from '../../core/errors/index.js';
/**
 * Abstract base class for all MCP tools
 * Provides standardized error handling, validation, and logging
 */
export class BaseTool {
    constructor() {
        // Logger will be initialized lazily to avoid accessing abstract name before initialization
    }
    /**
     * Get or create logger instance
     */
    getLogger() {
        if (!this.logger) {
            this.logger = createLogger(config.logging, { module: `Tool:${this.name}` });
        }
        return this.logger;
    }
    /**
     * Get the MCP tool definition
     */
    getDefinition() {
        // Get the raw Zod schema and convert to JSON Schema
        const jsonSchema = this.zodToJsonSchema(this.inputSchema);
        return {
            name: this.name,
            description: this.description,
            inputSchema: jsonSchema,
        };
    }
    /**
     * Execute the tool with automatic validation and error handling
     */
    async execute(input) {
        const startTime = Date.now();
        try {
            this.getLogger().info(`Executing tool`, { input });
            // Validate input
            const validatedInput = await this.validateInput(input);
            // Execute the tool logic
            const result = await this.run(validatedInput);
            const duration = Date.now() - startTime;
            this.getLogger().info(`Tool execution completed`, { duration });
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.getLogger().error(`Tool execution failed`, error, { duration });
            // Convert error to MCP response format
            return this.handleError(error);
        }
    }
    /**
     * Validate input using the tool's schema
     */
    async validateInput(input) {
        try {
            return this.inputSchema.parse(input);
        }
        catch (error) {
            throw ValidationError.fromZodError(error);
        }
    }
    /**
     * Handle errors and convert to MCP response format
     */
    handleError(error) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${message}`,
                },
            ],
            isError: true,
        };
    }
    /**
     * Convert Zod schema to JSON Schema for MCP
     * Handles common Zod types used in our tools
     */
    zodToJsonSchema(schema) {
        // For z.object schemas, extract the shape
        if (schema instanceof z.ZodObject) {
            const shape = schema._def.shape();
            const properties = {};
            const required = [];
            for (const [key, value] of Object.entries(shape)) {
                const zodType = value;
                properties[key] = this.zodTypeToJsonSchema(zodType);
                // Check if field is required (not optional)
                if (!zodType.isOptional()) {
                    required.push(key);
                }
            }
            return {
                type: 'object',
                properties,
                required: required.length > 0 ? required : undefined,
            };
        }
        // Fallback for other types
        return { type: 'object' };
    }
    /**
     * Convert individual Zod type to JSON Schema type
     */
    zodTypeToJsonSchema(zodType) {
        // Handle optional types
        if (zodType instanceof z.ZodOptional) {
            return this.zodTypeToJsonSchema(zodType._def.innerType);
        }
        // Handle default types
        if (zodType instanceof z.ZodDefault) {
            const innerSchema = this.zodTypeToJsonSchema(zodType._def.innerType);
            return {
                ...innerSchema,
                default: zodType._def.defaultValue(),
            };
        }
        // Handle string
        if (zodType instanceof z.ZodString) {
            return {
                type: 'string',
                description: zodType.description,
            };
        }
        // Handle number
        if (zodType instanceof z.ZodNumber) {
            const def = zodType._def;
            const schema = {
                type: 'number',
                description: zodType.description,
            };
            // Add min/max constraints
            if (def.checks) {
                for (const check of def.checks) {
                    if (check.kind === 'min') {
                        schema.minimum = check.value;
                    }
                    else if (check.kind === 'max') {
                        schema.maximum = check.value;
                    }
                }
            }
            return schema;
        }
        // Handle record (object with any keys)
        if (zodType instanceof z.ZodRecord) {
            return {
                type: 'object',
                description: zodType.description,
                additionalProperties: true,
            };
        }
        // Handle array
        if (zodType instanceof z.ZodArray) {
            return {
                type: 'array',
                description: zodType.description,
                items: this.zodTypeToJsonSchema(zodType._def.type),
            };
        }
        // Default fallback
        return {
            type: 'string',
            description: zodType.description,
        };
    }
    /**
     * Create a successful response
     */
    createSuccessResponse(data) {
        return {
            content: [
                {
                    type: 'text',
                    text: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
                },
            ],
        };
    }
    /**
     * Create an error response
     */
    createErrorResponse(message) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${message}`,
                },
            ],
            isError: true,
        };
    }
}
//# sourceMappingURL=BaseTool.js.map
import { z } from 'zod';
/**
 * Convert Zod schema to JSON Schema for MCP
 */
export function zodToJsonSchema(schema) {
    const shape = schema._def.shape();
    const properties = {};
    const required = [];
    for (const [key, value] of Object.entries(shape)) {
        const zodType = value;
        // Determine JSON Schema type
        if (zodType instanceof z.ZodString) {
            properties[key] = { type: 'string', description: zodType.description };
        }
        else if (zodType instanceof z.ZodNumber) {
            properties[key] = { type: 'number', description: zodType.description };
        }
        else if (zodType instanceof z.ZodRecord) {
            properties[key] = { type: 'object', description: zodType.description };
        }
        else {
            properties[key] = { type: 'string' };
        }
        // Check if required
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
//# sourceMappingURL=utils.js.map
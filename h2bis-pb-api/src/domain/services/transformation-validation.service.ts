import { TransformationValidationAgent, ValidationInput, TransformationValidationResult } from 'h2bis-pb-ai';
import { z } from 'zod';
import { HandlerSchema } from '../schemas/use_case_schema.js';
import { CapabilityNodeSchema } from '../schemas/capability_schema.js';

/**
 * Transformation Validation Service
 * 
 * Wraps the TransformationValidationAgent to provide validation
 * functionality to the API layer.
 */
class TransformationValidationService {
    private agent: TransformationValidationAgent;

    constructor() {
        this.agent = new TransformationValidationAgent();
    }

    /**
     * Validate that a generated capability accurately represents the use case
     * 
     * Passes actual Zod schemas to LLM for structural validation context
     * 
     * @param Handler - Original use case
     * @param capability - Generated capability
     * @returns Validation result with confidence score and issues
     */
    async validateTransformation(
        Handler: any,
        capability: any
    ): Promise<TransformationValidationResult> {
        return this.agent.validateTransformation({
            Handler,
            capability,
            HandlerSchema: HandlerSchema.shape,
            capabilitySchema: CapabilityNodeSchema.shape
        });
    }
}

export const transformationValidationService = new TransformationValidationService();

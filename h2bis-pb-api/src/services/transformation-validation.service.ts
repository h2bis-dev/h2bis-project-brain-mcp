import { TransformationValidationAgent, ValidationInput, TransformationValidationResult } from 'h2bis-pb-ai';
import { UseCaseSchema } from '../db_schema/use_case_schema.js';
import { CapabilityNodeSchema } from '../db_schema/capability_schema.js';

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
     * @param useCase - Original use case
     * @param capability - Generated capability
     * @returns Validation result with confidence score and issues
     */
    async validateTransformation(
        useCase: any,
        capability: any
    ): Promise<TransformationValidationResult> {
        return this.agent.validateTransformation({
            useCase,
            capability,
            useCaseSchema: UseCaseSchema.shape,
            capabilitySchema: CapabilityNodeSchema.shape  
        });
    }
}

export const transformationValidationService = new TransformationValidationService();

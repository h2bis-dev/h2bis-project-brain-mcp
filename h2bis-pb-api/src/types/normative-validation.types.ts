/**
 * Normative Validation Types
 * 
 * Defines types for the normative validation framework that prevents
 * AI inference when metadata is incomplete.
 */

export interface NormativityCheck {
    isNormative: boolean;
    isComplete: boolean;
    insufficiencies: Insufficiency[];
    decision: 'PROCEED' | 'REJECT';
}

export interface Insufficiency {
    field: string;
    reason: string;
    severity: 'CRITICAL' | 'WARNING';
}

export interface GenerationResult {
    success: boolean;
    mode: 'CONSTRAINED' | 'REJECTED' | 'STANDARD';
    capabilityId?: string;
    insufficiencyReport?: InsufficientReport;
}

export interface InsufficientReport {
    message: string;
    missingFields: Insufficiency[];
    recommendations: string[];
}

/**
 * Options for transformation with normative mode
 */
export interface TransformationOptions {
    generateId?: boolean;
    includeArtifacts?: boolean;
    strictMode?: boolean;
}

/**
 * Options for intent extraction with strict mode
 */
export interface IntentExtractionOptions {
    strictMode?: boolean;
}

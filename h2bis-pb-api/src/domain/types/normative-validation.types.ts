/**
 * Normative Validation Types
 * Used for strict validation mode where no inference is allowed
 */

export interface Insufficiency {
    field: string;
    reason: string;
    severity: 'CRITICAL' | 'WARNING';
}

export interface NormativityCheck {
    isNormative: boolean;
    isComplete: boolean;
    insufficiencies: Insufficiency[];
    decision: 'PROCEED' | 'REJECT';
}

export interface InsufficientReport {
    message: string;
    missingFields: Insufficiency[];
    recommendations: string[];
}

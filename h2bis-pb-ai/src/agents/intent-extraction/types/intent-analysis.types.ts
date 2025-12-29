export interface IntentAnalysis {
    // Core semantics
    userGoal: string;
    systemResponsibilities: string[];

    // Business context
    businessContext: string;
    businessValue: string;

    // Technical extraction
    technicalComponents: {
        frontend: {
            routes: string[];
            components: string[];
        };
        backend: {
            endpoints: string[];
            services: string[];
        };
        data: {
            entity: string;
            operations: ('CREATE' | 'READ' | 'UPDATE' | 'DELETE')[];
        }[];
    };

    // Behavioral extraction
    userFlows: {
        name: string;
        type: 'main' | 'alternative' | 'error';
        steps: string[];
    }[];
    acceptanceCriteria: string[];

    // Quality indicators
    assumptions: string[];
    ambiguities: string[];
    missingInformation: string[];
    constraints: string[];

    // Security and risk
    securityConsiderations: string[];
    implementationRisks: string[];

    // Metadata
    confidenceLevel: 'high' | 'medium' | 'low';
    confidenceJustification: string;
    extractedAt: Date;
    llmModel: string;
    promptVersion: string;
}

export interface ValidationResult {
    valid: boolean;
    criticalIssues: string[];
    warnings: string[];
    recommendation: 'proceed' | 'retry' | 'manual_review';
}

// Import UseCase type (synced with API schema)
export interface UseCase {
    type: 'use_case';
    key: string;
    name: string;
    description: string;
    businessValue: string;
    primaryActor: string;
    status: {
        lifecycle: string;
        reviewedByHuman: boolean;
        generatedByAI: boolean;
    };
    acceptanceCriteria: string[];
    flows: {
        name: string;
        type: 'main' | 'alternative' | 'error';
        steps: string[];
    }[];
    technicalSurface: {
        frontend: {
            repos: string[];
            routes: string[];
            components: string[];
        };
        backend: {
            repos: string[];
            endpoints: string[];
            services: string[];
            collections: { name: string; purpose: string; operations: string[] }[];
        };
    };
    relationships: any[];
    tags: string[];
    aiMetadata?: any;
    audit?: any;
}

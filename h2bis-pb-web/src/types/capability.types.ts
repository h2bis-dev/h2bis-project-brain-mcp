/**
 * Capability types matching the backend schema
 */

export interface CapabilityDependency {
    on: string;
    type: "hard" | "soft";
    reason: string;
}

export interface CapabilityFlow {
    name: string;
    steps: string[];
    type: "main" | "alternative" | "error";
}

export interface DataOperation {
    name: string;
    purpose: string;
    operations: ("CREATE" | "READ" | "UPDATE" | "DELETE")[];
}

export interface AIHints {
    complexityScore: number; // 1-10
    recommendedChunking: string[];
    failureModes: string[];
    testFocusAreas: string[];
}

export interface ResponsibilityAnnotation {
    responsibility: string;
    origin: "explicit" | "derived" | "recommended";
    traceability?: string;
    reviewRequired: boolean;
    scope: "in_scope" | "adjacent" | "out_of_scope";
}

export interface Recommendation {
    category: "security" | "performance" | "maintainability" | "scalability" | "testing";
    suggestion: string;
    rationale: string;
    basedOn: string;
    requiresHumanApproval: true;
}

export interface IntentAnalysis {
    userGoal: string;
    systemResponsibilities: string[];
    businessContext: string;
    technicalComponents: {
        frontend: {
            routes: string[];
            components: string[];
        };
        backend: {
            endpoints: string[];
            services: string[];
        };
        data: Array<{
            entity: string;
            operations: ("CREATE" | "READ" | "UPDATE" | "DELETE")[];
        }>;
    };
    assumptions: string[];
    ambiguities: string[];
    missingInformation: string[];
    securityConsiderations: string[];
    confidenceLevel: "high" | "medium" | "low";
    extractedAt: Date | string;
    llmModel: string;
    promptVersion: string;
}

export interface ReviewWorkflow {
    status: "pending" | "approved" | "rejected" | "revision_requested";
    requiredReason?: string;
    reviewedBy?: string;
    reviewedAt?: Date | string;
    feedback?: string;
    corrections?: {
        userGoal?: string;
        systemResponsibilities?: string[];
        businessContext?: string;
    };
}

export interface Capability {
    id: string;
    kind: "use_case" | "feature" | "service" | "data_entity";
    intent: {
        userGoal: string;
        systemResponsibility: string;
        businessValue: string;
    };
    behavior: {
        acceptanceCriteria: string[];
        flows: CapabilityFlow[];
    };
    realization: {
        frontend?: {
            routes: string[];
            components: string[];
        };
        backend?: {
            endpoints: string[];
            services: string[];
        };
        data?: DataOperation[];
    };
    dependencies: CapabilityDependency[];
    aiHints: AIHints;
    lifecycle: {
        status: string;
        maturity: "draft" | "stable" | "deprecated";
    };
    tags: string[];
    responsibilityAnnotations: ResponsibilityAnnotation[];
    recommendations?: Recommendation[];
    intentIntegrity?: {
        modifiedFromSource: boolean;
        modificationReason?: string;
        approvedByHuman: boolean;
    };
    confidenceBreakdown?: {
        clarity: "high" | "medium" | "low";
        completeness: "high" | "medium" | "low";
        ambiguityLevel: "low" | "medium" | "high";
    };
    implementation?: {
        status:
        | "not_started"
        | "in_progress"
        | "code_complete"
        | "tests_complete"
        | "docs_complete"
        | "deployed";
        completionPercentage: number;
        lastUpdated: Date | string;
        blockers: string[];
    };
    intentAnalysis?: IntentAnalysis;
    review?: ReviewWorkflow;
    sourceUseCaseId?: string;
    transformedAt?: Date | string;
    schemaVersion: number;
}

export interface ImpactAnalysis {
    nodeId: string;
    directDependents: Capability[];
    indirectDependents: Array<{
        node: Capability;
        depth: number;
    }>;
    totalAffected: number;
    riskLevel: "low" | "medium" | "high";
    recommendations: string[];
}

export interface DependencyTree {
    node: Capability;
    dependencies: DependencyTree[];
    depth: number;
}

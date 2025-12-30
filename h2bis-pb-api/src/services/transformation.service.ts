import { UseCase } from '../db_schema/use_case_schema.js';
import { Feature } from '../db_schema/features_schema.js';
import { CapabilityNode } from '../db_schema/capability_schema.js';

// Import Intent Extraction Agent from AI layer
import { IntentExtractionAgent, IntentAnalysis } from 'h2bis-pb-ai';

/**
 * Transformation Service
 * Converts legacy UseCase/Feature entities to modern CapabilityNode schema
 * 
 * NOW WITH LLM-BASED INTENT EXTRACTION
 */
export class TransformationService {
    private intentAgent: IntentExtractionAgent;

    constructor() {
        this.intentAgent = new IntentExtractionAgent();
    }

    /**
     * Transform a UseCase into a CapabilityNode using LLM intent extraction
     * 
     * @param useCase - The source UseCase entity
     * @param options - Transformation options
     * @returns CapabilityNode ready for insertion
     */
    async transformUseCaseToCapabilityWithIntent(
        useCase: UseCase,
        options: {
            generateId?: boolean;
            includeArtifacts?: boolean;
        } = {}
    ): Promise<CapabilityNode> {
        const { generateId = true, includeArtifacts = true } = options;

        // Step 1: Extract intent using LLM
        console.log(`🤖 Extracting intent for use case: ${useCase.key}`);

        const intentAnalysis = await this.intentAgent.extractIntent(useCase as any);

        // Step 2: Generate capability from intent analysis
        console.log(`✅ Intent extraction complete - Confidence: ${intentAnalysis.confidenceLevel}`);

        const capability = this.transformIntentToCapability(intentAnalysis, useCase, {
            generateId,
            includeArtifacts
        });

        return capability;
    }

    /**
     * Transform IntentAnalysis into CapabilityNode (deterministic mapping)
     * 
     * @param analysis - LLM-extracted intent
     * @param useCase - Original use case (for metadata)
     * @param options - Transformation options
     * @returns CapabilityNode
     */
    transformIntentToCapability(
        analysis: IntentAnalysis,
        useCase: UseCase,
        options: {
            generateId?: boolean;
            includeArtifacts?: boolean;
        } = {}
    ): CapabilityNode {
        const { generateId = true, includeArtifacts = true } = options;

        const capabilityId = generateId ? `cap-${useCase.key}` : useCase.key;

        const capability: CapabilityNode = {
            id: capabilityId,
            kind: 'use_case',

            // INTENT: Use LLM-extracted semantic intent
            intent: {
                userGoal: analysis.userGoal,
                systemResponsibility: analysis.systemResponsibilities.join('. '),
                businessValue: analysis.businessValue
            },

            // BEHAVIOR: Use extracted flows and acceptance criteria
            behavior: {
                acceptanceCriteria: analysis.acceptanceCriteria,
                flows: analysis.userFlows.map((flow: any) => ({
                    name: flow.name,
                    steps: flow.steps,
                    type: flow.type
                }))
            },

            // REALIZATION: Use extracted technical components
            realization: {
                frontend: analysis.technicalComponents.frontend.routes.length > 0 ||
                    analysis.technicalComponents.frontend.components.length > 0
                    ? {
                        routes: analysis.technicalComponents.frontend.routes,
                        components: analysis.technicalComponents.frontend.components
                    }
                    : undefined,

                backend: analysis.technicalComponents.backend.endpoints.length > 0 ||
                    analysis.technicalComponents.backend.services.length > 0
                    ? {
                        endpoints: analysis.technicalComponents.backend.endpoints,
                        services: analysis.technicalComponents.backend.services
                    }
                    : undefined,

                data: analysis.technicalComponents.data.map((d: any) => ({
                    name: d.entity,
                    purpose: `Data entity for ${d.entity}`,
                    operations: d.operations as ("CREATE" | "READ" | "UPDATE" | "DELETE")[]
                }))
            },

            // DEPENDENCIES: Transform relationships
            dependencies: this.transformRelationshipsToDependencies(useCase.relationships),

            // AI HINTS: Use extracted quality indicators
            aiHints: {
                complexityScore: this.estimateComplexity(analysis),
                recommendedChunking: [],
                failureModes: [
                    ...analysis.assumptions,
                    ...analysis.ambiguities,
                    ...analysis.implementationRisks
                ],
                testFocusAreas: analysis.acceptanceCriteria.map((ac: string) => `Verify: ${ac}`)
            },

            // LIFECYCLE: Map from use case status
            lifecycle: {
                status: useCase.status.lifecycle,
                maturity: this.mapLifecycleToMaturity(useCase.status.lifecycle)
            },

            // ARTIFACTS: Generate if requested
            artifacts: includeArtifacts ? this.generateArtifactsFromTechnicalSurface(useCase) : undefined,

            // IMPLEMENTATION: Initialize
            implementation: {
                status: this.mapLifecycleToImplementationStatus(useCase.status.lifecycle),
                completionPercentage: this.estimateCompletionPercentage(useCase.status.lifecycle),
                lastUpdated: useCase.audit?.updatedAt || new Date(),
                blockers: []
            },

            // TAGS: Copy from use case
            tags: useCase.tags || [],

            // NEW: Store intent analysis for traceability
            intentAnalysis: {
                userGoal: analysis.userGoal,
                systemResponsibilities: analysis.systemResponsibilities,
                businessContext: analysis.businessContext,
                technicalComponents: analysis.technicalComponents,
                assumptions: analysis.assumptions,
                ambiguities: analysis.ambiguities,
                missingInformation: analysis.missingInformation,
                securityConsiderations: analysis.securityConsiderations,
                confidenceLevel: analysis.confidenceLevel,
                extractedAt: analysis.extractedAt,
                llmModel: analysis.llmModel,
                promptVersion: analysis.promptVersion
            },

            // NEW: Source traceability
            sourceUseCaseId: (useCase as any)._id?.toString(),
            transformedAt: new Date(),

            schemaVersion: 1
        };

        console.log(`📊 Generated capability ${capabilityId} from intent analysis`);

        return capability;
    }

    /**
     * Transform a Feature into a CapabilityNode
     */
    transformFeatureToCapability(feature: Feature): CapabilityNode {
        const capabilityId = `cap-${feature.key}`;

        const capability: CapabilityNode = {
            id: capabilityId,
            kind: 'feature',

            intent: {
                userGoal: feature.name,
                systemResponsibility: feature.description,
                businessValue: feature.businessValue
            },

            behavior: {
                acceptanceCriteria: feature.acceptanceCriteria,
                flows: []
            },

            realization: {},

            dependencies: [],

            aiHints: {
                complexityScore: 5,
                recommendedChunking: [],
                failureModes: [],
                testFocusAreas: feature.acceptanceCriteria
            },

            lifecycle: {
                status: feature.status?.lifecycle || 'planned',
                maturity: 'draft'
            },

            tags: (feature as any).tags || [],

            schemaVersion: 1
        };

        return capability;
    }

    // Helper methods

    private estimateComplexity(analysis: IntentAnalysis): number {
        let score = 5; // Base complexity

        // Increase based on system responsibilities
        score += Math.min(analysis.systemResponsibilities.length * 0.5, 3);

        // Increase based on flows
        score += Math.min(analysis.userFlows.length * 0.3, 2);

        // Increase if ambiguities present
        if (analysis.ambiguities.length > 0) score += 1;

        // Cap at 10
        return Math.min(Math.round(score), 10);
    }

    /**
     * Helper: Transform relationships to dependencies
     * @private
     */
    private transformRelationshipsToDependencies(
        relationships: Array<{ type: string; targetType: string; targetKey: string; reason?: string }>
    ): Array<{ on: string; type: 'hard' | 'soft'; reason: string }> {
        return relationships.map(rel => ({
            on: `cap-${rel.targetKey}`,
            type: rel.type === 'depends_on' ? 'hard' : 'soft',
            reason: rel.reason || `${rel.type} relationship`
        }));
    }

    /**
     * Helper: Map complexity enum to numeric score
     * @private
     */
    private mapComplexityToScore(complexity: 'low' | 'medium' | 'high'): number {
        const mapping = {
            'low': 3,
            'medium': 6,
            'high': 9
        };
        return mapping[complexity] || 6;
    }

    /**
     * Helper: Map lifecycle to maturity
     * @private
     */
    private mapLifecycleToMaturity(lifecycle: string): 'draft' | 'stable' | 'deprecated' {
        if (lifecycle === 'deployed' || lifecycle === 'production') return 'stable';
        if (lifecycle === 'deprecated' || lifecycle === 'retired') return 'deprecated';
        return 'draft';
    }

    /**
     * Helper: Map lifecycle to implementation status
     * @private
     */
    private mapLifecycleToImplementationStatus(
        lifecycle: string
    ): 'not_started' | 'in_progress' | 'code_complete' | 'tests_complete' | 'docs_complete' | 'deployed' {
        const mapping: Record<string, any> = {
            'planned': 'not_started',
            'in_development': 'in_progress',
            'code_complete': 'code_complete',
            'testing': 'tests_complete',
            'documented': 'docs_complete',
            'deployed': 'deployed',
            'production': 'deployed'
        };
        return mapping[lifecycle] || 'not_started';
    }

    /**
     * Helper: Estimate completion percentage from lifecycle
     * @private
     */
    private estimateCompletionPercentage(lifecycle: string): number {
        const mapping: Record<string, number> = {
            'planned': 0,
            'in_development': 30,
            'code_complete': 60,
            'testing': 80,
            'documented': 90,
            'deployed': 100,
            'production': 100
        };
        return mapping[lifecycle] || 0;
    }

    /**
     * Helper: Generate artifacts from technical surface
     * @private
     */
    private generateArtifactsFromTechnicalSurface(useCase: UseCase) {
        const source: any[] = [];

        useCase.technicalSurface.frontend.components.forEach(comp => {
            source.push({
                path: `src/components/${comp}.tsx`,
                type: 'component',
                description: `Frontend component: ${comp}`
            });
        });

        useCase.technicalSurface.backend.repos.forEach(repo => {
            source.push({
                path: `src/${repo}/index.ts`,
                type: 'module',
                description: `Backend module: ${repo}`
            });
        });

        return source.length > 0 ? { source, tests: [], documentation: [] } : undefined;
    }

}

export const transformationService = new TransformationService();

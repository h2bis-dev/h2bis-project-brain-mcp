import { UseCase } from '../db_schema/use_case_schema.js';
import { Feature } from '../db_schema/features_schema.js';
import { CapabilityNode } from '../db_schema/capability_schema.js';

/**
 * Transformation Service
 * Converts legacy UseCase/Feature entities to modern CapabilityNode schema
 * 
 * Purpose: Bridge the gap between BA-friendly UseCase input and LLM-optimized Capability output
 */
export class TransformationService {

    /**
     * Transform a UseCase into a CapabilityNode
     * 
     * @param useCase - The source UseCase entity
     * @param options - Transformation options
     * @returns CapabilityNode ready for insertion
     */
    transformUseCaseToCapability(
        useCase: UseCase,
        options: {
            generateId?: boolean;          // Auto-generate ID from key
            includeArtifacts?: boolean;    // Attempt to populate artifacts from technicalSurface
        } = {}
    ): CapabilityNode {
        const { generateId = true, includeArtifacts = true } = options;

        // Generate capability ID from use case key
        const capabilityId = generateId
            ? `cap-${useCase.key}`
            : useCase.key;

        // Map UseCase to CapabilityNode
        const capability: CapabilityNode = {
            id: capabilityId,
            kind: 'use_case',

            // INTENT: Extract semantic meaning
            intent: {
                userGoal: useCase.name,
                systemResponsibility: useCase.description,
                businessValue: useCase.businessValue
            },

            // BEHAVIOR: Map flows and acceptance criteria
            behavior: {
                acceptanceCriteria: useCase.acceptanceCriteria,
                flows: useCase.flows.map(flow => ({
                    name: flow.name,
                    steps: flow.steps,
                    type: flow.type
                }))
            },

            // REALIZATION: Map technical surface to realization
            realization: {
                frontend: useCase.technicalSurface.frontend.repos.length > 0 ? {
                    routes: useCase.technicalSurface.frontend.routes,
                    components: useCase.technicalSurface.frontend.components
                } : undefined,

                backend: useCase.technicalSurface.backend.repos.length > 0 ? {
                    endpoints: useCase.technicalSurface.backend.endpoints,
                    services: useCase.technicalSurface.backend.repos // Repos as service names
                } : undefined,

                data: useCase.technicalSurface.backend.collections.map(col => ({
                    name: col.name,
                    purpose: col.purpose,
                    operations: col.operations
                }))
            },

            // DEPENDENCIES: Transform relationships to dependencies
            dependencies: this.transformRelationshipsToDependencies(useCase.relationships),

            // AI HINTS: Map AI metadata to hints
            aiHints: {
                complexityScore: this.mapComplexityToScore(useCase.aiMetadata?.estimatedComplexity || 'medium'),
                recommendedChunking: useCase.aiMetadata?.testStrategy || [],
                failureModes: useCase.aiMetadata?.implementationRisk || [],
                testFocusAreas: useCase.aiMetadata?.testStrategy || []
            },

            // LIFECYCLE: Map status to lifecycle
            lifecycle: {
                status: useCase.status.lifecycle,
                maturity: this.mapLifecycleToMaturity(useCase.status.lifecycle)
            },

            // ARTIFACTS: Attempt to populate from technical surface
            artifacts: includeArtifacts ? this.generateArtifactsFromTechnicalSurface(useCase) : undefined,

            // IMPLEMENTATION: Initialize implementation tracking
            implementation: {
                status: this.mapLifecycleToImplementationStatus(useCase.status.lifecycle),
                completionPercentage: this.estimateCompletionPercentage(useCase.status.lifecycle),
                lastUpdated: useCase.audit?.updatedAt || new Date(),
                blockers: []
            },

            // TAGS: Convert from existing tags
            tags: useCase.tags || [],

            // SCHEMA VERSION
            schemaVersion: 1
        };

        return capability;
    }

    /**
     * Transform a Feature into a CapabilityNode
     * 
     * @param feature - The source Feature entity
     * @returns CapabilityNode ready for insertion
     */
    transformFeatureToCapability(feature: Feature): CapabilityNode {
        const capability: CapabilityNode = {
            id: `cap-${feature.key}`,
            kind: 'feature',

            intent: {
                userGoal: feature.name,
                systemResponsibility: feature.description,
                businessValue: feature.businessValue
            },

            behavior: {
                acceptanceCriteria: feature.acceptanceCriteria,
                flows: [] // Features don't have flows in legacy schema
            },

            realization: {
                frontend: feature.scope.frontend ? { routes: [], components: [] } : undefined,
                backend: feature.scope.backend ? { endpoints: [], services: [] } : undefined,
                data: []
            },

            dependencies: this.transformRelationshipsToDependencies(feature.relationships),

            aiHints: {
                complexityScore: 5, // Default medium complexity
                recommendedChunking: [],
                failureModes: [],
                testFocusAreas: []
            },

            lifecycle: {
                status: feature.status.lifecycle,
                maturity: this.mapLifecycleToMaturity(feature.status.lifecycle)
            },

            tags: [],
            schemaVersion: 1
        };

        return capability;
    }

    /**
     * Helper: Transform relationships to dependencies
     * @private
     */
    private transformRelationshipsToDependencies(
        relationships: Array<{ type: string; targetType: string; targetKey: string; reason?: string }>
    ): Array<{ on: string; type: 'hard' | 'soft'; reason: string }> {
        return relationships
            .filter(rel => rel.type === 'depends_on' || rel.type === 'implements')
            .map(rel => ({
                on: `cap-${rel.targetKey}`, // Assume target is also converted
                type: rel.type === 'depends_on' ? 'hard' as const : 'soft' as const,
                reason: rel.reason || `Depends on ${rel.targetType} ${rel.targetKey}`
            }));
    }

    /**
     * Helper: Map complexity enum to numeric score
     * @private
     */
    private mapComplexityToScore(complexity: 'low' | 'medium' | 'high'): number {
        const mapping = {
            low: 3,
            medium: 5,
            high: 8
        };
        return mapping[complexity];
    }

    /**
     * Helper: Map lifecycle to maturity
     * @private
     */
    private mapLifecycleToMaturity(lifecycle: string): 'draft' | 'stable' | 'deprecated' {
        if (lifecycle === 'idea' || lifecycle === 'planned') return 'draft';
        if (lifecycle === 'completed') return 'stable';
        return 'draft'; // Default
    }

    /**
     * Helper: Map lifecycle to implementation status
     * @private
     */
    private mapLifecycleToImplementationStatus(
        lifecycle: string
    ): 'not_started' | 'in_progress' | 'code_complete' | 'tests_complete' | 'docs_complete' | 'deployed' {
        const mapping: Record<string, any> = {
            idea: 'not_started',
            planned: 'not_started',
            in_development: 'in_progress',
            ai_generated: 'code_complete',
            human_reviewed: 'tests_complete',
            completed: 'deployed'
        };
        return mapping[lifecycle] || 'not_started';
    }

    /**
     * Helper: Estimate completion percentage from lifecycle
     * @private
     */
    private estimateCompletionPercentage(lifecycle: string): number {
        const mapping: Record<string, number> = {
            idea: 0,
            planned: 10,
            in_development: 40,
            ai_generated: 70,
            human_reviewed: 90,
            completed: 100
        };
        return mapping[lifecycle] || 0;
    }

    /**
     * Helper: Generate artifacts from technical surface
     * @private
     */
    private generateArtifactsFromTechnicalSurface(useCase: UseCase) {
        return {
            source: [
                // Frontend components
                ...useCase.technicalSurface.frontend.components.map(comp => ({
                    path: comp,
                    type: 'component' as const,
                    description: `Frontend component for ${useCase.name}`
                })),
                // Backend services
                ...useCase.technicalSurface.backend.repos.map(repo => ({
                    path: repo,
                    type: 'module' as const,
                    description: `Backend service for ${useCase.name}`
                }))
            ],
            tests: [],
            documentation: []
        };
    }

    /**
     * Batch transform: Convert multiple use cases to capabilities
     * Useful for migration scenarios
     */
    async batchTransformUseCases(useCases: UseCase[]): Promise<CapabilityNode[]> {
        return useCases.map(uc => this.transformUseCaseToCapability(uc));
    }

    /**
     * Reverse transformation: CapabilityNode back to UseCase
     * Useful for displaying in BA-friendly format
     */
    transformCapabilityToUseCase(capability: CapabilityNode): Partial<UseCase> {
        // Only works if kind === 'use_case'
        if (capability.kind !== 'use_case') {
            throw new Error('Can only transform use_case capabilities back to UseCases');
        }

        return {
            type: 'use_case',
            key: capability.id.replace('cap-', ''),
            name: capability.intent.userGoal,
            description: capability.intent.systemResponsibility,
            businessValue: capability.intent.businessValue,
            primaryActor: 'User', // Default, would need to be stored separately
            acceptanceCriteria: capability.behavior.acceptanceCriteria,
            flows: capability.behavior.flows,
            technicalSurface: {
                backend: {
                    repos: capability.realization.backend?.services || [],
                    endpoints: capability.realization.backend?.endpoints || [],
                    collections: capability.realization.data?.map(d => ({
                        name: d.name,
                        purpose: d.purpose,
                        operations: d.operations
                    })) || []
                },
                frontend: {
                    repos: capability.realization.frontend ? ['frontend'] : [],
                    routes: capability.realization.frontend?.routes || [],
                    components: capability.realization.frontend?.components || []
                }
            },
            relationships: capability.dependencies.map(dep => ({
                type: 'depends_on',
                targetType: 'capability',
                targetKey: dep.on.replace('cap-', ''),
                reason: dep.reason
            })),
            tags: capability.tags,
            status: {
                lifecycle: capability.lifecycle.status as any,
                reviewedByHuman: capability.implementation?.status === 'tests_complete',
                generatedByAI: capability.implementation?.status === 'code_complete'
            }
        };
    }
}

export const transformationService = new TransformationService();

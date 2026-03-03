import { z } from 'zod';
import { apiService } from '../../../core/services/api.service.js';
import type {
    UseCaseWithProjectContext,
    ProjectContext,
    UseCaseData,
} from '../types/UseCaseWithProjectContext.js';

// ── Input schema ─────────────────────────────────────────────────────────────

export const getUseCaseWithProjectContextSchema = z.object({
    useCaseId: z
        .string()
        .min(1)
        .describe(
            'The unique identifier (_id) of the use case to retrieve together with its full project context'
        ),
});

// ── Helpers: map raw API payloads to typed objects ───────────────────────────

/**
 * Map raw use case API response to UseCaseData.
 * Uses the _id / id field present in the DB document, and passes all known
 * fields through without dropping any.
 */
function mapUseCase(raw: Record<string, any>): UseCaseData {
    return {
        id:          raw._id ?? raw.id ?? '',
        key:         raw.key ?? '',
        projectId:   raw.projectId,
        type:        raw.type ?? 'use_case',
        name:        raw.name ?? '',
        description: raw.description ?? '',

        status: {
            lifecycle:       raw.status?.lifecycle       ?? 'idea',
            reviewedByHuman: raw.status?.reviewedByHuman ?? false,
            generatedByAI:   raw.status?.generatedByAI   ?? false,
        },

        businessValue:      raw.businessValue ?? '',
        primaryActor:       raw.primaryActor  ?? '',
        acceptanceCriteria: raw.acceptanceCriteria ?? [],
        stakeholders:       raw.stakeholders,

        functionalRequirements: raw.functionalRequirements
            ? {
                must:   raw.functionalRequirements.must   ?? [],
                should: raw.functionalRequirements.should ?? [],
                wont:   raw.functionalRequirements.wont   ?? [],
              }
            : undefined,

        scope: raw.scope
            ? {
                inScope:     raw.scope.inScope     ?? [],
                outOfScope:  raw.scope.outOfScope  ?? [],
                assumptions: raw.scope.assumptions ?? [],
                constraints: raw.scope.constraints ?? [],
              }
            : undefined,

        domainModel: raw.domainModel
            ? { entities: raw.domainModel.entities ?? [] }
            : undefined,

        interfaces: raw.interfaces
            ? {
                type:      raw.interfaces.type      ?? 'REST',
                endpoints: raw.interfaces.endpoints ?? [],
                events:    raw.interfaces.events    ?? [],
              }
            : undefined,

        errorHandling: raw.errorHandling
            ? { knownErrors: raw.errorHandling.knownErrors ?? [] }
            : undefined,

        configuration: raw.configuration
            ? {
                envVars:      raw.configuration.envVars      ?? [],
                featureFlags: raw.configuration.featureFlags ?? [],
              }
            : undefined,

        quality: raw.quality
            ? {
                testTypes:               raw.quality.testTypes               ?? [],
                performanceCriteria:     raw.quality.performanceCriteria     ?? [],
                securityConsiderations:  raw.quality.securityConsiderations  ?? [],
              }
            : undefined,

        aiDirectives: raw.aiDirectives
            ? {
                generationLevel: raw.aiDirectives.generationLevel ?? 'partial',
                overwritePolicy: raw.aiDirectives.overwritePolicy ?? 'ifEmpty',
              }
            : undefined,

        flows: raw.flows ?? [],

        technicalSurface: {
            backend: {
                repos:       raw.technicalSurface?.backend?.repos       ?? [],
                endpoints:   raw.technicalSurface?.backend?.endpoints   ?? [],
                collections: raw.technicalSurface?.backend?.collections ?? [],
            },
            frontend: {
                repos:      raw.technicalSurface?.frontend?.repos       ?? [],
                routes:     raw.technicalSurface?.frontend?.routes      ?? [],
                components: raw.technicalSurface?.frontend?.components  ?? [],
            },
        },

        relationships:      raw.relationships      ?? [],
        implementationRisk: raw.implementationRisk ?? [],
        architecturePatterns: raw.architecturePatterns ?? [],
        tags:               raw.tags      ?? [],
        normative:          raw.normative ?? false,

        aiMetadata: raw.aiMetadata
            ? {
                estimatedComplexity:       raw.aiMetadata.estimatedComplexity       ?? 'medium',
                implementationRisk:        raw.aiMetadata.implementationRisk        ?? [],
                testStrategy:              raw.aiMetadata.testStrategy              ?? [],
                nonFunctionalRequirements: raw.aiMetadata.nonFunctionalRequirements ?? [],
                suggestedOrder:            raw.aiMetadata.suggestedOrder,
                normativeMode:             raw.aiMetadata.normativeMode,
                insufficiencyReasons:      raw.aiMetadata.insufficiencyReasons,
              }
            : undefined,

        audit: raw.audit
            ? {
                createdAt: raw.audit.createdAt,
                updatedAt: raw.audit.updatedAt,
                createdBy: raw.audit.createdBy,
                updatedBy: raw.audit.updatedBy,
              }
            : undefined,
    };
}

/**
 * Map raw project API response to ProjectContext.
 * Covers every field in ProjectResponseDto — nothing is dropped.
 */
function mapProjectContext(raw: Record<string, any>): ProjectContext {
    const meta = raw.metadata ?? {};
    const arch  = meta.architecture    ?? {};
    const std   = meta.standards       ?? {};
    const auth  = meta.authStrategy    ?? {};
    const dep   = meta.deployment      ?? {};
    const qg    = meta.qualityGates    ?? {};
    const tr    = qg.testingRequirements ?? {};

    return {
        // Identity
        id:          raw._id       ?? raw.id ?? '',
        name:        raw.name      ?? '',
        description: raw.description ?? '',
        status:      raw.status    ?? 'active',
        lifecycle:   raw.lifecycle ?? 'planning',
        type:        raw.type      ?? 'software_development',

        // Ownership & access
        owner:  raw.owner ?? '',
        members: (raw.members ?? []).map((m: any) => ({
            userId:  m.userId,
            role:    m.role,
            addedAt: m.addedAt,
        })),
        accessControl: {
            allowAdmins:  raw.accessControl?.allowAdmins  ?? true,
            allowedRoles: raw.accessControl?.allowedRoles ?? [],
        },

        // Developed endpoints registry
        developedEndpoints: (raw.developedEndpoints ?? []).map((e: any) => ({
            useCaseId:      e.useCaseId,
            endpoint:       e.endpoint,
            method:         e.method,
            service:        e.service,
            description:    e.description    ?? '',
            requestSchema:  e.requestSchema  ?? {},
            responseSchema: e.responseSchema ?? {},
            addedAt:        e.addedAt,
            lastScanned:    e.lastScanned,
        })),

        // Development metadata
        metadata: {
            repository: meta.repository ?? '',
            techStack:  meta.techStack  ?? [],
            language:   meta.language   ?? '',
            framework:  meta.framework  ?? '',

            architecture: {
                overview:           arch.overview           ?? '',
                style:              arch.style              ?? '',
                directoryStructure: arch.directoryStructure ?? '',
                stateManagement:    arch.stateManagement    ?? [],
            },

            authStrategy: {
                approach:       auth.approach       ?? '',
                implementation: auth.implementation ?? [],
            },

            deployment: {
                environment: dep.environment ?? '',
                cicd:        dep.cicd        ?? [],
            },

            externalServices: (meta.externalServices ?? []).map((s: any) => ({
                name:    s.name,
                purpose: s.purpose  ?? '',
                apiDocs: s.apiDocs  ?? '',
            })),

            standards: {
                codingStyle: {
                    guide:  std.codingStyle?.guide  ?? '',
                    linter: std.codingStyle?.linter ?? [],
                },
                namingConventions: std.namingConventions ?? [],
                errorHandling:     std.errorHandling     ?? [],
                loggingConvention: std.loggingConvention ?? [],
            },

            qualityGates: {
                definitionOfDone:      qg.definitionOfDone      ?? [],
                codeReviewChecklist:   qg.codeReviewChecklist   ?? [],
                documentationStandards: qg.documentationStandards ?? [],
                testingRequirements: {
                    coverage:          tr.coverage          ?? 0,
                    testTypes:         tr.testTypes         ?? [],
                    requiresE2ETests:  tr.requiresE2ETests  ?? false,
                },
            },
        },

        // Domain catalog (moved to top level)
        domainCatalog: (raw.domainCatalog ?? []).map((m: any) => ({
                name:           m.name           ?? '',
                description:    m.description,
                layer:          m.layer,
                fields:         (m.fields ?? []).map((f: any) => ({
                    name:         f.name         ?? '',
                    type:         f.type         ?? 'string',
                    required:     f.required     ?? false,
                    description:  f.description,
                    defaultValue: f.defaultValue,
                    constraints:  f.constraints  ?? [],
                })),
                usedByUseCases: m.usedByUseCases ?? [],
                addedBy:        m.addedBy,
                addedAt:        m.addedAt,
                updatedAt:      m.updatedAt,
            })),

        // Statistics
        stats: {
            useCaseCount:         raw.stats?.useCaseCount         ?? 0,
            capabilityCount:      raw.stats?.capabilityCount      ?? 0,
            completionPercentage: raw.stats?.completionPercentage ?? 0,
        },

        // Timestamps
        createdAt: raw.createdAt ?? '',
        updatedAt: raw.updatedAt ?? '',
    };
}

// ── Tool handler ─────────────────────────────────────────────────────────────

export async function getUseCaseWithProjectContext(
    args: z.infer<typeof getUseCaseWithProjectContextSchema>
): Promise<{ content: { type: string; text: string }[] }> {
    const { useCaseId } = args;

    try {
        // ── 1. Fetch the use case ───────────────────────────────────────────
        const useCaseRaw = await apiService.get<any>(
            `/api/use-cases/mcp/find/${useCaseId}`
        );

        if (!useCaseRaw) {
            return errorResponse(`Use case with ID "${useCaseId}" not found`);
        }

        // Unwrap possible API envelope
        const useCaseDoc: Record<string, any> =
            useCaseRaw?.data?.useCase ??
            useCaseRaw?.data          ??
            useCaseRaw;

        // ── 2. Resolve the owning project ───────────────────────────────────
        const projectId: string | undefined =
            useCaseDoc.projectId ?? useCaseDoc.project_id;

        if (!projectId) {
            return errorResponse(
                `Use case "${useCaseId}" has no projectId — cannot retrieve project context.\n\n` +
                `Use Case Data:\n${JSON.stringify(useCaseDoc, null, 2)}`
            );
        }

        const projectRaw = await apiService.get<any>(
            `/api/projects/mcp/find/${projectId}`
        );

        if (!projectRaw) {
            return errorResponse(
                `Project "${projectId}" referenced by use case "${useCaseId}" was not found.\n\n` +
                `Use Case Data:\n${JSON.stringify(useCaseDoc, null, 2)}`
            );
        }

        // ── 3. Map & return composite object ───────────────────────────────
        const result: UseCaseWithProjectContext = {
            useCase:        mapUseCase(useCaseDoc),
            projectContext: mapProjectContext(projectRaw),
        };

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };

    } catch (error) {
        return errorResponse(
            `Error retrieving use case with project context: ` +
            (error instanceof Error ? error.message : String(error))
        );
    }
}

// ── Local helper ──────────────────────────────────────────────────────────────

function errorResponse(message: string) {
    return { content: [{ type: 'text', text: message }] };
}

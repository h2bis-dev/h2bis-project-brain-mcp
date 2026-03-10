import type { ProjectDocument } from './project_schema.js';
import type { ProjectResponseDto, GetProjectByIdResponseDto } from './project.dto.js';

/**
 * Single canonical mapper: ProjectDocument → ProjectResponseDto
 *
 * All project CRUD responses (GET list, GET by-id, POST, PUT) must go through
 * this function. Adding a new field to the schema means updating exactly ONE
 * place — here — rather than hunting down every handler that manually builds
 * the response shape.
 */
export function toProjectResponseDto(project: ProjectDocument): ProjectResponseDto {
    return {
        _id:    project._id,
        name:   project.name,
        description: project.description || '',
        owner:  project.owner,

        members: (project.members || []).map(m => ({
            userId:  m.userId,
            role:    m.role,
            addedAt: m.addedAt instanceof Date ? m.addedAt.toISOString() : (m.addedAt as any),
        })),

        accessControl: project.accessControl ?? { allowAdmins: true, allowedRoles: [] },

        status:    project.status,
        lifecycle: project.lifecycle || 'planning',
        type:      'software_development' as const,

        developedEndpoints: (project.developedEndpoints || []).map(ep => ({
            useCaseId:      ep.useCaseId,
            endpoint:       ep.endpoint,
            method:         ep.method,
            service:        ep.service,
            description:    ep.description    || '',
            requestSchema:  ep.requestSchema  ?? {},
            responseSchema: ep.responseSchema ?? {},
            addedAt: ep.addedAt instanceof Date ? ep.addedAt.toISOString() : (ep.addedAt as any),
            lastScanned: ep.lastScanned
                ? (ep.lastScanned instanceof Date ? ep.lastScanned.toISOString() : (ep.lastScanned as any))
                : undefined,
        })),

        metadata: {
            repository: project.metadata?.repository || '',

            architecture: {
                overview:           project.metadata?.architecture?.overview           || '',
                style:              project.metadata?.architecture?.style              || '',
                directoryStructure: project.metadata?.architecture?.directoryStructure || '',
                stateManagement:    project.metadata?.architecture?.stateManagement    || [],
            },

            authStrategy: {
                approach:       project.metadata?.authStrategy?.approach       || '',
                implementation: project.metadata?.authStrategy?.implementation || [],
            },

            deployment: {
                environment: project.metadata?.deployment?.environment || '',
                cicd:        project.metadata?.deployment?.cicd        || [],
            },

            externalServices: (project.metadata?.externalServices || []).map(s => ({
                name:    s.name,
                purpose: s.purpose || '',
                apiDocs: s.apiDocs || '',
            })),

            services: (project.metadata?.services || []).map(s => ({
                id:          s.id          || '',
                name:        s.name        || '',
                type:        s.type        || 'other',
                language:    s.language    || '',
                framework:   s.framework   || '',
                techStack:   s.techStack   || [],
                description: s.description || '',
                goals:       s.goals       || '',
                repository:  s.repository  || '',
            })),

            standards: {
                namingConventions: project.metadata?.standards?.namingConventions || [],
                errorHandling:     project.metadata?.standards?.errorHandling     || [],
                loggingConvention: project.metadata?.standards?.loggingConvention || [],
            },

            qualityGates: {
                definitionOfDone:      project.metadata?.qualityGates?.definitionOfDone      || [],
                codeReviewChecklist:   project.metadata?.qualityGates?.codeReviewChecklist   || [],
                testingRequirements: {
                    coverage:          project.metadata?.qualityGates?.testingRequirements?.coverage          ?? 0,
                    testTypes:         project.metadata?.qualityGates?.testingRequirements?.testTypes         || [],
                    requiresE2ETests:  project.metadata?.qualityGates?.testingRequirements?.requiresE2ETests  ?? false,
                },
                documentationStandards: project.metadata?.qualityGates?.documentationStandards || [],
            },
        },

        domainCatalog: (project.domainCatalog || []).map(m => ({
            name:        m.name,
            description: m.description,
            layer:       m.layer,
            fields: (m.fields || []).map(f => ({
                name:         f.name,
                type:         f.type,
                required:     f.required ?? false,
                description:  f.description,
                defaultValue: f.defaultValue,
                constraints:  f.constraints || [],
            })),
            usedByUseCases: m.usedByUseCases || [],
            addedBy:  m.addedBy,
            addedAt:  m.addedAt  instanceof Date ? m.addedAt.toISOString()  : (m.addedAt  as any),
            updatedAt: m.updatedAt instanceof Date ? m.updatedAt.toISOString() : (m.updatedAt as any),
        })),

        stats: project.stats ?? {
            useCaseCount:         0,
            capabilityCount:      0,
            completionPercentage: 0,
        },

        createdAt: project.createdAt instanceof Date ? project.createdAt.toISOString() : (project.createdAt as any) || new Date().toISOString(),
        updatedAt: project.updatedAt instanceof Date ? project.updatedAt.toISOString() : (project.updatedAt as any) || new Date().toISOString(),
    };
}

/**
 * Convenience wrapper for the GET /projects/:id response which adds
 * the two access-control fields on top of the base DTO.
 */
export function toProjectByIdResponseDto(
    project: ProjectDocument,
    userRole: 'owner' | 'admin' | 'moderator' | 'viewer' | null | undefined,
    canManage: boolean
): GetProjectByIdResponseDto {
    return {
        ...toProjectResponseDto(project),
        userRole,
        canManage,
    };
}

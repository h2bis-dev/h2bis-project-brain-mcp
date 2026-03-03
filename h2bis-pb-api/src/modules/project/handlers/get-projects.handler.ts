import { projectService } from '../services/project.service.js';
import type { GetProjectsResponseDto, GetProjectByIdResponseDto } from '../project.dto.js';

export class GetProjectsHandler {
    async execute(
        userId: string,
        userRoles: string[],
        options?: { status?: string; limit?: number; offset?: number }
    ): Promise<GetProjectsResponseDto> {
        const limit = options?.limit || 50;
        const offset = options?.offset || 0;

        const projects = await projectService.getAccessibleProjects(userId, userRoles);

        // Filter by status if provided
        let filtered = projects;
        if (options?.status) {
            filtered = projects.filter((p: any) => p.status === options.status);
        }

        // Apply pagination
        const total = filtered.length;
        const paginated = filtered.slice(offset, offset + limit);

        // Map to DTOs
        const projectDtos = paginated.map((project: any) => ({
            _id: project._id,
            name: project.name,
            description: project.description || '',
            owner: project.owner,
            members: (project.members || []).map((m: any) => ({
                userId: m.userId,
                role: m.role,
                addedAt: m.addedAt instanceof Date ? m.addedAt.toISOString() : m.addedAt
            })),
            accessControl: project.accessControl || { allowAdmins: true, allowedRoles: [] },
            status: project.status,
            lifecycle: project.lifecycle || 'planning',
            type: 'software_development' as const,
            developedEndpoints: (project.developedEndpoints || []).map((ep: any) => ({
                useCaseId: ep.useCaseId,
                endpoint: ep.endpoint,
                method: ep.method,
                service: ep.service,
                description: ep.description || '',
                requestSchema: ep.requestSchema || {},
                responseSchema: ep.responseSchema || {},
                addedAt: ep.addedAt instanceof Date ? ep.addedAt.toISOString() : ep.addedAt,
                lastScanned: ep.lastScanned ? (ep.lastScanned instanceof Date ? ep.lastScanned.toISOString() : ep.lastScanned) : undefined
            })),
            metadata: {
                repository: project.metadata?.repository || '',
                techStack: project.metadata?.techStack || [],
                language: project.metadata?.language || '',
                framework: project.metadata?.framework || '',
                architecture: project.metadata?.architecture || {
                    overview: '',
                    style: '',
                    directoryStructure: '',
                    stateManagement: []
                },
                authStrategy: project.metadata?.authStrategy || {
                    approach: '',
                    implementation: []
                },
                deployment: project.metadata?.deployment || {
                    environment: '',
                    cicd: []
                },
                externalServices: project.metadata?.externalServices || [],
                standards: project.metadata?.standards || {
                    namingConventions: [],
                    errorHandling: [],
                    loggingConvention: []
                },
                qualityGates: project.metadata?.qualityGates || {
                    definitionOfDone: [],
                    codeReviewChecklist: [],
                    testingRequirements: {
                        coverage: 0,
                        testTypes: [],
                        requiresE2ETests: false
                    },
                    documentationStandards: []
                }
            },
            stats: project.stats || {
                useCaseCount: 0,
                capabilityCount: 0,
                completionPercentage: 0
            },
            domainCatalog: (project.domainCatalog || []).map((m: any) => ({
                name:           m.name,
                description:    m.description,
                layer:          m.layer,
                fields:         (m.fields || []).map((f: any) => ({
                    name:         f.name,
                    type:         f.type,
                    required:     f.required ?? false,
                    description:  f.description,
                    defaultValue: f.defaultValue,
                    constraints:  f.constraints || [],
                })),
                usedByUseCases: m.usedByUseCases || [],
                addedBy:        m.addedBy,
                addedAt:        m.addedAt instanceof Date ? m.addedAt.toISOString() : m.addedAt,
                updatedAt:      m.updatedAt instanceof Date ? m.updatedAt.toISOString() : m.updatedAt,
            })),
            createdAt: project.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: project.updatedAt?.toISOString() || new Date().toISOString(),
        }));

        return {
            projects: projectDtos,
            total,
            limit,
            offset,
        };
    }
}

export class GetProjectByIdHandler {
    async execute(
        projectId: string,
        userId: string,
        userRoles: string[]
    ): Promise<GetProjectByIdResponseDto> {
        const project = await projectService.getProjectById(projectId, userId, userRoles);

        if (!project) {
            throw new Error('Project not found or access denied');
        }

        const userRole = projectService.getUserProjectRole(project, userId);
        const canManage = projectService.canManageProject(project, userId, userRoles);

        return {
            _id: project._id,
            name: project.name,
            description: project.description || '',
            owner: project.owner,
            members: (project.members || []).map((m: any) => ({
                userId: m.userId,
                role: m.role,
                addedAt: m.addedAt instanceof Date ? m.addedAt.toISOString() : m.addedAt
            })),
            accessControl: project.accessControl || { allowAdmins: true, allowedRoles: [] },
            status: project.status,
            lifecycle: project.lifecycle || 'planning',
            type: 'software_development' as const,
            developedEndpoints: (project.developedEndpoints || []).map((ep: any) => ({
                useCaseId: ep.useCaseId,
                endpoint: ep.endpoint,
                method: ep.method,
                service: ep.service,
                description: ep.description || '',
                requestSchema: ep.requestSchema || {},
                responseSchema: ep.responseSchema || {},
                addedAt: ep.addedAt instanceof Date ? ep.addedAt.toISOString() : ep.addedAt,
                lastScanned: ep.lastScanned ? (ep.lastScanned instanceof Date ? ep.lastScanned.toISOString() : ep.lastScanned) : undefined
            })),
            metadata: {
                repository: project.metadata?.repository || '',
                techStack: project.metadata?.techStack || [],
                language: project.metadata?.language || '',
                framework: project.metadata?.framework || '',
                architecture: project.metadata?.architecture || {
                    overview: '',
                    style: '',
                    directoryStructure: '',
                    stateManagement: []
                },
                authStrategy: project.metadata?.authStrategy || {
                    approach: '',
                    implementation: []
                },
                deployment: project.metadata?.deployment || {
                    environment: '',
                    cicd: []
                },
                externalServices: project.metadata?.externalServices || [],
                standards: project.metadata?.standards || {
                    namingConventions: [],
                    errorHandling: [],
                    loggingConvention: []
                },
                qualityGates: project.metadata?.qualityGates || {
                    definitionOfDone: [],
                    codeReviewChecklist: [],
                    testingRequirements: {
                        coverage: 0,
                        testTypes: [],
                        requiresE2ETests: false
                    },
                    documentationStandards: []
                }
            },
            stats: project.stats || {
                useCaseCount: 0,
                capabilityCount: 0,
                completionPercentage: 0
            },
            domainCatalog: (project.domainCatalog || []).map((m: any) => ({
                name:           m.name,
                description:    m.description,
                layer:          m.layer,
                fields:         (m.fields || []).map((f: any) => ({
                    name:         f.name,
                    type:         f.type,
                    required:     f.required ?? false,
                    description:  f.description,
                    defaultValue: f.defaultValue,
                    constraints:  f.constraints || [],
                })),
                usedByUseCases: m.usedByUseCases || [],
                addedBy:        m.addedBy,
                addedAt:        m.addedAt instanceof Date ? m.addedAt.toISOString() : m.addedAt,
                updatedAt:      m.updatedAt instanceof Date ? m.updatedAt.toISOString() : m.updatedAt,
            })),
            createdAt: project.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: project.updatedAt?.toISOString() || new Date().toISOString(),
            userRole,
            canManage,
        };
    }
}

export const getProjectsHandler = new GetProjectsHandler();
export const getProjectByIdHandler = new GetProjectByIdHandler();

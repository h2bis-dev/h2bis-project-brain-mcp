import type { UpdateProjectRequestDto } from '../project.dto.js';
import { projectRepository } from '../repositories/project.repository.js';
import { hasPermission } from '../../auth/services/authorization.service.js';
import type { ProjectDocument } from '../project_schema.js';

/**
 * Update Project Handler
 * Handles project updates with RBAC validation
 */
export class UpdateProjectHandler {
    /**
     * Execute project update
     * 
     * @param projectId - ID of the project to update
     * @param userId - User ID requesting the update
     * @param userRoles - User's system roles
     * @param updateData - Project update data
     * @returns Updated project document
     */
    async execute(
        projectId: string,
        userId: string,
        userRoles: string[],
        updateData: UpdateProjectRequestDto
    ): Promise<ProjectDocument> {
        // Check if user has permission to edit projects
        if (!hasPermission(userRoles, 'edit:project')) {
            throw new Error('Permission denied: edit:project');
        }

        // Fetch existing project
        const existingProject = await projectRepository.findById(projectId);
        if (!existingProject) {
            throw new Error('Project not found');
        }

        // Check if user has access to this specific project
        // User must be owner, project admin, or system admin
        const isOwner = existingProject.owner === userId;
        const isProjectAdmin = existingProject.members.some(
            m => m.userId === userId && (m.role === 'admin' || m.role === 'owner')
        );
        const isSystemAdmin = userRoles.includes('admin');

        if (!isOwner && !isProjectAdmin && !isSystemAdmin) {
            throw new Error('Permission denied: not authorized to update this project');
        }

        // Merge update data with existing project
        const updatedProject: ProjectDocument = {
            ...existingProject,
            name: updateData.name ?? existingProject.name,
            description: updateData.description ?? existingProject.description,
            lifecycle: updateData.lifecycle ?? existingProject.lifecycle,
            accessControl: updateData.accessControl ? {
                allowAdmins: updateData.accessControl.allowAdmins ?? existingProject.accessControl.allowAdmins,
                allowedRoles: updateData.accessControl.allowedRoles ?? existingProject.accessControl.allowedRoles
            } : existingProject.accessControl,
            metadata: {
                repository: updateData.metadata?.repository ?? existingProject.metadata.repository,
                architecture: {
                    overview: updateData.metadata?.architecture?.overview ?? existingProject.metadata.architecture.overview,
                    style: updateData.metadata?.architecture?.style ?? existingProject.metadata.architecture.style,
                    directoryStructure: updateData.metadata?.architecture?.directoryStructure ?? existingProject.metadata.architecture.directoryStructure,
                    stateManagement: updateData.metadata?.architecture?.stateManagement ?? existingProject.metadata.architecture.stateManagement
                },
                authStrategy: {
                    approach: updateData.metadata?.authStrategy?.approach ?? existingProject.metadata.authStrategy.approach,
                    implementation: updateData.metadata?.authStrategy?.implementation ?? existingProject.metadata.authStrategy.implementation
                },
                deployment: {
                    environment: updateData.metadata?.deployment?.environment ?? existingProject.metadata.deployment.environment,
                    cicd: updateData.metadata?.deployment?.cicd ?? existingProject.metadata.deployment.cicd
                },
                externalServices: (updateData.metadata?.externalServices ? updateData.metadata.externalServices.map(s => ({
                    name: s.name,
                    purpose: s.purpose ?? '',
                    apiDocs: s.apiDocs ?? ''
                })) : existingProject.metadata.externalServices) as Array<{ name: string; purpose: string; apiDocs: string; }>,
                services: (updateData.metadata?.services ?? existingProject.metadata.services ?? []) as any,
                standards: {
                    namingConventions: updateData.metadata?.standards?.namingConventions ?? existingProject.metadata.standards.namingConventions,
                    errorHandling: updateData.metadata?.standards?.errorHandling ?? existingProject.metadata.standards.errorHandling,
                    loggingConvention: updateData.metadata?.standards?.loggingConvention ?? existingProject.metadata.standards.loggingConvention
                },
                qualityGates: {
                    definitionOfDone: updateData.metadata?.qualityGates?.definitionOfDone ?? existingProject.metadata.qualityGates.definitionOfDone,
                    codeReviewChecklist: updateData.metadata?.qualityGates?.codeReviewChecklist ?? existingProject.metadata.qualityGates.codeReviewChecklist,
                    testingRequirements: {
                        coverage: updateData.metadata?.qualityGates?.testingRequirements?.coverage ?? existingProject.metadata.qualityGates.testingRequirements.coverage,
                        testTypes: updateData.metadata?.qualityGates?.testingRequirements?.testTypes ?? existingProject.metadata.qualityGates.testingRequirements.testTypes,
                        requiresE2ETests: updateData.metadata?.qualityGates?.testingRequirements?.requiresE2ETests ?? existingProject.metadata.qualityGates.testingRequirements.requiresE2ETests
                    },
                    documentationStandards: updateData.metadata?.qualityGates?.documentationStandards ?? existingProject.metadata.qualityGates.documentationStandards
                }
            } as ProjectDocument['metadata'],
            updatedAt: new Date()
        };

        // Update in database
        await projectRepository.update(projectId, updatedProject);

        return updatedProject;
    }
}

export const updateProjectHandler = new UpdateProjectHandler();

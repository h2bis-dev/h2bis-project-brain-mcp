import * as projectService from '../services/project.service.js';
export async function getProjectById(args) {
    try {
        const project = await projectService.getProjectById(args.projectId);
        if (!project) {
            return text(`Project with ID "${args.projectId}" not found.`);
        }
        const formatted = {
            id: project._id,
            name: project.name,
            description: project.description ?? '',
            status: project.status ?? 'active',
            lifecycle: project.lifecycle ?? 'planning',
            owner: project.owner,
            members: project.members ?? [],
            accessControl: project.accessControl ?? { allowAdmins: true, allowedRoles: [] },
            developedEndpoints: project.developedEndpoints ?? [],
            domainCatalog: project.domainCatalog ?? [],
            metadata: project.metadata ?? {},
            stats: project.stats ?? { useCaseCount: 0, capabilityCount: 0, completionPercentage: 0 },
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        };
        return text(`Project Details:\n\n${JSON.stringify(formatted, null, 2)}`);
    }
    catch (error) {
        return text(`Error retrieving project: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function text(message) {
    return { content: [{ type: 'text', text: message }] };
}
//# sourceMappingURL=getProjectById.js.map
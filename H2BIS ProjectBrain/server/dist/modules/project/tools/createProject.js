import * as projectService from '../services/project.service.js';
export async function createProject(args) {
    try {
        const project = await projectService.createProject(args);
        const formatted = {
            id: project._id,
            name: project.name,
            description: project.description ?? '',
            status: project.status,
            lifecycle: project.lifecycle,
            owner: project.owner,
            createdAt: project.createdAt,
        };
        return text(`Project created successfully:\n\n${JSON.stringify(formatted, null, 2)}`);
    }
    catch (error) {
        return text(`Error creating project: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function text(message) {
    return { content: [{ type: 'text', text: message }] };
}
//# sourceMappingURL=createProject.js.map
import * as projectService from '../services/project.service.js';
export async function updateProject(args) {
    try {
        const { projectId, ...updateData } = args;
        const project = await projectService.updateProject(projectId, updateData);
        const formatted = {
            id: project._id ?? projectId,
            name: project.name,
            description: project.description ?? '',
            status: project.status,
            lifecycle: project.lifecycle,
            updatedAt: project.updatedAt,
        };
        return text(`Project "${projectId}" updated successfully.\n\nUpdated fields: ${Object.keys(updateData).join(', ')}\n\n${JSON.stringify(formatted, null, 2)}`);
    }
    catch (error) {
        return text(`Error updating project: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function text(message) {
    return { content: [{ type: 'text', text: message }] };
}
//# sourceMappingURL=updateProject.js.map
/**
 * Project module barrel
 *
 * Exports the complete list of MCP tool definitions for the project domain.
 * tools/index.ts spreads this array — it never imports individual files from this module.
 * Adding a new project tool only requires changes inside this module.
 */

import {
    createProjectSchema,
    updateProjectSchema,
    getProjectByIdSchema,
    listProjectsSchema,
    upsertProjectDomainModelSchema,
    removeProjectDomainModelSchema,
} from './schemas/project.schemas.js';

import { createProject }            from './tools/createProject.js';
import { updateProject }            from './tools/updateProject.js';
import { getProjectById }           from './tools/getProjectById.js';
import { listProjects }             from './tools/listProjects.js';
import { upsertProjectDomainModel } from './tools/upsertProjectDomainModel.js';
import { removeProjectDomainModel } from './tools/removeProjectDomainModel.js';

export const projectTools = [
    {
        name: 'listProjects',
        description:
            'List projects with optional filtering by status and pagination. ' +
            'Returns id, name, description, lifecycle, and stats. ' +
            'Use this first to discover projects, then use getProjectById for full details.',
        schema: listProjectsSchema,
        handler: listProjects,
    },
    {
        name: 'getProjectById',
        description:
            'Get a specific project by ID with complete details including metadata, ' +
            'architecture, tech stack, quality gates, domain catalog, stats, and endpoints.',
        schema: getProjectByIdSchema,
        handler: getProjectById,
    },
    {
        name: 'createProject',
        description:
            'Create a new software development project with metadata, tech stack, ' +
            'architecture details, and quality gates.',
        schema: createProjectSchema,
        handler: createProject,
    },
    {
        name: 'updateProject',
        description:
            "Update an existing project's details, metadata, lifecycle stage, or access control settings.",
        schema: updateProjectSchema,
        handler: updateProject,
    },
    {
        name: 'upsertProjectDomainModel',
        description:
            'Add or replace a domain model (class/interface/DTO) in a project\'s domain catalog. ' +
            'Call this whenever you create or significantly change a TypeScript interface, class, ' +
            'Mongoose schema, Zod schema, or DTO while implementing a feature. ' +
            'Provide every field with its type, required flag, constraints, and the architectural layer ' +
            '(data | dto | domain | response | request | event | other). ' +
            'The model is upserted by name — re-calling with the same name updates it.',
        schema: upsertProjectDomainModelSchema,
        handler: upsertProjectDomainModel,
    },
    {
        name: 'removeProjectDomainModel',
        description:
            'Remove a domain model from a project\'s domain catalog by name. ' +
            'Use this when a model is deleted or renamed during refactoring.',
        schema: removeProjectDomainModelSchema,
        handler: removeProjectDomainModel,
    },
];

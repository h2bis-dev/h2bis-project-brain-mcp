/**
 * Use Case module barrel
 *
 * Exports the complete list of MCP tool definitions for the use case domain.
 * tools/index.ts spreads this array — it never imports individual files from this module.
 * Adding a new use case tool only requires changes inside this module.
 */

import {
    listUseCasesSchema,
    getUseCaseByIdSchema,
    createUseCaseSchema,
    updateUseCaseSchema,
    deleteUseCaseSchema,
    enhanceUseCaseSchema,
    updateUseCaseWithAISchema,
    getUseCaseWithProjectContextSchema,
} from './schemas/useCase.schemas.js';

import { listUseCases }                    from './tools/listUseCases.js';
import { getUseCaseById }                  from './tools/getUseCaseById.js';
import { createUseCase }                   from './tools/createUseCase.js';
import { updateUseCase }                   from './tools/updateUseCase.js';
import { deleteUseCase }                   from './tools/deleteUseCase.js';
import { enhanceUseCase }                  from './tools/enhanceUseCase.js';
import { updateUseCaseWithAI }             from './tools/updateUseCaseWithAI.js';
import { getUseCaseWithProjectContext }    from './tools/getUseCaseWithProjectContext.js';

export const useCaseTools = [
    {
        name: 'listUseCases',
        description:
            'List use cases with optional filtering by project and pagination. ' +
            'Returns id, key, name, description, status, and basic details. ' +
            'Use this first to discover use cases, then use getUseCaseById for full details.',
        schema: listUseCasesSchema,
        handler: listUseCases,
    },
    {
        name: 'getUseCaseById',
        description:
            'Get a specific use case by ID with complete details including functional requirements, ' +
            'flows, technical surface, domain model, and all other sections.',
        schema: getUseCaseByIdSchema,
        handler: getUseCaseById,
    },
    {
        name: 'createUseCase',
        description:
            'Create a new use case with all necessary details. ' +
            'If projectId is provided, automatically triggers capability graph generation. ' +
            'Required fields: key, name, description. All other fields are optional.',
        schema: createUseCaseSchema,
        handler: createUseCase,
    },
    {
        name: 'updateUseCase',
        description:
            'Update an existing use case. ' +
            'All fields are optional — only provided fields will be updated. ' +
            'Use this for manual updates based on human input or agent analysis.',
        schema: updateUseCaseSchema,
        handler: updateUseCase,
    },
    {
        name: 'deleteUseCase',
        description:
            'Delete a use case (soft delete). ' +
            'The use case will be marked as deleted but not removed from the database.',
        schema: deleteUseCaseSchema,
        handler: deleteUseCase,
    },
    {
        name: 'enhanceUseCase',
        description:
            'Enhance a use case using AI. ' +
            'Fills in missing sections (flows, technical surface, domain model) based on existing data. ' +
            'Optionally specify enhancementType: full, partial, flows_only, or technical_only.',
        schema: enhanceUseCaseSchema,
        handler: enhanceUseCase,
    },
    {
        name: 'updateUseCaseWithAI',
        description:
            'Update a use case with AI-driven changes based on natural language instructions. ' +
            'Use this when you want to make targeted changes to a use case without manually editing fields. ' +
            'Preserves human-reviewed sections by default.',
        schema: updateUseCaseWithAISchema,
        handler: updateUseCaseWithAI,
    },
    {
        name: 'getUseCaseWithProjectContext',
        description:
            'Retrieve a use case together with the full development context of its owning project ' +
            '(architecture, tech stack, repository, coding standards, auth strategy, quality gates, ' +
            'deployment, external services, developed endpoints, and stats). ' +
            'Use this tool whenever an AI agent needs to implement a software feature from a use case, ' +
            'so it can align the implementation with the project\'s architecture and conventions.',
        schema: getUseCaseWithProjectContextSchema,
        handler: getUseCaseWithProjectContext,
    },
];

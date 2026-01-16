import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { capabilityRepository } from '../../infrastructure/database/repositories/capability.repository.js';
import { z } from 'zod';
import { CapabilityNodeSchema } from '../../domain/schemas/capability_schema.js';
import { NotFoundError } from '../../shared/errors/app.error.js';

// Note: Most of the capability logic is already in capability.service.ts which acts like a use-case.
// For now we'll keep using the service directly until we need a more complex orchestration layer.

import { capabilityService } from '../../domain/services/capability.service.js';

/**
 * Create a new capability node
 * POST /api/capabilities
 */
export const createCapability = asyncHandler(async (req: Request, res: Response) => {
    const validatedNode = CapabilityNodeSchema.parse(req.body);
    const nodeId = await capabilityService.createNode(validatedNode);

    res.status(201).json({
        success: true,
        nodeId,
        message: 'Capability node created successfully'
    });
});

/**
 * Get a capability node by ID
 * GET /api/capabilities/:id
 */
export const getCapability = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const node = await capabilityService.getNode(id);

    if (!node) {
        throw new NotFoundError(`Capability node with id ${id} not found`);
    }

    res.json({
        success: true,
        node
    });
});

/**
 * Update a capability node
 * PUT /api/capabilities/:id
 */
export const updateCapability = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const success = await capabilityService.updateNode(id, updates);

    if (!success) {
        throw new NotFoundError(`Capability node with id ${id} not found`);
    }

    res.json({
        success: true,
        message: 'Capability node updated successfully'
    });
});

/**
 * Delete a capability node
 * DELETE /api/capabilities/:id
 */
export const deleteCapability = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const success = await capabilityService.deleteNode(id);

    if (!success) {
        throw new NotFoundError(`Capability node with id ${id} not found`);
    }

    res.json({
        success: true,
        message: 'Capability node deleted successfully'
    });
});

/**
 * Get dependencies for a capability node
 * GET /api/capabilities/:id/dependencies?depth=1
 */
export const getDependencies = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const depth = parseInt(req.query.depth as string) || 1;

    const dependencies = await capabilityService.findDependencies(id, depth);

    res.json({
        success: true,
        nodeId: id,
        depth,
        dependencies,
        count: dependencies.length
    });
});

/**
 * Get dependents for a capability node
 * GET /api/capabilities/:id/dependents?depth=1
 */
export const getDependents = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const depth = parseInt(req.query.depth as string) || 1;

    const dependents = await capabilityService.findDependents(id, depth);

    res.json({
        success: true,
        nodeId: id,
        depth,
        dependents,
        count: dependents.length
    });
});

/**
 * Detect circular dependencies
 * GET /api/capabilities/:id/circular
 */
export const detectCircular = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const cycle = await capabilityService.detectCircularDependencies(id);

    res.json({
        success: true,
        nodeId: id,
        hasCircularDependency: cycle.length > 0,
        cycle
    });
});

/**
 * Analyze impact of changing a capability node
 * GET /api/capabilities/:id/impact
 */
export const analyzeImpact = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const impact = await capabilityService.analyzeImpact(id);

    res.json({
        success: true,
        impact
    });
});

/**
 * Get implementation order for a set of nodes
 * POST /api/capabilities/order
 */
export const getImplementationOrder = asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
        nodeIds: z.array(z.string()).min(1)
    });

    const { nodeIds } = schema.parse(req.body);
    const orderedNodes = await capabilityService.getImplementationOrder(nodeIds);

    res.json({
        success: true,
        count: orderedNodes.length,
        order: orderedNodes.map((node, index) => ({
            position: index + 1,
            id: node.id,
            name: (node as any).intent?.userGoal || 'Unknown',
            kind: node.kind
        })),
        nodes: orderedNodes
    });
});

/**
 * Get full context for LLM
 * GET /api/capabilities/:id/full-context
 */
export const getFullContext = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const includeFullGraph = req.query.includeFullGraph === 'true';

    const node = await capabilityService.getNode(id);
    if (!node) {
        throw new NotFoundError(`Capability node with id ${id} not found`);
    }

    const dependencies = await capabilityService.findDependencies(id, 3);
    const dependents = await capabilityService.findDependents(id, 2);
    const impact = await capabilityService.analyzeImpact(id);

    const response: any = {
        success: true,
        capability: node,
        dependencies: includeFullGraph
            ? dependencies
            : {
                direct: dependencies.filter((_, i) => i < 5),
                totalCount: dependencies.length,
                hasMore: dependencies.length > 5
            },
        dependents: includeFullGraph
            ? dependents
            : {
                direct: dependents.filter((_, i) => i < 5),
                totalCount: dependents.length,
                hasMore: dependents.length > 5
            },
        impact,
        artifacts: (node as any).artifacts || { source: [], tests: [], documentation: [] },
        implementation: (node as any).implementation || null
    };

    res.json(response);
});

/**
 * Link artifact to capability
 * POST /api/capabilities/:id/link-artifact
 */
export const linkArtifact = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const schema = z.object({
        type: z.enum(['source', 'test', 'documentation']),
        path: z.string(),
        metadata: z.object({
            artifactType: z.enum(['class', 'function', 'module', 'component']).optional(),
            description: z.string().optional(),
            coverage: z.number().min(0).max(100).optional(),
            docType: z.enum(['api', 'tutorial', 'architecture']).optional()
        }).optional()
    });

    const { type, path, metadata } = schema.parse(req.body);

    const node = await capabilityService.getNode(id);
    if (!node) {
        throw new NotFoundError(`Capability node with id ${id} not found`);
    }

    const artifacts = (node as any).artifacts || { source: [], tests: [], documentation: [] };

    if (type === 'source') {
        artifacts.source.push({
            path,
            type: metadata?.artifactType || 'module',
            description: metadata?.description || ''
        });
    } else if (type === 'test') {
        artifacts.tests.push({
            path,
            coverage: metadata?.coverage,
            lastRun: new Date()
        });
    } else if (type === 'documentation') {
        artifacts.documentation.push({
            path,
            type: metadata?.docType || 'api'
        });
    }

    await capabilityService.updateNode(id, { artifacts });

    res.json({
        success: true,
        message: `${type} artifact linked successfully`,
        artifact: { type, path }
    });
});

/**
 * Find capabilities by file path
 * GET /api/capabilities/by-file/:filepath
 */
export const findByFile = asyncHandler(async (req: Request, res: Response) => {
    const filepath = decodeURIComponent(req.params.filepath);

    const { getDb } = await import('../../infrastructure/database/connection.js');
    const db = await getDb();
    const capabilities = await db.collection('capabilities')
        .find({
            $or: [
                { 'artifacts.source.path': filepath },
                { 'artifacts.tests.path': filepath },
                { 'artifacts.documentation.path': filepath }
            ]
        })
        .toArray();

    res.json({
        success: true,
        filepath,
        capabilities,
        count: capabilities.length
    });
});

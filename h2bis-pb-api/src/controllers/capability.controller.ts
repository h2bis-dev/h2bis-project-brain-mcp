import { Request, Response } from 'express';
import { capabilityService } from '../services/capability.service.js';
import { z } from 'zod';
import { CapabilityNodeSchema } from '../db_schema/capability_schema.js';

/**
 * Create a new capability node
 * POST /api/capabilities
 */
export async function createCapability(req: Request, res: Response) {
    try {
        const validatedNode = CapabilityNodeSchema.parse(req.body);
        const nodeId = await capabilityService.createNode(validatedNode);

        res.status(201).json({
            success: true,
            nodeId,
            message: 'Capability node created successfully'
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Validation error',
                message: 'The capability node does not match the required schema',
                details: error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
            });
        } else {
            res.status(500);
            throw error;
        }
    }
}

/**
 * Get a capability node by ID
 * GET /api/capabilities/:id
 */
export async function getCapability(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const node = await capabilityService.getNode(id);

        if (!node) {
            return res.status(404).json({
                error: 'Not found',
                message: `Capability node with id ${id} not found`
            });
        }

        res.json({
            success: true,
            node
        });
    } catch (error) {
        res.status(500);
        throw error;
    }
}

/**
 * Update a capability node
 * PUT /api/capabilities/:id
 */
export async function updateCapability(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const updates = req.body;

        const success = await capabilityService.updateNode(id, updates);

        if (!success) {
            return res.status(404).json({
                error: 'Not found',
                message: `Capability node with id ${id} not found`
            });
        }

        res.json({
            success: true,
            message: 'Capability node updated successfully'
        });
    } catch (error) {
        res.status(500);
        throw error;
    }
}

/**
 * Delete a capability node
 * DELETE /api/capabilities/:id
 */
export async function deleteCapability(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const success = await capabilityService.deleteNode(id);

        if (!success) {
            return res.status(404).json({
                error: 'Not found',
                message: `Capability node with id ${id} not found`
            });
        }

        res.json({
            success: true,
            message: 'Capability node deleted successfully'
        });
    } catch (error) {
        res.status(500);
        throw error;
    }
}

/**
 * Get dependencies for a capability node
 * GET /api/capabilities/:id/dependencies?depth=1
 */
export async function getDependencies(req: Request, res: Response) {
    try {
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
    } catch (error) {
        res.status(500);
        throw error;
    }
}

/**
 * Get dependents for a capability node (nodes that depend on this one)
 * GET /api/capabilities/:id/dependents?depth=1
 */
export async function getDependents(req: Request, res: Response) {
    try {
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
    } catch (error) {
        res.status(500);
        throw error;
    }
}

/**
 * Detect circular dependencies
 * GET /api/capabilities/:id/circular
 */
export async function detectCircular(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const cycle = await capabilityService.detectCircularDependencies(id);

        res.json({
            success: true,
            nodeId: id,
            hasCircularDependency: cycle.length > 0,
            cycle
        });
    } catch (error) {
        res.status(500);
        throw error;
    }
}

/**
 * Analyze impact of changing a capability node
 * GET /api/capabilities/:id/impact
 */
export async function analyzeImpact(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const impact = await capabilityService.analyzeImpact(id);

        res.json({
            success: true,
            impact
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({
                error: 'Not found',
                message: error.message
            });
        } else {
            res.status(500);
            throw error;
        }
    }
}

/**
 * Get implementation order for a set of nodes
 * POST /api/capabilities/order
 * Body: { nodeIds: string[] }
 */
export async function getImplementationOrder(req: Request, res: Response) {
    try {
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
                name: node.intent?.userGoal || 'Unknown',
                kind: node.kind
            })),
            nodes: orderedNodes
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Validation error',
                details: error.errors
            });
        } else {
            res.status(500);
            throw error;
        }
    }
}

/* ---------- LLM Helper Endpoints ---------- */

/**
 * Get full context for LLM (node + dependencies + dependents + impact + artifacts)
 * GET /api/capabilities/:id/full-context
 */
export async function getFullContext(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const includeFullGraph = req.query.includeFullGraph === 'true';

        const node = await capabilityService.getNode(id);
        if (!node) {
            return res.status(404).json({
                error: 'Not found',
                message: `Capability node with id ${id} not found`
            });
        }

        // Get dependencies (depth 3 for comprehensive context)
        const dependencies = await capabilityService.findDependencies(id, 3);

        // Get dependents (depth 2)
        const dependents = await capabilityService.findDependents(id, 2);

        // Impact analysis
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
            artifacts: node.artifacts || { source: [], tests: [], documentation: [] },
            implementation: node.implementation || null
        };

        res.json(response);
    } catch (error) {
        res.status(500);
        throw error;
    }
}

/**
 * Link artifact to capability
 * POST /api/capabilities/:id/link-artifact
 * Body: { type: "source"|"test"|"documentation", path: string, metadata?: {} }
 */
export async function linkArtifact(req: Request, res: Response) {
    try {
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

        // Get existing node
        const node = await capabilityService.getNode(id);
        if (!node) {
            return res.status(404).json({
                error: 'Not found',
                message: `Capability node with id ${id} not found`
            });
        }

        // Initialize artifacts if not present
        const artifacts = node.artifacts || { source: [], tests: [], documentation: [] };

        // Build artifact entry
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

        // Update node
        await capabilityService.updateNode(id, { artifacts });

        res.json({
            success: true,
            message: `${type} artifact linked successfully`,
            artifact: { type, path }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Validation error',
                details: error.errors
            });
        } else {
            res.status(500);
            throw error;
        }
    }
}

/**
 * Find capabilities by file path
 * GET /api/capabilities/by-file/:filepath
 * Finds all capabilities linked to a specific source file, test, or documentation
 */
export async function findByFile(req: Request, res: Response) {
    try {
        const filepath = decodeURIComponent(req.params.filepath);

        const db = await import('../db.js').then(m => m.getDb());
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
    } catch (error) {
        res.status(500);
        throw error;
    }
}

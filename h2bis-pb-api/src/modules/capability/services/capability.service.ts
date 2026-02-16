import { getDb } from '../../../core/database/connection.js';
import { CapabilityNode } from '../../../core/schemas/capability_schema.js';

/**
 * Impact Analysis Result
 */
export interface ImpactAnalysis {
    nodeId: string;
    nodeName: string;
    directDependents: Array<{ id: string; name: string; kind: string }>;
    indirectDependents: Array<{ id: string; name: string; kind: string; depth: number }>;
    totalAffected: number;
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
}

/**
 * Capability Service - Business logic for capability node operations
 */
export class CapabilityService {
    /**
     * Validate that all dependencies exist
     * @private
     */
    private async validateDependenciesExist(dependencies: Array<{ on: string }>): Promise<void> {
        for (const dep of dependencies) {
            const exists = await this.getNode(dep.on);
            if (!exists) {
                throw new Error(`Dependency node "${dep.on}" does not exist`);
            }
        }
    }

    /**
     * Check if adding a dependency would create a cycle
     * @private
     */
    private async wouldCreateCycle(fromId: string, toId: string): Promise<boolean> {
        try {
            // If toId already depends on fromId (directly or transitively),
            // then adding fromId -> toId would create a cycle
            const dependencies = await this.findDependencies(toId, 10);
            return dependencies.some(dep => dep.id === fromId);
        } catch (error) {
            // If traversal fails, assume no cycle to allow creation
            return false;
        }
    }

    /**
     * Create a new capability node with validation
     * Validates referential integrity and prevents circular dependencies
     */
    async createNode(node: CapabilityNode): Promise<string> {
        const db = await getDb();

        // Validate dependencies exist (referential integrity)
        if (node.dependencies && node.dependencies.length > 0) {
            await this.validateDependenciesExist(node.dependencies);

            // Check for cycles
            for (const dep of node.dependencies) {
                const wouldCycle = await this.wouldCreateCycle(node.id, dep.on);
                if (wouldCycle) {
                    throw new Error(
                        `Cannot create dependency from "${node.id}" to "${dep.on}": would create circular dependency`
                    );
                }
            }
        }

        // Insert node
        const result = await db.collection('capabilities').insertOne(node);
        return result.insertedId.toString();
    }

    /**
     * Get a capability node by ID
     */
    async getNode(nodeId: string): Promise<CapabilityNode | null> {
        const db = await getDb();
        const node = await db.collection('capabilities').findOne({ id: nodeId });
        return node as CapabilityNode | null;
    }

    /**
     * Update a capability node with validation
     * Validates new dependencies if they are being updated
     */
    async updateNode(nodeId: string, updates: Partial<CapabilityNode>): Promise<boolean> {
        const db = await getDb();

        // If updating dependencies, validate them
        if (updates.dependencies) {
            await this.validateDependenciesExist(updates.dependencies);

            // Check for cycles with new dependencies
            for (const dep of updates.dependencies) {
                const wouldCycle = await this.wouldCreateCycle(nodeId, dep.on);
                if (wouldCycle) {
                    throw new Error(
                        `Cannot add dependency to "${dep.on}": would create circular dependency`
                    );
                }
            }
        }

        const result = await db.collection('capabilities').updateOne(
            { id: nodeId },
            { $set: updates }
        );
        return result.modifiedCount > 0;
    }

    /**
     * Delete a capability node
     * Also removes references to this node from other nodes' dependencies
     */
    async deleteNode(nodeId: string): Promise<boolean> {
        const db = await getDb();

        // Remove the node
        const deleteResult = await db.collection('capabilities').deleteOne({ id: nodeId });

        // Remove references from other nodes' dependencies
        await db.collection('capabilities').updateMany(
            { 'dependencies.on': nodeId },
            { $pull: { dependencies: { on: nodeId } } } as any
        );

        return deleteResult.deletedCount > 0;
    }

    /**
     * Find all dependencies of a node (nodes that this node depends on)
     * @param nodeId - The node to find dependencies for
     * @param depth - How many levels deep to traverse (default: 1)
     */
    async findDependencies(nodeId: string, depth: number = 1): Promise<CapabilityNode[]> {
        const db = await getDb();
        const visited = new Set<string>();
        const result: CapabilityNode[] = [];

        const traverse = async (currentId: string, currentDepth: number) => {
            if (currentDepth > depth || visited.has(currentId)) {
                return;
            }
            visited.add(currentId);

            const node = await db.collection('capabilities').findOne({ id: currentId }) as CapabilityNode | null;
            if (!node) return;

            if (currentDepth > 0) {
                result.push(node);
            }

            // Traverse dependencies
            for (const dep of node.dependencies || []) {
                await traverse(dep.on, currentDepth + 1);
            }
        };

        await traverse(nodeId, 0);
        return result;
    }

    /**
     * Find all nodes that depend on the given node (reverse dependencies)
     * @param nodeId - The node to find dependents for
     * @param depth - How many levels deep to traverse (default: 1)
     */
    async findDependents(nodeId: string, depth: number = 1): Promise<CapabilityNode[]> {
        const db = await getDb();
        const visited = new Set<string>();
        const result: CapabilityNode[] = [];

        const traverse = async (currentId: string, currentDepth: number) => {
            if (currentDepth > depth || visited.has(currentId)) {
                return;
            }
            visited.add(currentId);

            // Find all nodes that have currentId in their dependencies
            const dependents = await db.collection('capabilities')
                .find({ 'dependencies.on': currentId })
                .toArray() as unknown as CapabilityNode[];

            for (const dependent of dependents) {
                if (!visited.has(dependent.id)) {
                    result.push(dependent);
                    await traverse(dependent.id, currentDepth + 1);
                }
            }
        };

        await traverse(nodeId, 0);
        return result;
    }

    /**
     * Detect circular dependencies starting from a node
     * Returns array of node IDs forming the cycle, or empty array if no cycle
     */
    async detectCircularDependencies(nodeId: string): Promise<string[]> {
        const db = await getDb();
        const path: string[] = [];
        const visited = new Set<string>();

        const dfs = async (currentId: string): Promise<string[]> => {
            if (path.includes(currentId)) {
                // Found a cycle - return the cycle path
                const cycleStart = path.indexOf(currentId);
                return path.slice(cycleStart).concat(currentId);
            }

            if (visited.has(currentId)) {
                return [];
            }

            visited.add(currentId);
            path.push(currentId);

            const node = await db.collection('capabilities').findOne({ id: currentId }) as CapabilityNode | null;
            if (!node) {
                path.pop();
                return [];
            }

            for (const dep of node.dependencies || []) {
                const cycle = await dfs(dep.on);
                if (cycle.length > 0) {
                    return cycle;
                }
            }

            path.pop();
            return [];
        };

        return await dfs(nodeId);
    }

    /**
     * Get implementation order for a set of nodes (topological sort)
     * Nodes with no dependencies come first
     */
    async getImplementationOrder(nodeIds: string[]): Promise<CapabilityNode[]> {
        const db = await getDb();
        const nodes = await db.collection('capabilities')
            .find({ id: { $in: nodeIds } })
            .toArray() as unknown as CapabilityNode[];

        const nodeMap = new Map(nodes.map(n => [n.id, n]));
        const inDegree = new Map<string, number>();
        const adjacencyList = new Map<string, string[]>();

        // Initialize
        for (const node of nodes) {
            inDegree.set(node.id, 0);
            adjacencyList.set(node.id, []);
        }

        // Build graph
        for (const node of nodes) {
            for (const dep of node.dependencies || []) {
                if (nodeMap.has(dep.on)) {
                    adjacencyList.get(dep.on)!.push(node.id);
                    inDegree.set(node.id, (inDegree.get(node.id) || 0) + 1);
                }
            }
        }

        // Topological sort (Kahn's algorithm)
        const queue: string[] = [];
        const result: CapabilityNode[] = [];

        // Start with nodes that have no dependencies
        for (const [nodeId, degree] of inDegree.entries()) {
            if (degree === 0) {
                queue.push(nodeId);
            }
        }

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const currentNode = nodeMap.get(currentId)!;
            result.push(currentNode);

            for (const dependent of adjacencyList.get(currentId) || []) {
                const newDegree = (inDegree.get(dependent) || 0) - 1;
                inDegree.set(dependent, newDegree);
                if (newDegree === 0) {
                    queue.push(dependent);
                }
            }
        }

        return result;
    }

    /**
     * Analyze impact of changing a capability node
     * Returns all nodes that would be affected directly or indirectly
     */
    async analyzeImpact(nodeId: string): Promise<ImpactAnalysis> {
        const node = await this.getNode(nodeId);
        if (!node) {
            throw new Error(`Node ${nodeId} not found`);
        }

        // Get direct dependents
        const directDependents = await this.findDependents(nodeId, 1);

        // Get all dependents (indirect)
        const allDependents = await this.findDependents(nodeId, 10);
        const indirectDependents = allDependents.filter(
            n => !directDependents.some(d => d.id === n.id)
        );

        const totalAffected = allDependents.length;

        // Determine risk level
        let riskLevel: 'low' | 'medium' | 'high';
        if (totalAffected === 0) {
            riskLevel = 'low';
        } else if (totalAffected <= 3) {
            riskLevel = 'low';
        } else if (totalAffected <= 10) {
            riskLevel = 'medium';
        } else {
            riskLevel = 'high';
        }

        // Generate recommendations
        const recommendations: string[] = [];
        if (totalAffected > 0) {
            recommendations.push(`Review and test ${totalAffected} dependent node(s)`);
        }
        if (directDependents.length > 5) {
            recommendations.push('Consider breaking this node into smaller components');
        }
        if (indirectDependents.length > 10) {
            recommendations.push('High transitive dependency - changes may have wide-reaching effects');
        }
        if (node.dependencies?.some(d => d.type === 'hard')) {
            recommendations.push('Contains hard dependencies - ensure they remain stable');
        }

        return {
            nodeId: node.id,
            nodeName: node.intent?.userGoal || 'Unknown',
            directDependents: directDependents.map(n => ({
                id: n.id,
                name: n.intent?.userGoal || 'Unknown',
                kind: n.kind
            })),
            indirectDependents: indirectDependents.map(n => ({
                id: n.id,
                name: n.intent?.userGoal || 'Unknown',
                kind: n.kind,
                depth: 0 // Could calculate actual depth if needed
            })),
            totalAffected,
            riskLevel,
            recommendations
        };
    }
}

export const capabilityService = new CapabilityService();

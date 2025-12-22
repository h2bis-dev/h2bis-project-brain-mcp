import { apiService } from '../services/api.service.js';
import { z } from 'zod';

export const analyzeCapabilityImpactSchema = z.object({
    nodeId: z.string().min(1).describe('The ID of the capability node to analyze')
});

export async function analyzeCapabilityImpact({ nodeId }: z.infer<typeof analyzeCapabilityImpactSchema>) {
    try {
        const result = await apiService.analyzeCapabilityImpact(nodeId);
        const impact = result.impact;

        const directList = impact.directDependents.map((dep: any) =>
            `  - ${dep.name} (${dep.kind})`
        ).join('\n');

        const indirectList = impact.indirectDependents.length > 0
            ? '\n\nIndirect Dependents:\n' + impact.indirectDependents.map((dep: any) =>
                `  - ${dep.name} (${dep.kind})`
            ).join('\n')
            : '';

        const recommendations = impact.recommendations.length > 0
            ? '\n\nRecommendations:\n' + impact.recommendations.map((rec: string, i: number) =>
                `${i + 1}. ${rec}`
            ).join('\n')
            : '';

        const riskEmoji = impact.riskLevel === 'high' ? '🔴' : impact.riskLevel === 'medium' ? '🟡' : '🟢';

        return {
            content: [
                {
                    type: "text",
                    text: `Impact Analysis for "${impact.nodeName}"

${riskEmoji} Risk Level: ${impact.riskLevel.toUpperCase()}
📊 Total Affected: ${impact.totalAffected} node(s)

Direct Dependents (${impact.directDependents.length}):
${directList}${indirectList}${recommendations}`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error analyzing impact: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
}

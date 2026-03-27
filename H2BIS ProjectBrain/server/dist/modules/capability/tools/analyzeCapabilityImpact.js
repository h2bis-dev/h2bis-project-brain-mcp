import { apiService } from '../../../core/services/api.service.js';
export async function analyzeCapabilityImpact({ nodeId }) {
    try {
        const result = await apiService.analyzeCapabilityImpact(nodeId);
        const impact = result.impact;
        const directList = impact.directDependents.map((dep) => `  - ${dep.name} (${dep.kind})`).join('\n');
        const indirectList = impact.indirectDependents.length > 0
            ? '\n\nIndirect Dependents:\n' + impact.indirectDependents.map((dep) => `  - ${dep.name} (${dep.kind})`).join('\n')
            : '';
        const recommendations = impact.recommendations.length > 0
            ? '\n\nRecommendations:\n' + impact.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')
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
    }
    catch (error) {
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
//# sourceMappingURL=analyzeCapabilityImpact.js.map
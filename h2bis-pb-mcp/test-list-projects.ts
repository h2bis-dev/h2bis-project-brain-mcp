import { apiService } from './src/core/services/api.service.js';

async function testListProjects() {
    try {
        const endpoint = '/api/projects/mcp/list';
        console.log('Calling endpoint:', endpoint);
        
        const result = await apiService.get<any>(endpoint);
        console.log('Result type:', typeof result);
        console.log('Result keys:', Object.keys(result || {}));
        console.log('Result:', JSON.stringify(result, null, 2));
        
        if (result && result.data && result.data.projects) {
            console.log(`\n✅ Found ${result.data.projects.length} projects`);
            result.data.projects.slice(0, 3).forEach((p: any) => {
                console.log(`  - ${p.name} (${p._id})`);
            });
        } else {
            console.log('\n❌ Unexpected result structure');
        }
    } catch (error) {
        console.error('Error:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    }
}

testListProjects();

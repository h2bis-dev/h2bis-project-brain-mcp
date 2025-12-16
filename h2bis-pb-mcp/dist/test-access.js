import { DocumentService } from './services/index.js';
import { connectDB, disconnectDB } from './database/index.js';
async function testMCPAccess() {
    console.log('Testing MCP Server Database Access...\n');
    await connectDB();
    const service = new DocumentService();
    // Test 1: Find by name
    console.log('Test 1: Finding document with name="login"');
    const doc1 = await service.findOne('use_cases', { name: 'login' });
    console.log('Result:', doc1 ? 'FOUND ✅' : 'NOT FOUND ❌');
    if (doc1)
        console.log('Title:', doc1.title);
    // Test 2: Find by title
    console.log('\nTest 2: Finding document with title="User Login"');
    const doc2 = await service.findOne('use_cases', { title: 'User Login' });
    console.log('Result:', doc2 ? 'FOUND ✅' : 'NOT FOUND ❌');
    // Test 3: Find all
    console.log('\nTest 3: Finding all use_cases');
    const docs = await service.findMany('use_cases', {}, 5);
    console.log('Result:', docs.length, 'documents found');
    await disconnectDB();
    console.log('\n✅ All tests complete!');
}
testMCPAccess().catch(console.error);
//# sourceMappingURL=test-access.js.map
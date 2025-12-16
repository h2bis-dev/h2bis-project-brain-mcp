import { DocumentService } from './services/DocumentService.js';
import { getDatabase } from './database/index.js';
/**
 * Test script to verify MCP server tools locally
 */
async function testMCPTools() {
    console.log('🧪 Testing MCP Server Tools\n');
    try {
        // Connect to database
        console.log('1️⃣ Connecting to MongoDB...');
        const db = getDatabase();
        await db.connect();
        console.log('✅ Connected to MongoDB\n');
        // Initialize service
        const documentService = new DocumentService();
        // Test 1: List collections
        console.log('2️⃣ Testing database access...');
        const connection = db.getConnection();
        const collections = await connection.db?.listCollections().toArray();
        console.log(`✅ Found ${collections?.length || 0} collections:`, collections?.map(c => c.name));
        console.log('');
        // Test 2: Insert test document
        console.log('3️⃣ Inserting test document...');
        await documentService.insertDocument('test_collection', {
            name: 'Login',
            type: 'authentication',
            description: 'User login module',
            createdAt: new Date(),
        });
        console.log('✅ Test document inserted\n');
        // Test 3: Retrieve single document (simulate retrieve_document tool)
        console.log('4️⃣ Testing retrieve_document tool...');
        const singleDoc = await documentService.findOneDocument('test_collection', { name: 'Login' });
        console.log('✅ Retrieved document:', JSON.stringify(singleDoc, null, 2));
        console.log('');
        // Test 4: Retrieve multiple documents (simulate retrieve_documents tool)
        console.log('5️⃣ Testing retrieve_documents tool...');
        const multiDocs = await documentService.findDocuments('test_collection', { type: 'authentication' }, 10);
        console.log(`✅ Retrieved ${multiDocs.length} documents:`, JSON.stringify(multiDocs, null, 2));
        console.log('');
        // Test 5: Count documents
        console.log('6️⃣ Testing count...');
        const count = await documentService.countDocuments('test_collection', {});
        console.log(`✅ Total documents in test_collection: ${count}\n`);
        // Cleanup
        console.log('7️⃣ Cleaning up...');
        await documentService.deleteDocuments('test_collection', {});
        console.log('✅ Test documents deleted\n');
        // Disconnect
        await db.disconnect();
        console.log('✅ Disconnected from MongoDB\n');
        console.log('🎉 All tests passed! Your MCP server tools are working correctly.');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}
// Run tests
testMCPTools();
//# sourceMappingURL=test-mcp-tools.js.map
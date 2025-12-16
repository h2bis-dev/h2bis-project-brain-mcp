import { initDb, getDb, closeDb } from './db.js';
import { config } from './config/config.js';

async function testDatabaseConnection() {
    console.log('🧪 Testing MCP Server Database Connection\n');
    console.log(`📋 Configuration:`);
    console.log(`   MongoDB URI: ${config.mongoUri}`);
    console.log(`   Database: ${config.dbName}\n`);

    try {
        // Test 1: Initialize database connection
        console.log('Test 1: Initializing database connection...');
        await initDb();
        console.log('✅ Database connection initialized\n');

        // Test 2: Get database instance
        console.log('Test 2: Getting database instance...');
        const db = await getDb();
        console.log('✅ Database instance retrieved\n');

        // Test 3: List collections
        console.log('Test 3: Listing collections...');
        const collections = await db.listCollections().toArray();
        console.log(`✅ Found ${collections.length} collection(s):`);
        collections.forEach(col => console.log(`   - ${col.name}`));
        console.log('');

        // Test 4: Test insert operation
        console.log('Test 4: Testing insert operation...');
        const testCollection = 'mcp_test';
        const testDoc = {
            name: 'mcp_connection_test',
            timestamp: new Date(),
            message: 'MCP Server is working!'
        };
        const insertResult = await db.collection(testCollection).insertOne(testDoc);
        console.log(`✅ Inserted test document with ID: ${insertResult.insertedId}\n`);

        // Test 5: Test find operation
        console.log('Test 5: Testing find operation...');
        const foundDoc = await db.collection(testCollection).findOne({ name: 'mcp_connection_test' });
        console.log(`✅ Found test document:`, foundDoc?.message);
        console.log('');

        // Test 6: Test update operation
        console.log('Test 6: Testing update operation...');
        const updateResult = await db.collection(testCollection).updateOne(
            { name: 'mcp_connection_test' },
            { $set: { message: 'Updated message!', updated: new Date() } }
        );
        console.log(`✅ Updated ${updateResult.modifiedCount} document(s)\n`);

        // Test 7: Test delete operation
        console.log('Test 7: Testing delete operation...');
        const deleteResult = await db.collection(testCollection).deleteOne({ name: 'mcp_connection_test' });
        console.log(`✅ Deleted ${deleteResult.deletedCount} document(s)\n`);

        // Test 8: Check use_case_db collections
        console.log('Test 8: Checking use_case_db for existing data...');
        const useCasesCount = await db.collection('use_cases').countDocuments();
        console.log(`✅ Found ${useCasesCount} document(s) in use_cases collection\n`);

        if (useCasesCount > 0) {
            console.log('Sample document from use_cases:');
            const sampleDoc = await db.collection('use_cases').findOne();
            console.log(JSON.stringify(sampleDoc, null, 2));
        }

        console.log('\n✅ All database tests passed!');
        console.log('🎉 MCP Server is fully functional and ready to use!\n');

    } catch (error) {
        console.error('❌ Test failed:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    } finally {
        await closeDb();
        console.log('🔌 Database connection closed');
    }
}

testDatabaseConnection();

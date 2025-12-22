import { getDb } from '../db.js';

/**
 * Create optimized indexes for capability collection
 * Critical for graph query performance
 */
export async function createCapabilityIndexes() {
    const db = await getDb();
    const collection = db.collection('capabilities');

    console.log('Creating capability collection indexes...');

    try {
        // 1. CRITICAL: Index for dependency lookups (most frequently used in graph traversal)
        await collection.createIndex({ 'dependencies.on': 1 });
        console.log('  ✅ Created index on dependencies.on');

        // 2. Primary ID index (unique constraint)
        await collection.createIndex({ id: 1 }, { unique: true });
        console.log('  ✅ Created unique index on id');

        // 3. Kind-based queries (filter by use_case, service, etc.)
        await collection.createIndex({ kind: 1 });
        console.log('  ✅ Created index on kind');

        // 4. Lifecycle status queries
        await collection.createIndex({ 'lifecycle.status': 1 });
        console.log('  ✅ Created index on lifecycle.status');

        // 5. Implementation status queries (for LLM to find incomplete work)
        await collection.createIndex({
            'implementation.status': 1,
            'implementation.completionPercentage': 1
        });
        console.log('  ✅ Created compound index on implementation status');

        // 6. Artifact path lookups (find capabilities by file path)
        await collection.createIndex({ 'artifacts.source.path': 1 });
        await collection.createIndex({ 'artifacts.tests.path': 1 });
        await collection.createIndex({ 'artifacts.documentation.path': 1 });
        console.log('  ✅ Created indexes on artifact paths');

        // 7. Text search index for finding capabilities by description
        await collection.createIndex({
            'intent.userGoal': 'text',
            'intent.systemResponsibility': 'text',
            tags: 'text'
        });
        console.log('  ✅ Created text index for search');

        console.log('✅ All capability indexes created successfully');
    } catch (error) {
        if (error instanceof Error && error.message.includes('already exists')) {
            console.log('ℹ️  Indexes already exist, skipping creation');
        } else {
            console.error('❌ Error creating indexes:', error);
            throw error;
        }
    }
}

/**
 * Drop all capability indexes (for cleanup/reset)
 */
export async function dropCapabilityIndexes() {
    const db = await getDb();
    const collection = db.collection('capabilities');

    console.log('Dropping capability collection indexes...');

    try {
        await collection.dropIndexes();
        console.log('✅ All indexes dropped');
    } catch (error) {
        console.error('❌ Error dropping indexes:', error);
        throw error;
    }
}

/**
 * List all current indexes on capability collection
 */
export async function listCapabilityIndexes() {
    const db = await getDb();
    const collection = db.collection('capabilities');

    console.log('Current indexes on capabilities collection:');
    const indexes = await collection.listIndexes().toArray();

    indexes.forEach((index) => {
        console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    return indexes;
}

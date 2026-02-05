/**
 * MongoDB Migration Script
 * 
 * Purpose: Assign all use cases to the "h2bis-pb" project
 * 
 * Run this script with: node --require ts-node/register scripts/migrate-use-cases-to-project.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/use_case_db';
const TARGET_PROJECT_NAME = 'h2bis-pb';

// Define schemas locally for migration
const ProjectSchema = new mongoose.Schema({
    _id: String,
    name: String,
});

const UseCaseSchema = new mongoose.Schema({
    projectId: String,
}, { strict: false }); // Allow other fields

const Project = mongoose.model('Project', ProjectSchema);
const UseCase = mongoose.model('UseCase', UseCaseSchema);

async function migrate() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Step 1: Find the h2bis-pb project
        const targetProject = await Project.findOne({ name: TARGET_PROJECT_NAME });

        if (!targetProject) {
            console.error(`❌ Project "${TARGET_PROJECT_NAME}" not found!`);
            console.log('\n📋 Available projects:');
            const allProjects = await Project.find({});
            allProjects.forEach(p => console.log(`  - ${p.name} (ID: ${p._id})`));
            process.exit(1);
        }

        console.log(`✅ Found project: ${targetProject.name} (ID: ${targetProject._id})`);

        // Step 2: Count use cases by project
        const useCaseCounts = await UseCase.aggregate([
            { $group: { _id: '$projectId', count: { $sum: 1 } } }
        ]);

        console.log('\n📊 Current use case distribution:');
        for (const group of useCaseCounts) {
            const projectName = group._id || '(no project)';
            console.log(`  - ${projectName}: ${group.count} use cases`);
        }

        // Step 3: Update all use cases to the target project
        const result = await UseCase.updateMany(
            {}, // Match all use cases
            { $set: { projectId: targetProject._id } }
        );

        console.log(`\n✅ Updated ${result.modifiedCount} use cases to project "${TARGET_PROJECT_NAME}"`);

        // Step 4: Verify migration
        const verifyCount = await UseCase.countDocuments({ projectId: targetProject._id });
        const totalCount = await UseCase.countDocuments({});

        console.log(`\n✅ Verification:`);
        console.log(`  - Total use cases: ${totalCount}`);
        console.log(`  - Assigned to ${TARGET_PROJECT_NAME}: ${verifyCount}`);

        if (verifyCount === totalCount) {
            console.log(`\n🎉 Migration successful! All use cases now belong to "${TARGET_PROJECT_NAME}"`);
        } else {
            console.warn(`\n⚠️  Warning: Not all use cases were assigned!`);
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
    }
}

// Run migration
migrate();

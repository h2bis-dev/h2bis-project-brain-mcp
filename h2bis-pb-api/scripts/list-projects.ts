/**
 * List all projects in MongoDB
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/h2bis-project-brain';

const ProjectSchema = new mongoose.Schema({
    _id: String,
    name: String,
    description: String,
    status: String,
    owner: String,
}, { strict: false });

const Project = mongoose.model('Project', ProjectSchema);

async function listProjects() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const projects = await Project.find({}).select('_id name description status').lean();

        if (projects.length === 0) {
            console.log('❌ No projects found in database');
            return;
        }

        console.log(`📋 Found ${projects.length} project(s):\n`);
        projects.forEach((project, index) => {
            console.log(`${index + 1}. Name: "${project.name}"`);
            console.log(`   ID: ${project._id}`);
            console.log(`   Status: ${project.status || 'N/A'}`);
            if (project.description) {
                console.log(`   Description: ${project.description.substring(0, 60)}${project.description.length > 60 ? '...' : ''}`);
            }
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
    }
}

listProjects();

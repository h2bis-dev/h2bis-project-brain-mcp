/**
 * Query projects from API
 */

const API_BASE_URL = 'http://localhost:4000';

async function getProjects() {
    try {
        const filter = encodeURIComponent('{}');
        const url = `${API_BASE_URL}/api/knowledge?collection=projects&filter=${filter}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.document) {
            const projects = Array.isArray(data.document) ? data.document : [data.document];

            console.log(`\n📋 Found ${projects.length} project(s):\n`);
            projects.forEach((project, index) => {
                console.log(`${index + 1}. Name: "${project.name}"`);
                console.log(`   ID: ${project._id}`);
                console.log(`   Status: ${project.status || 'N/A'}`);
                if (project.description) {
                    console.log(`   Description: ${project.description.substring(0, 60)}${project.description.length > 60 ? '...' : ''}`);
                }
                console.log('');
            });

            return projects;
        } else {
            console.log('❌ No projects found');
            return [];
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        return [];
    }
}

getProjects();

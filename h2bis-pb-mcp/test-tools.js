import { tools } from './dist/tools/index.js';

console.log(`\n📦 Total tools registered: ${tools.length}\n`);

tools.forEach((tool, index) => {
    console.log(`${index + 1}. ${tool.name}`);
});

// Check for specific tool
const useCaseTool = tools.find(t => t.name === 'getUseCaseWithProjectContext');
if (useCaseTool) {
    console.log(`\n✅ getUseCaseWithProjectContext found!`);
    console.log(`   Description: ${useCaseTool.description.substring(0, 100)}...`);
} else {
    console.log(`\n❌ getUseCaseWithProjectContext NOT FOUND!`);
}

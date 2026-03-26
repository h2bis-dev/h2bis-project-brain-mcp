/**
 * Build script — copies the compiled MCP server into the extension's server/ folder
 * and installs only the production dependencies needed at runtime.
 *
 * Run: node scripts/build.mjs
 */

import { cpSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const extRoot = resolve(__dirname, '..');
const mcpRoot = resolve(extRoot, '../h2bis-pb-mcp');

// ── 1. Build the MCP server (TypeScript → JavaScript) ────────────────────
console.log('1/4  Building MCP server…');
execSync('npm run build', { cwd: mcpRoot, stdio: 'inherit' });

// ── 2. Clean previous server/ contents ───────────────────────────────────
const serverDir = resolve(extRoot, 'server');
if (existsSync(serverDir)) {
  rmSync(serverDir, { recursive: true });
}
mkdirSync(resolve(serverDir, 'dist'), { recursive: true });

// ── 3. Copy compiled output + package.json ───────────────────────────────
console.log('2/4  Copying server files…');
cpSync(resolve(mcpRoot, 'dist'), resolve(serverDir, 'dist'), { recursive: true });
cpSync(resolve(mcpRoot, 'package.json'), resolve(serverDir, 'package.json'));

// Strip mongodb/mongoose from server/package.json — they are not imported
// by the MCP server and add ~50 MB of unnecessary bulk to the VSIX.
const serverPkg = JSON.parse(readFileSync(resolve(serverDir, 'package.json'), 'utf-8'));
delete serverPkg.dependencies?.mongodb;
delete serverPkg.dependencies?.mongoose;
delete serverPkg.devDependencies;
delete serverPkg.bin;
delete serverPkg.files;
delete serverPkg.scripts;
writeFileSync(resolve(serverDir, 'package.json'), JSON.stringify(serverPkg, null, 2));

// ── 4. Install production-only dependencies ──────────────────────────────
console.log('3/4  Installing server runtime dependencies…');
execSync('npm install --omit=dev', { cwd: serverDir, stdio: 'inherit' });

console.log('4/4  Server build complete ✓');

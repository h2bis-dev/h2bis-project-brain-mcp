import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';

//  Env loading priority 
//
// 1. process.env   already set (e.g. VS Code mcp.json "env" block)   WINS
// 2. local .env    repo development  (h2bis-pb-mcp/.env)
// 3. user-level    global npm install (~/.config/h2bis-mcp/.env)
//
// dotenv.config() is a no-op for variables already in process.env,
// so the priority above is naturally preserved.
// 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 2. Local .env (works when running from the repo, e.g. `npm run dev`)
const localEnv = resolve(__dirname, '../../../.env');
if (existsSync(localEnv)) {
  dotenv.config({ path: localEnv });
}

// 3. User-level config (~/.config/h2bis-mcp/.env)
//    Used when the package is installed globally: npm install -g @h2bis/mcp
const userEnv = resolve(homedir(), '.config', 'h2bis-mcp', '.env');
if (existsSync(userEnv)) {
  dotenv.config({ path: userEnv });
}

export const config = {
  serverName: process.env.SERVER_NAME || 'h2bis-pb-mcp',
  serverVersion: process.env.SERVER_VERSION || '1.0.0',

  // Cloud API URL  override via env var, VS Code mcp.json "env" block, or user config
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4000',

  // API Key  generate via POST /api/auth/api-keys (admin only)
  apiKey: process.env.API_KEY || '',

  // Legacy JWT authentication (fallback)
  apiToken: process.env.API_TOKEN || '',
  apiEmail: process.env.API_EMAIL || '',
  apiPassword: process.env.API_PASSWORD || '',
};

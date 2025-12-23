# RESTART API SERVER

## The Problem
The API server is running the OLD code (started 44 minutes ago, before we added capability auto-generation).

## Solution
You need to restart the API server to load the NEW code.

## Steps:

### Option 1: Using the Terminal in VS Code

1. Find the terminal running `npm start` in `h2bis-pb-api`
2. Press `Ctrl+C` to stop it
3. Run `npm start` again

### Option 2: Using PowerShell

```powershell
# Navigate to API directory
cd c:\My_work\RnD\project_brain_prototype_node\h2bis-pb\h2bis-pb-api

# Stop the current process (if running)
# Press Ctrl+C in the terminal running npm start

# Start the server again
npm start
```

## How to Verify It's Working

After restarting, insert a use case and check the console output. You should see:
```
✅ Auto-generated capability cap-uc-user-registration from use case uc-user-registration
```

## Quick Test

After restarting the API server, use this cURL command:

```bash
curl -X POST http://localhost:3000/api/knowledge \
  -H "Content-Type: application/json" \
  -d @examples/uc-user-login.json
```

Expected response:
```json
{
  "insertedId": "...",
  "capabilityGenerated": true,
  "capabilityId": "..."
}
```

## Why This Happened

The API server uses `nodemon` which auto-restarts on file changes, but:
1. We made changes to TypeScript files
2. TypeScript needs to be compiled to JavaScript
3. We ran `npm run build` which compiled the files
4. But the server was already running with the old compiled code
5. Nodemon doesn't detect changes in `dist/` folder (only `src/`)

## Prevention for Next Time

When making changes:
1. Stop the server (`Ctrl+C`)
2. Make your code changes
3. Build (`npm run build`)
4. Start the server (`npm start`)

OR use `npm run dev` if it's configured to watch TypeScript files.

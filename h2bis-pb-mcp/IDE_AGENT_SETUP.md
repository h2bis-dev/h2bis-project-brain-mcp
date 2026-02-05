# MCP Server IDE Agent Access Guide

## Quick Answer

**YES! Your MCP server can be accessed by Antigravity and other IDE-based AI agents!**

The good news: Your MCP server code is already perfect and doesn't need any changes. You just need to configure each AI client to connect to it.

## What You Need to Know

### Why Claude Desktop Works
Claude Desktop is configured via `%APPDATA%\Claude\claude_desktop_config.json` with:
```json
{
  "mcpServers": {
    "h2bis-pb-mcp": {
      "command": "node",
      "args": ["c:/My_work/RnD/project_brain_prototype_node/h2bis-pb/h2bis-pb-mcp/dist/index.js"]
    }
  }
}
```

### Why Antigravity Can't Access It (Yet)
Antigravity hasn't been configured to connect to your MCP server. Each AI client needs its own configuration.

## How to Enable Access for VS Code AI Agents

### Option 1: Workspace Configuration (Recommended)
Create `.vscode/settings.json` in your workspace:

```json
{
  "mcp.servers": {
    "h2bis-pb-mcp": {
      "command": "node",
      "args": ["c:/My_work/RnD/project_brain_prototype_node/h2bis-pb/h2bis-pb-mcp/dist/index.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

### Option 2: User Settings (Global)
In VS Code:
1. Press `Ctrl+Shift+P`
2. Search for "Preferences: Open User Settings (JSON)"
3. Add the same MCP configuration

### For Specific Extensions

#### Cline Extension
File: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
```json
{
  "mcpServers": {
    "h2bis-pb-mcp": {
      "command": "node",
      "args": ["c:/My_work/RnD/project_brain_prototype_node/h2bis-pb/h2bis-pb-mcp/dist/index.js"]
    }
  }
}
```

#### Continue Extension
File: `%USERPROFILE%\.continue\config.json`
```json
{
  "experimental": {
    "modelContextProtocol": true
  },
  "mcpServers": {
    "h2bis-pb-mcp": {
      "command": "node",
      "args": ["c:/My_work/RnD/project_brain_prototype_node/h2bis-pb/h2bis-pb-mcp/dist/index.js"]
    }
  }
}
```

## For Antigravity Specifically

Antigravity (Google's AI agent) configuration depends on how Google implements MCP support. Try these approaches:

### Method 1: Check Extension Settings
1. Open VS Code Settings
2. Search for "MCP" or "Model Context Protocol"
3. Look for Antigravity-specific MCP configuration options

### Method 2: Check for Config Files
Look for configuration files in:
```
%APPDATA%\Code\User\globalStorage\google.antigravity\
%USERPROFILE%\.antigravity\
C:\Users\<YourUser>\AppData\Local\Google\Antigravity\
```

### Method 3: Workspace Settings
Add to your workspace `.vscode/settings.json`:
```json
{
  "antigravity.mcp.servers": {
    "h2bis-pb-mcp": {
      "command": "node",
      "args": ["c:/My_work/RnD/project_brain_prototype_node/h2bis-pb/h2bis-pb-mcp/dist/index.js"]
    }
  }
}
```

## Testing the Connection

### 1. Verify MCP Server Runs
```bash
cd c:\My_work\RnD\project_brain_prototype_node\h2bis-pb\h2bis-pb-mcp
npm run build
npm start
```

Expected output:
```
✅ h2bis-pb-mcp v1.0.0 running
🔗 API connection: <your-mongodb-uri>
```

Press `Ctrl+C` to stop (the AI client will start it automatically when needed).

### 2. Restart Your IDE
After adding the configuration, restart VS Code completely.

### 3. Ask the AI to Use a Tool
Try asking:
> "Can you list all collections in the database using the MCP server?"

If configured correctly, the AI should be able to use the `listCollections` tool.

## Available MCP Tools

Your server exposes these tools:
1. **listCollections** - List all MongoDB collections
2. **findDocument** - Find documents by filter
3. **insertDocument** - Insert new documents
4. **updateDocument** - Update existing documents
5. **deleteDocument** - Delete documents

## Troubleshooting

### AI Can't See the MCP Tools
- ✅ Ensure MCP server is built: `npm run build`
- ✅ Check MongoDB is running: `mongosh`
- ✅ Verify the path in config matches your actual file location
- ✅ Restart VS Code completely
- ✅ Check AI extension supports MCP (read extension docs)

### Multiple Instances Running
This is **normal**! Each AI client (Claude Desktop, VS Code extension, etc.) runs its own instance of the MCP server. They all connect to the same MongoDB database.

### Permission Errors
Make sure:
- MongoDB service is running
- The path `c:/My_work/RnD/project_brain_prototype_node/h2bis-pb/h2bis-pb-mcp/dist/index.js` exists
- You have read/write permissions to the MongoDB database

## Key Takeaways

✅ **No code changes needed** - Your MCP server is already compatible  
✅ **Configure each client separately** - Each AI agent needs its own config  
✅ **Multiple clients can coexist** - They all share the same MongoDB  
✅ **Check extension docs** - Each IDE extension may configure MCP differently  

## Next Steps

1. ✅ Choose which AI agent/extension you want to enable
2. ✅ Add the MCP configuration to that agent's config file
3. ✅ Restart the IDE/extension
4. ✅ Test by asking the AI to use one of the tools
5. ✅ Repeat for other AI agents as needed

## Additional Notes

If you want to check if Antigravity specifically supports MCP servers, you can:
1. Check the Antigravity documentation
2. Look for MCP-related settings in VS Code
3. Ask in Antigravity support channels
4. Check if there's a public API or config schema

The MCP protocol is becoming an industry standard, so more AI agents are adding support over time!

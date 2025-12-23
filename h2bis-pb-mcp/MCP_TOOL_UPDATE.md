# MCP Tool Update - Capability Auto-Generation Support

## What Was the Problem?

When you inserted `uc-user-registration.json` using the MCP `insertDocument` tool, it only showed:
```
Inserted document with ID: 507f1f77bcf86cd799439011
```

But it SHOULD have shown:
```
✅ Inserted document with ID: 507f1f77bcf86cd799439011
✅ Auto-generated capability with ID: 507f1f77bcf86cd799439012

📊 Summary:
  - UseCase stored in "use_cases" collection
  - Capability stored in "capabilities" collection
  - Both schemas are synchronized
```

## Root Cause

The MCP tool (`insertDocument.ts`) and API service (`api.service.ts`) were only returning and displaying the `insertedId` field. They weren't showing the new fields we added:
- `capabilityGenerated` (boolean)
- `capabilityId` (string)

## What Was Fixed

### 1. Updated API Service (`h2bis-pb-mcp/src/services/api.service.ts`)
Changed the return type to include capability fields:
```typescript
async insertDocument(...): Promise<{ 
    insertedId: string; 
    capabilityGenerated?: boolean;  // NEW
    capabilityId?: string;           // NEW
}>
```

### 2. Updated MCP Tool (`h2bis-pb-mcp/src/tools/insertDocument.ts`)
Enhanced the response message to show:
- ✅ Document insertion confirmation
- ✅ Capability auto-generation status
- 📊 Summary of what was stored where

### 3. Rebuilt MCP Server
Ran `npm run build` to compile the TypeScript changes.

## Next Steps

### IMPORTANT: Restart the MCP Server

The MCP server is currently running with the OLD code. You need to restart it:

1. **Stop the current MCP server**:
   - Find the terminal running `npm start` in `h2bis-pb-mcp`
   - Press `Ctrl+C` to stop it

2. **Start it again**:
   ```bash
   cd c:\My_work\RnD\project_brain_prototype_node\h2bis-pb\h2bis-pb-mcp
   npm start
   ```

3. **Restart Claude Desktop** (if needed):
   - Close Claude Desktop completely
   - Reopen it
   - This ensures it reconnects to the updated MCP server

## Testing the Fix

After restarting, try inserting a use case again using the MCP tool:

```
Use the insertDocument MCP tool with:
{
  "collectionName": "use_cases",
  "json": "<paste the uc-user-login.json content here>"
}
```

You should now see:
```
✅ Inserted document with ID: ...
✅ Auto-generated capability with ID: cap-uc-user-login

📊 Summary:
  - UseCase stored in "use_cases" collection
  - Capability stored in "capabilities" collection
  - Both schemas are synchronized
```

## Verifying Capability Was Created

Use the MCP tool `getCapabilityDependencies`:
```
{
  "nodeId": "cap-uc-user-login",
  "depth": 2
}
```

This should show the capability and its dependencies (like `cap-uc-user-registration`).

## Why Capabilities Weren't Generated Before

The capability auto-generation WAS working in the API! The issue was just that the MCP tool wasn't showing the full response. 

If you check the database directly, you'll likely find that capabilities WERE created when you inserted use cases - you just didn't see the confirmation message.

To verify, use the `findDocument` MCP tool:
```
{
  "collectionName": "capabilities",
  "filter": { "id": "cap-uc-user-registration" }
}
```

If it returns a document, the capability was created successfully!

## Summary

✅ **API** - Already working correctly (auto-generates capabilities)
✅ **MCP Service** - Updated to return full response
✅ **MCP Tool** - Updated to display capability generation status
⏳ **Next Step** - Restart MCP server to apply changes

# Instructions for Inserting Use Cases via MCP Tools in Claude Desktop

## Use Cases Created:
1. User Registration (uc-user-registration.json)
2. User Login (uc-user-login.json)

## How to Insert Using MCP Tools in Claude Desktop:

### Step 1: Insert User Registration

Ask Claude Desktop to use the MCP tool:

```
Please use the insertDocument MCP tool to insert the following use case:

{
  "collectionName": "use_cases",
  "document": <paste content from examples/uc-user-registration.json>
}
```

### Step 2: Insert User Login

Ask Claude Desktop to use the MCP tool:

```
Please use the insertDocument MCP tool to insert the following use case:

{
  "collectionName": "use_cases",
  "document": <paste content from examples/uc-user-login.json>
}
```

## Alternative: Use cURL Commands

If you prefer to use the API directly:

### Insert User Registration:
```bash
curl -X POST http://localhost:3000/api/knowledge \
  -H "Content-Type: application/json" \
  -d @examples/uc-user-registration.json
```

### Insert User Login:
```bash
curl -X POST http://localhost:3000/api/knowledge \
  -H "Content-Type: application/json" \
  -d @examples/uc-user-login.json
```

## Expected Response:

For each insertion, you should receive:
```json
{
  "insertedId": "...",
  "capabilityGenerated": true,
  "capabilityId": "..."
}
```

This confirms:
- ✅ Use case was inserted into the "use_cases" collection
- ✅ Capability was auto-generated into the "capabilities" collection
- ✅ Both are linked by ID (uc-user-registration → cap-uc-user-registration)

## Verify Insertion:

Use the findDocument MCP tool:
```
Please use the findDocument MCP tool with:
{
  "collectionName": "use_cases",
  "filter": { "key": "uc-user-registration" }
}
```

## Check Auto-Generated Capabilities:

Use the getCapabilityDependencies MCP tool:
```
Please use the getCapabilityDependencies MCP tool with:
{
  "nodeId": "cap-uc-user-login",
  "depth": 2
}
```

This should show that cap-uc-user-login depends on cap-uc-user-registration.

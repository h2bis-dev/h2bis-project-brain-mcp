# H2BIS ProjectBrain MCP Server - Quick Reference

## Server Information
- **Name**: h2bis-pb-mcp
- **Version**: 1.0.0
- **Database**: MongoDB (use_case_db)
- **Connection**: mongodb://localhost:27017/

## Quick Start

### 1. Start the Server
```bash
cd c:\My_work\RnD\project_brain_prototype_node\h2bis-pb\h2bis-pb-mcp
npm start
```

### 2. Configure Claude Desktop
Edit your Claude Desktop config file and add:
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

### 3. Restart Claude Desktop

## Available Tools

### 1. listCollections
List all collections in the database
```json
{} // No parameters needed
```

### 2. findDocument
Find a document in a collection
```json
{
  "collectionName": "use_cases",
  "filter": "{\"name\": \"login\"}"
}
```

### 3. insertDocument
Insert a new document
```json
{
  "collectionName": "use_cases",
  "json": "{\"name\": \"test\", \"title\": \"Test Case\"}"
}
```

### 4. updateDocument
Update an existing document
```json
{
  "collectionName": "use_cases",
  "filter": "{\"name\": \"test\"}",
  "update": "{\"$set\": {\"title\": \"Updated Title\"}}"
}
```

### 5. deleteDocument
Delete a document
```json
{
  "collectionName": "use_cases",
  "filter": "{\"name\": \"test\"}"
}
```

## Development Commands

```bash
# Build TypeScript → JavaScript
npm run build

# Start production server
npm start

# Development mode with auto-reload
npm run dev

# Watch mode (auto-compile on changes)
npm run watch
```

## File Structure

```
src/
├── index.ts              # Server entry point
├── db.ts                 # Database connection
├── config/
│   └── config.ts        # Configuration
└── tools/
    ├── index.ts         # Tool registry
    ├── insertDocument.ts
    ├── findDocument.ts
    ├── updateDocument.ts
    ├── deleteDocument.ts
    └── listCollections.ts
```

## Environment Variables (.env)

```bash
MONGODB_URI=mongodb://localhost:27017/
DB_NAME=use_case_db
SERVER_NAME=h2bis-pb-mcp
SERVER_VERSION=1.0.0
```

## Troubleshooting

### Server won't start
1. Check MongoDB is running: `mongosh`
2. Verify connection string in `.env`
3. Check build completed: `npm run build`

### Tools not appearing in Claude
1. Restart Claude Desktop completely
2. Check server is running
3. Verify config file path is correct

### Database connection errors
1. Ensure MongoDB service is running
2. Check database name matches in `.env`
3. Verify network/firewall settings

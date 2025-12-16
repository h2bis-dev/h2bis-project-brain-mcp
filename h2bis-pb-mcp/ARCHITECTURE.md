# H2BIS-PB-MCP Architecture

> Current implementation overview - **Updated**: 2025-12-16

---

## System Overview

MCP (Model Context Protocol) server that exposes MongoDB database operations as tools for Claude Desktop. Enables AI to perform complete CRUD operations on local MongoDB instance.

**Database**: `use_case_db`  
**Collections**: Dynamic (any collection in the database)  
**Transport**: stdio (standard input/output)  
**Tools**: 5 (insertDocument, findDocument, updateDocument, deleteDocument, listCollections)

---

## Folder Structure

```
h2bis-pb-mcp/
├── src/
│   ├── config/
│   │   └── config.ts           # Environment configuration with dotenv
│   ├── tools/
│   │   ├── index.ts            # Tool registry
│   │   ├── insertDocument.ts   # Insert tool
│   │   ├── findDocument.ts     # Find tool
│   │   ├── updateDocument.ts   # Update tool
│   │   ├── deleteDocument.ts   # Delete tool
│   │   └── listCollections.ts  # List collections tool
│   ├── db.ts                   # Database singleton with native MongoDB client
│   ├── index.ts                # MCP server entry point
│   └── test-db-connection.ts   # Database connection test script
├── dist/                       # Compiled JavaScript output
├── .env                        # Environment variables
├── package.json
├── tsconfig.json
├── QUICK_REFERENCE.md          # Quick usage guide
├── INSTRUCTIONS.md             # Development guidelines
├── ARCHITECTURE.md             # This file
└── CHANGELOG.md                # Historical changes
```

---

## Layer Responsibilities

### 1. Config Layer (`config/config.ts`)
**Purpose**: Load and export configuration with environment variable support  
**Lines**: ~10

```typescript
export const config = {
  mongoUri: string,      // MongoDB connection string
  dbName: string,        // Database name
  serverName: string,    // MCP server name
  serverVersion: string  // Server version
}
```

**Features**:
- Dotenv integration for `.env` file loading
- Environment variables with sensible defaults

---

### 2. Database Layer (`db.ts`)
**Purpose**: Centralized MongoDB connection management  
**Lines**: ~47

**Functions**:
- `initDb()` - Initialize database connection (singleton pattern)
- `getDb()` - Get database instance (auto-initializes if needed)
- `closeDb()` - Graceful shutdown with cleanup

**Implementation**:
- Native MongoDB client (not Mongoose)
- Singleton pattern for connection reuse
- Automatic reconnection handling
- Error logging to stderr

**Connection String**: `mongodb://localhost:27017/` + `dbName: 'use_case_db'`

---

### 3. Tools Layer (`tools/`)
**Purpose**: MCP tool definitions with Zod validation  

**Structure**: One file per tool + registry

#### Tool Files:
1. **insertDocument.ts** (~32 lines)
   - Insert documents into collections
   - Schema: `collectionName` (string), `json` (string)
   
2. **findDocument.ts** (~32 lines)
   - Find single document by filter
   - Schema: `collectionName` (string), `filter` (string, default: '{}')
   
3. **updateDocument.ts** (~34 lines)
   - Update documents with MongoDB update operators
   - Schema: `collectionName`, `filter`, `update`
   - Returns matched and modified counts
   
4. **deleteDocument.ts** (~32 lines)
   - Delete documents by filter
   - Schema: `collectionName`, `filter`
   - Returns deletion count
   
5. **listCollections.ts** (~31 lines)
   - List all available collections
   - Schema: empty object (no parameters)

#### Registry (index.ts):
```typescript
export const tools = [
  {
    name: string,
    description: string,
    schema: ZodObject,
    handler: async function
  },
  ...
]
```

---

### 4. Server Layer (`index.ts`)
**Purpose**: MCP server initialization and tool registration  
**Lines**: ~56

**Flow**:
1. Initialize database connection (`initDb()`)
2. Create MCP Server instance
3. Register all tools from tools array
4. Connect stdio transport
5. Setup graceful shutdown handlers (SIGINT, SIGTERM)

**Error Handling**: 
- Comprehensive try/catch at startup
- Per-tool error handling in handlers
- Process exit on critical failures

**Graceful Shutdown**:
- SIGINT handler closes DB connection
- SIGTERM handler closes DB connection
- Clean process termination

---

## Data Flow

### Tool Execution Flow

```
Claude Desktop
    ↓ (stdio)
MCP Server (index.ts)
    ↓ (tool invocation)
Tool Handler (tools/*.ts)
    ↓ (Zod validation)
    ↓ (parse JSON strings)
Database Layer (db.ts)
    ↓ (getDb())
MongoDB Native Client
    ↓ (CRUD operation)
MongoDB Database (use_case_db)
    ↓ (result)
Tool Handler
    ↓ (format response)
MCP Server
    ↓ (stdio)
Claude Desktop
```

---

## Key Design Decisions

### ✅ **Current Implementation**

1. **Native MongoDB Client**
   - Removed Mongoose dependency from runtime
   - Direct MongoDB driver for better performance
   - Singleton pattern for connection efficiency

2. **Simple, Flat Structure**
   - One file per tool
   - No complex abstractions or base classes
   - Clear, straightforward code flow

3. **Comprehensive CRUD**
   - Complete database operations suite
   - Insert, Find, Update, Delete + List
   - Ready for production use

4. **Proper Error Handling**
   - Try/catch in all tool handlers
   - Meaningful error messages
   - Graceful degradation

5. **Environment Configuration**
   - Dotenv for easy configuration
   - Sensible defaults
   - No hardcoded values

### ❌ **What We Removed**

- Duplicate config files (`config/index.ts`)
- Mongoose-based database layer
- Services layer abstraction
- Old database/index.ts
- Incorrect nested src/src/ directory
- test-access.ts (replaced with test-db-connection.ts)

---

## Current Tools

### 1. insertDocument

**Purpose**: Insert a document into a collection

**Input**:
```json
{
  "collectionName": "use_cases",
  "json": "{\"name\": \"test\", \"title\": \"Test Case\"}"
}
```

**Response**: Inserted document with ID

---

### 2. findDocument

**Purpose**: Find a single document by filter

**Input**:
```json
{
  "collectionName": "use_cases",
  "filter": "{\"name\": \"login\"}"
}
```

**Response**: JSON document or "No document found"

---

### 3. updateDocument

**Purpose**: Update document(s) with MongoDB operators

**Input**:
```json
{
  "collectionName": "use_cases",
  "filter": "{\"name\": \"login\"}",
  "update": "{\"$set\": {\"title\": \"Updated Title\"}}"
}
```

**Response**: Matched and modified counts

---

### 4. deleteDocument

**Purpose**: Delete document(s) by filter

**Input**:
```json
{
  "collectionName": "use_cases",
  "filter": "{\"name\": \"test\"}"
}
```

**Response**: Deletion count

---

### 5. listCollections

**Purpose**: List all collections in database

**Input**: None (empty object)

**Response**: Array of collection names

---

## MongoDB Schema

### Collection: use_cases

**Example Document**:
```json
{
  "_id": "693baa3577443138c6343ca9",
  "name": "login",
  "title": "User Login",
  "description": "A general login use case...",
  "actors": ["User", "Authentication System"],
  "preconditions": ["User has valid account..."],
  "steps": [...],
  "alternativeFlows": [...],
  "postconditions": [...]
}
```

---

## Environment Configuration

### .env File
```env
MONGODB_URI=mongodb://localhost:27017/
DB_NAME=use_case_db
SERVER_NAME=h2bis-pb-mcp
SERVER_VERSION=1.0.0
```

### Claude Desktop Config
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

---

## Testing

### Build & Start
```bash
# Build TypeScript
npm run build

# Start server
npm start

# Development mode (auto-reload)
npm run dev
```

### Database Connection Test
```bash
node dist/test-db-connection.js
```

**Tests Performed**:
1. Database initialization
2. Collection listing
3. Insert operation
4. Find operation
5. Update operation
6. Delete operation
7. Existing data verification

### Claude Desktop Testing
1. Build project: `npm run build`
2. Configure Claude Desktop config file
3. Restart Claude Desktop completely
4. Test tools via natural language

---

## Performance Characteristics

- **Connection**: Singleton pattern - single connection reused
- **Query Performance**: Direct MongoDB native driver
- **Memory**: Minimal footprint, no heavy frameworks
- **Startup Time**: < 1 second with DB connection
- **Scalability**: Supports concurrent tool invocations

---

## Security Considerations

⚠️ **Current State**: Development/Local Use Only

**Not Implemented**:
- Input sanitization for MongoDB operators
- Query injection prevention
- Authentication/authorization
- Rate limiting
- Audit logging

**Recommendation**: Add security layer before exposing to untrusted inputs.

---

## Future Enhancements

**Potential Additions** (implement when needed):
- Aggregate pipeline tool
- Bulk operations support
- Transaction support
- Index management tools
- Database statistics tool
- Query result pagination
- Connection pooling configuration
- Metrics and monitoring

---

**Last Updated**: 2025-12-16  
**Status**: Production-ready for local use  
**Version**: 1.0.0

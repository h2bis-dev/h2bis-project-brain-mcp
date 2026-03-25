# H2BIS-PB-MCP Changelog

> Chronological log of all changes to this project

---

## [2025-12-16] - Major Refactoring: Simplified Architecture & Complete CRUD

### Context
The original implementation had structural issues preventing it from functioning:
- Duplicate configuration files with inconsistent settings
- Incorrect import paths referencing non-existent directories
- Dual database setup (Mongoose + native MongoDB) causing conflicts
- Missing database initialization before tool registration
- Limited functionality (only read operations)

### Changes Made

#### Added

**New Database Module** (`src/db.ts`)
- Centralized database singleton using native MongoDB client
- `initDb()` - Initialize connection with error handling
- `getDb()` - Retrieve database instance (auto-initializes)
- `closeDb()` - Graceful shutdown function
- Singleton pattern for connection reuse and efficiency

**New Tools**
- `deleteDocument.ts` - Delete documents from collections
- `listCollections.ts` - List all available collections in database

**Enhanced Tools**
- `updateDocument.ts` - Enhanced to return matched/modified counts

**Test Infrastructure**
- `test-db-connection.ts` - Comprehensive 8-test suite:
  1. Database initialization
  2. Get database instance
  3. List collections
  4. Insert operation
  5. Find operation
  6. Update operation
  7. Delete operation
  8. Query existing data

**Documentation**
- `QUICK_REFERENCE.md` - Quick start guide and tool examples
- Updated `ARCHITECTURE.md` - Complete system documentation
- Updated `CHANGELOG.md` - This file

#### Modified

**Configuration** (`src/config/config.ts`)
- Added dotenv import and initialization
- Fixed environment variable naming (MONGODB_URI vs MONGO_URI)
- Made serverName and serverVersion configurable via env vars
- Removed duplicate `config/index.ts`

**Main Server** (`src/index.ts`)
- Added database initialization before server startup
- Fixed import paths (removed incorrect `../` prefixes)
- Fixed tool registration (removed `.shape` property access)
- Added graceful shutdown handlers for SIGINT and SIGTERM
- Enhanced error handling with try/catch
- Improved logging with emoji indicators

**Tools Registry** (`src/tools/index.ts`)
- Fixed import paths to use relative `./` instead of `../src/handlers/`
- Added deleteDocument and listCollections to tools array
- All tools now consistently registered

**All Tool Handlers**
- Fixed import path: `'../db.js'` (one level up)
- Consistent error handling pattern
- Proper JSON string parsing for filter/update parameters

#### Removed

**Duplicate/Incorrect Files**
- `src/config/index.ts` - Duplicate configuration
- `src/database/index.ts` - Mongoose-based database (replaced with native MongoDB)
- `src/src/db.ts` - Incorrectly nested database file
- `src/test-access.ts` - Old test file with wrong imports

**Dependencies from Runtime**
- Removed Mongoose from active use (kept in package.json for compatibility)
- Now using native MongoDB client directly

### Testing

#### Build Verification
```bash
npm run build
# ✅ Build completed successfully
# Output: dist/ directory with all compiled files
```

#### Server Startup Test
```bash
node dist/index.js
# ✅ Connected to MongoDB: h2bis-project-brain
# ✅ h2bis-pb-mcp v1.0.0 running
```

#### Database Connection Test
```bash
node dist/test-db-connection.js
# ✅ All 8 tests passed
# ✅ Database operations verified
# ✅ Found existing documents in use_cases collection
```

### Impact

**Functionality**
- ✅ Complete CRUD operations now available
- ✅ All structural issues resolved
- ✅ Server starts successfully
- ✅ Database connection established
- ✅ All 5 tools operational

**Code Quality**
- ✅ Simplified architecture (single database module)
- ✅ Clear separation of concerns
- ✅ Consistent error handling
- ✅ Proper TypeScript compilation
- ✅ No import path errors

**Developer Experience**
- ✅ Easy to understand codebase
- ✅ Well-documented with ARCHITECTURE.md and QUICK_REFERENCE.md
- ✅ Comprehensive test suite
- ✅ Clear error messages

**Performance**
- ✅ Singleton database connection (no reconnection overhead)
- ✅ Native MongoDB client (better performance than Mongoose)
- ✅ Minimal dependencies

### Tools Summary

| Tool | Status | Capability |
|------|--------|------------|
| insertDocument | ✅ Working | Create documents in any collection |
| findDocument | ✅ Working | Query documents with filter criteria |
| updateDocument | ✅ Working | Update documents with MongoDB operators |
| deleteDocument | ✅ NEW | Delete documents by filter |
| listCollections | ✅ NEW | Discover available collections |

### Breaking Changes

**Configuration**
- Environment variable changed: `MONGO_URI` → `MONGODB_URI`
- Database name must be in separate `DB_NAME` variable
- Server name/version now configurable (were hardcoded)

**Database Layer**
- Removed Mongoose-based connection
- Now using native MongoDB client
- Different API for database operations

**Tools**
- Changed from `retrieve_document` / `retrieve_documents` naming
- Now using `insertDocument`, `findDocument`, `updateDocument`, `deleteDocument`, `listCollections`

### Migration Guide

If upgrading from previous version:

1. Update `.env` file:
   ```env
   # Old
   MONGO_URI=mongodb://localhost:27017/h2bis-project-brain
   
   # New
   MONGODB_URI=mongodb://localhost:27017/
   DB_NAME=h2bis-project-brain
   ```

2. Rebuild project:
   ```bash
   npm run build
   ```

3. Update Claude Desktop config to use new tool names

4. Restart Claude Desktop

---

## Previous Changes

### Initial Implementation

**Created Minimal Implementation**

**File**: `src/config/index.ts` (10 lines)
- Simple object with env var loading
- No validation, just fallbacks

**File**: `src/database/index.ts` (18 lines)
- `connectDB()` and `disconnectDB()` functions
- Uses mongoose directly
- Basic error logging to stderr

**File**: `src/services/index.ts` (13 lines)
- `DocumentService` class with 2 methods
- `findOne()` and `findMany()`
- Direct MongoDB driver access via `mongoose.connection.db`

**File**: `src/tools/index.ts` (75 lines)
- Zod schemas for tool inputs
- `zodToJsonSchema()` converter function
- Tool handler functions
- Exported `tools` array

**File**: `src/index.ts` (51 lines)
- MCP server setup
- Tool registration
- Stdio transport
- SIGINT handler

### Configuration Fixed

**Issue**: Wrong MongoDB connection string format

**Before**:
```
MONGODB_URI=mongodb://localhost:27017/h2bis-project-brain
```

**After**:
```
MONGODB_URI=mongodb://localhost:27017
DB_NAME=h2bis-project-brain
```

**Why**: Database name should be passed as separate `dbName` option to mongoose, not in URI.

### Schema Conversion Fixed

**Issue**: `BaseTool` was returning empty schema `{}`, Claude Desktop couldn't understand tool parameters.

**Solution**: Implemented proper Zod-to-JSON Schema conversion in `zodToJsonSchema()` function.

**Result**: Claude Desktop now sees correct parameter schemas.

---

## Template for Future Entries

```markdown
## [YYYY-MM-DD] - Brief Description

### Context
Why was this change needed?

### Changes Made

#### Added
- New features, files, functions

#### Modified
- Changed behavior, refactored code

#### Removed
- Deleted files, deprecated features

### Testing
How was this verified?

### Impact
What does this enable/fix/improve?

---
```

---

**Changelog Started**: 2025-12-16  
**Last Updated**: 2025-12-16

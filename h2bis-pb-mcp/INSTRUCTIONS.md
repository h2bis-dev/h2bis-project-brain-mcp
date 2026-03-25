# H2BIS-PB-MCP Development Instructions

> **READ THIS FIRST** - This file contains critical guidelines for working with this MCP server project.

---

## Core Principles

### 1. **SIMPLICITY FIRST**
- Keep code minimal and direct
- Avoid over-engineering and excessive abstractions
- Only add complexity when absolutely necessary
- Prefer working code over elaborate architecture

### 2. **Working Implementation Over Perfect Design**
- Get it working first, then refine
- Test database connectivity before adding features
- Validate tools work in Claude Desktop before optimization

### 3. **Maintain Separation of Concerns**
- Keep folder structure organized
- Each layer has one responsibility:
  - `config/` - Configuration only
  - `database/` - Database connection only
  - `services/` - Business logic only
  - `tools/` - MCP tool definitions only
  - `index.ts` - Server setup only

### 4. **Minimal Error Handling**
- Use simple try/catch only when necessary
- Log errors to stderr (not stdout - MCP uses stdout)
- Don't create custom error classes unless needed

---

## Project Structure

```
src/
├── config/index.ts       # Environment configuration
├── database/index.ts     # MongoDB connection
├── services/index.ts     # Business logic (DocumentService)
├── tools/index.ts        # MCP tool definitions
└── index.ts              # MCP server entry point
```

---

## Critical Configuration

### Environment Variables (.env)
```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=h2bis-project-brain
SERVER_NAME=h2bis-pb-mcp
SERVER_VERSION=1.0.0
```

### Database Connection
- **URI Format**: `mongodb://localhost:27017` (no database name in URI)
- **Database Name**: Specified separately via `dbName` option
- **Target Database**: `h2bis-project-brain`
- **Collections**: `use_cases`, `features`

---

## Development Workflow

### Making Changes

1. **Analyze First**
   - Read `ARCHITECTURE.md` to understand current implementation
   - Read `CHANGELOG.md` to see recent changes
   - Identify which file(s) need modification

2. **Make Minimal Changes**
   - Edit only what's necessary
   - Test immediately after each change
   - Don't refactor unrelated code

3. **Test Locally**
   ```powershell
   npm run build
   node dist/test-access.js  # Test database access
   npm start                  # Test MCP server
   ```

4. **Update Documentation**
   - Add entry to `CHANGELOG.md`
   - Update `ARCHITECTURE.md` if structure changed
   - Update this file if workflow changed

### Adding New Tools

1. Add handler function in `src/tools/index.ts`
2. Define Zod schema
3. Add to `tools` array export
4. Build and test
5. Document in `ARCHITECTURE.md`

### Debugging Connection Issues

1. Test raw MongoDB connection first:
   ```js
   node -e "import('mongoose').then(m => m.default.connect('mongodb://localhost:27017', {dbName: 'h2bis-project-brain'}))"
   ```

2. Check `.env` file has correct values
3. Verify MongoDB is running locally
4. Check logs on stderr (not stdout)

---

## Testing with Claude Desktop

### Configuration Location
`%APPDATA%\Claude\claude_desktop_config.json`

### Current Config
```json
{
  "mcpServers": {
    "h2bis-pb-mcp": {
      "command": "node",
      "args": ["C:\\My_work\\RnD\\project_brain_prototype_node\\h2bis-pb\\h2bis-pb-mcp\\dist\\index.js"],
      "env": {
        "MONGODB_URI": "mongodb://localhost:27017",
        "DB_NAME": "h2bis-project-brain"
      }
    }
  }
}
```

### Testing Process
1. Build the project: `npm run build`
2. **Completely quit** Claude Desktop (not just close)
3. Restart Claude Desktop
4. Server auto-starts with Claude
5. Test with queries like: "Use retrieve_document with collection 'use_cases' and query {name: 'login'}"

---

## Common Pitfalls to Avoid

❌ **Don't**:
- Add database name to MONGODB_URI (use separate dbName option)
- Create custom error classes prematurely
- Add elaborate logging systems
- Over-abstract with base classes
- Use stdout for logs (breaks MCP protocol)

✅ **Do**:
- Keep functions small and focused
- Test database access separately first
- Use stderr for all logging
- Maintain folder separation
- Document all changes

---

## When Things Break

1. **Build fails**: Check TypeScript errors, ensure all imports exist
2. **Database connection fails**: Test MongoDB connection separately
3. **Tools not appearing in Claude**: Restart Claude Desktop completely
4. **Tools fail in Claude**: Check logs on stderr, verify schema conversion
5. **"No documents found"**: Verify database name and collection name are correct

---

## File Update Rules

- **This file (INSTRUCTIONS.md)**: Update when workflow or principles change
- **CHANGELOG.md**: Update after every development session
- **ARCHITECTURE.md**: Update when structure, files, or major logic changes

---

**Last Updated**: 2025-12-16

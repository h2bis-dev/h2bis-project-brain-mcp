# Documentation System

This project uses three synchronized documentation files:

## 📘 INSTRUCTIONS.md
**Purpose**: Development guidelines and workflow  
**Read**: Before making any changes  
**Update**: When workflow or principles change

Contains:
- Core development principles
- Project structure
- Development workflow
- Testing procedures
- Common pitfalls

## 🏗️ ARCHITECTURE.md
**Purpose**: Current system implementation  
**Read**: To understand how the system works  
**Update**: When files, structure, or major logic changes

Contains:
- System overview
- Folder structure
- Layer responsibilities
- Data flow diagrams
- Current implementation details

## 📝 CHANGELOG.md
**Purpose**: Historical record of changes  
**Read**: To see what has been done  
**Update**: After every development session

Contains:
- Chronological change log
- Context for each change
- What was added/modified/removed
- Testing results
- Lessons learned

---

## Workflow

### When Starting Work
1. Read `INSTRUCTIONS.md` for guidelines
2. Read `ARCHITECTURE.md` to understand current state
3. Read `CHANGELOG.md` for recent changes

### When Making Changes
1. Make minimal, focused changes
2. Test immediately
3. Update all three docs if needed:
   - `CHANGELOG.md` - Always (add entry)
   - `ARCHITECTURE.md` - If structure/logic changed
   - `INSTRUCTIONS.md` - If workflow/principles changed
4. if testing successful update `CHANGELOG.md` by reducing unneccessary details

### Template for Updates

**CHANGELOG.md**:
```markdown
## [YYYY-MM-DD] - Brief Description
### Context
### Changes Made
### Testing
```

**ARCHITECTURE.md**:
Update relevant sections (Folder Structure, Layer descriptions, etc.)

**INSTRUCTIONS.md**:
Update if development process changed

---

**Last Updated**: 2025-12-16

# H2BIS ProjectBrain - Architecture

> **A centralized, AI-powered, multi-project knowledge base system**  
> Supporting modern software teams  
> Last updated: 2026-01-05

---

## 1. Overview

**H2BIS ProjectBrain** is a centralized, AI-powered, multi-project knowledge base system designed to support modern software teams. It serves as the knowledge backbone of the H2BIS ecosystem.

### Core Capabilities

ProjectBrain enables teams to:

- 📚 **Store** structured and unstructured knowledge for each project
- 🔍 **Organize** knowledge with intelligent categorization and tagging
- 🤖 **Analyze** content with AI-enhanced analysis, search, and summarization
- 📊 **Visualize** project knowledge through modern web interfaces
- 🔗 **Integrate** with MCP for AI-driven interactions
- 🔄 **Sync** with H2PAL for task metadata, project context, and ecosystem alignment

### Architectural Foundation

ProjectBrain is built on a **polyrepo-based architecture** where each service lives in its own independent repository, enabling:

- Independent versioning and deployment
- Technology flexibility per service
- Clear separation of concerns
- Scalable team collaboration
- Simplified CI/CD workflows

---

## 2. Core Modules

ProjectBrain currently consists of three implemented modules, with a fourth (web frontend) planned:

```
h2bis-pb/                    # Workspace folder (not a repo)
├── h2bis-pb-api/            # Express backend API (✅ IMPLEMENTED)
├── h2bis-pb-ai/             # AI utilities library (✅ IMPLEMENTED)
├── h2bis-pb-mcp/            # MCP server with tools (✅ IMPLEMENTED)
└── h2bis-pb-web/            # Next.js frontend (📋 PLANNED)
```

### 2.1 h2bis-pb-web (Frontend)

> [!NOTE]
> **Status**: 📋 **PLANNED - Not Yet Implemented**
> 
> This module is part of the planned architecture but has not been implemented yet. Current interactions with the system occur through:
> - MCP tools (via Claude Desktop or other MCP clients)
> - Direct API calls
> - Future: BA-focused chat interface for reviewing capabilities and resolving dependency conflicts

**Planned Purpose**: Modern web application for visualizing project knowledge

**Planned Technology Stack**:
- Next.js 15 (React framework with App Router)
- TypeScript (type-safe development)
- ShadCN UI (modern component library)
- React Query (server state management)
- TailwindCSS (utility-first styling)

**Planned Responsibilities**:
- Render intuitive knowledge browsing interfaces
- Provide real-time search and filtering
- Display interactive knowledge visualizations
- Enable knowledge creation and editing
- BA workflow for dependency conflict resolution
- Communicate with h2bis-pb-api for data operations

---

### 2.2 h2bis-pb-api (Backend API)

**Purpose**: Express.js backend providing RESTful API for knowledge management with AI-powered capability graph

**Technology Stack**:
- Node.js + Express.js (web server framework)
- TypeScript (type-safe development)
- MongoDB (NoSQL database via native driver)
- Zod (runtime schema validation)
- AI integrations (via h2bis-pb-ai)

**Data Schemas** (5 schemas in `src/db_schema/`):

1. **CapabilityNode** (`capability_schema.ts`) - Modern, AI-optimized unified schema
   - **Intent**: Semantic purpose (userGoal, systemResponsibility, businessValue)
   - **Behavior**: Acceptance criteria and user flows
   - **Realization**: Technical implementation mapping (frontend, backend, data)
   - **Dependencies**: Directed graph relationships with cycle detection
   - **AI Hints**: Complexity scores, failure modes, test focus areas
   - **Intent Analysis**: LLM-extracted semantic analysis (stored for traceability)
   - **Review Workflow**: Human oversight (pending/approved/rejected/revision_requested)
   - **Artifacts**: Links to source code, tests, documentation
   - **Implementation Tracking**: Status, completion %, blockers

2. **UseCase** (`use_case_schema.ts`) - Legacy schema for backward compatibility
3. **Feature** (`features_schema.ts`) - Legacy schema for backward compatibility
4. **Entity** (`entity_schema.ts`) - Generic knowledge entity base
5. **BaseEntity** (`base_schema.ts`) - Common fields across all entities

**Services** (3 core services in `src/services/`):

1. **CapabilityService** (`capability.service.ts`)
   - Dependency validation and referential integrity
   - Circular dependency detection
   - Impact analysis (identify affected nodes)
   - Topological sorting for implementation order
   - Dependency graph traversal (forward/reverse)

2. **TransformationService** (`transformation.service.ts`)
   - LLM-powered UseCase → CapabilityNode transformation
   - Intent extraction integration
   - Deterministic mapping from intent analysis to capability
   - Automatic capability generation on insert/update

3. **ValidationService** (`validation.service.ts`)
   - 7-layer validation framework:
     - Pre-validation (input quality)
     - Extraction validation (intent analysis quality)
     - Post-generation validation (capability completeness)
     - Risk-gated human review workflow
   - Confidence scoring
   - Quality assessment (clarity, completeness, ambiguity)

**Controllers** (2 controllers in `src/controllers/`):
- `knowledge.controller.ts` - Legacy CRUD with auto-capability generation
- `capability.controller.ts` - Capability graph operations

**Responsibilities**:
- Expose RESTful API endpoints for CRUD operations
- Manage dual schema system (legacy + modern)
- LLM-driven capability transformation
- Dependency graph management with validation
- 7-layer quality validation
- Risk-based human review workflows

---

### 2.3 h2bis-pb-ai (AI Utilities Library)

**Purpose**: Shared library providing AI processing capabilities for intent extraction and LLM operations

**Core Components** (in `src/`):

#### Intent Extraction Agent (`agents/intent-extraction/`)
The primary AI agent that extracts semantic intent from use case documents:

**Features**:
- **System Prompt**: Structured prompt engineering for consistent intent extraction
- **User Prompt Templates**: Dynamic prompt generation based on use case data
- **Retry Logic**: Exponential backoff with configurable max retries (default: 3)
- **Validation**: Post-extraction validation with quality assessment
- **Caching**: Redis-compatible cache integration for performance
- **Error Handling**: Graceful degradation with meaningful error messages

**Extraction Output** (`IntentAnalysis`):
- User goal and system responsibilities
- Business context understanding
- Technical component identification (frontend, backend, data)
- User flows and acceptance criteria
- Assumptions, ambiguities, and missing information
- Security considerations
- Confidence level assessment

#### LLM Service (`services/llm/`)
Abstraction layer for LLM provider integration:
- **OpenAI Integration**: Primary provider using GPT models
- **Chat JSON**: Structured JSON output with type safety
- **Error Handling**: Retry logic and rate limiting
- **Token Management**: Usage tracking and optimization

#### Cache Service (`services/cache/`)
Performance optimization through caching:
- **TTL-based Caching**: Configurable expiration
- **Intent Cache**: Store extracted intents by use case key
- **Invalidation**: Manual and automatic cache clearing

**Responsibilities**:
- Extract semantic intent from use case descriptions
- Provide consistent LLM interactions with retry logic
- Enable caching for improved performance
- Support validation and quality assessment
- Abstract AI provider implementations

---

### 2.4 h2bis-pb-mcp (MCP Server)

**Purpose**: Model Context Protocol server exposing knowledge operations to AI assistants

**Technology Stack**:
- Node.js + TypeScript
- @modelcontextprotocol/sdk (MCP framework)
- Axios (HTTP client for API calls)

**MCP Tools Exposed** (8 tools in `src/tools/`):

#### CRUD Operations (5 tools)

**insertDocument** - Insert documents with auto-capability generation
- Validates entity schema (UseCase, Feature, Entity)
- Auto-generates CapabilityNode for UseCases/Features via LLM
- Returns document ID

**findDocument** - Query documents with MongoDB syntax
- Flexible query filters
- Projection support
- Returns matching documents

**updateDocument** - Update documents with capability sync
- Validates updated entity
- Auto-updates corresponding capability if exists
- Supports full document replacement

**deleteDocument** - Delete with cascade to capabilities
- Removes document from collection
- Cascades deletion to capability graph
- Returns deletion status

**listCollections** - Discover available collections
- Lists all MongoDB collections
- Useful for exploration

#### Capability Graph Operations (3 tools)

**getCapabilityDependencies** - Dependency tree traversal
- Input: `nodeId`, `depth` (1-10)
- Returns: All nodes this capability depends on
- Supports configurable traversal depth

**analyzeCapabilityImpact** - Impact analysis
- Input: `nodeId`
- Returns: Risk assessment with:
  - Direct and indirect dependents
  - Total affected nodes count
  - Risk level (low/medium/high)
  - Actionable recommendations

**getImplementationOrder** - Topological sort
- Input: Array of `nodeIds`
- Returns: Optimal implementation sequence
- Dependencies-first ordering using Kahn's algorithm

**Responsibilities**:
- Expose knowledge operations to AI assistants (like Claude)
- Enable natural language interaction with knowledge base
- Provide structured tool interfaces for AI consumption
- Handle tool validation and error management
- Delegate to h2bis-pb-api via HTTP for data access

---

## 3. Technology Stack Summary

### Frontend Layer
> [!NOTE]
> Frontend is **planned but not yet implemented**. This section describes the planned technology stack.

| Technology | Purpose | Status |
|------------|---------|--------|
| Next.js 15 | React framework with SSR/SSG | 📋 Planned |
| TypeScript | Type safety and developer experience | 📋 Planned |
| ShadCN UI | Modern, accessible UI components | 📋 Planned |
| React Query | Server state and cache management | 📋 Planned |
| TailwindCSS | Utility-first styling framework | 📋 Planned |

### Backend Layer
| Technology | Purpose | Status |
|------------|---------|--------|
| Node.js | JavaScript runtime | ✅ Implemented |
| Express.js | Web application framework | ✅ Implemented |
| TypeScript | Type safety | ✅ Implemented |
| MongoDB | NoSQL database for flexible schemas | ✅ Implemented |
| Native MongoDB Driver | Database connectivity and operations | ✅ Implemented |
| Zod | Runtime schema validation | ✅ Implemented |

### AI Layer
| Component | Purpose | Status |
|-----------|---------|--------|
| Intent Extraction Agent | LLM-driven semantic analysis | ✅ Implemented |
| LLM Service (OpenAI) | GPT integration for text generation | ✅ Implemented |
| Cache Service | Performance optimization | ✅ Implemented |
| Prompt Templates | Structured prompt engineering | ✅ Implemented |

### MCP Layer
| Technology | Purpose | Status |
|------------|---------|--------|
| MCP SDK | Model Context Protocol implementation | ✅ Implemented |
| 8 Custom Tools | CRUD + Capability graph operations | ✅ Implemented |
| TypeScript | Type-safe tool definitions | ✅ Implemented |
| Axios | HTTP client for API communication | ✅ Implemented |

### Infrastructure
| Technology | Purpose | Status |
|------------|---------|--------|
| Local MongoDB | Development database | ✅ Implemented |
| npm Scripts | Development workflow | ✅ Implemented |
| Docker | Application containerization | 📋 Planned |
| Kubernetes | Container orchestration | 📋 Planned |
| Helm | Kubernetes package management | 📋 Planned |
| VKS | Vultr Kubernetes Service (cloud hosting) | 📋 Planned |
| GitHub | CI/CD pipelines per service | 📋 Planned |

---

## 4. Data Architecture

### Dual Schema System

ProjectBrain uses a **transition architecture** supporting both legacy and modern schemas:

```
Legacy Schema                   Modern Schema
(Backward Compatible)           (AI-Optimized)
─────────────────               ──────────────
UseCase                    ──▶  CapabilityNode
Feature                    ──▶  CapabilityNode
Entity                     ──▶  (Generic storage)
```

#### 4.1 Legacy Schemas

**UseCase** (`use_case_schema.ts`)
- **Purpose**: User-focused requirements with business value
- **Key Fields**:
  - `key`, `name`, `description`
  - `primaryActor`, `businessValue`
  - `acceptanceCriteria`, `flows` (main/alternative/error)
  - `technicalSurface` (frontend/backend components)
  - `relationships` (depends_on, extends, conflicts_with, etc.)
  - `aiMetadata` (complexity, implementation risk)
  - `status.lifecycle` (idea → planned → in_development → completed)

**Feature** (`features_schema.ts`)
- **Purpose**: Business capabilities with acceptance criteria
- **Key Fields**: `key`, `name`, `description`, `businessValue`, `acceptanceCriteria`

**Entity** (`entity_schema.ts`)
- **Purpose**: Generic knowledge entities
- **Key Fields**: Basic metadata and content

#### 4.2 Modern Schema: CapabilityNode

The **CapabilityNode** is an AI-optimized, unified schema consolidating all knowledge types into a semantic graph structure.

**Core Sections**:

**Intent** - Semantic purpose
- `userGoal`: What user wants to accomplish
- `systemResponsibility`: What system must do
- `businessValue`: Why this matters

**Behavior** - Expected functionality
- `acceptanceCriteria`: Success conditions (array of strings)
- `flows`: User/system flows with steps and types (main/alternative/error)

**Realization** - Technical implementation
- `frontend`: Routes and components
- `backend`: API endpoints and services
- `data`: Entities with CRUD operations

**Dependencies** - Graph relationships
- `on`: Target node ID (e.g., `cap-FT001_EMAIL_SERVICE`)
- `type`: `hard` (blocking) or `soft` (preferred)
- `reason`: Why dependency exists
- **Validation**: Referential integrity + cycle detection

**AI Hints** - Implementation guidance
- `complexityScore`: 1-10 difficulty rating
- `failureModes`: Potential failure scenarios
- `testFocusAreas`: Critical test areas
- `recommendedChunking`: Suggested breakdown

**AI Enhancement Features**:

**intentAnalysis** - LLM extraction results (stored for traceability)
- Extracted user goal and system responsibilities
- Technical components identified by LLM
- Assumptions, ambiguities, missing information
- Security considerations
- Confidence level (high/medium/low)
- LLM model and prompt version used

**review** - Human oversight workflow
- `status`: pending | approved | rejected | revision_requested
- `requiredReason`: Why review is needed
- `reviewedBy`, `reviewedAt`, `feedback`
- `corrections`: Human-provided fixes to intent

**artifacts** - Code linkage
- `source`: Paths to implementation files
- `tests`: Test files with coverage data
- `documentation`: API docs, tutorials, architecture

**implementation** - Progress tracking
- `status`: not_started → in_progress → code_complete → deployed
- `completionPercentage`: 0-100%
- `blockers`: Current impediments

**Quality Metadata**:
- `confidenceBreakdown`: clarity, completeness, ambiguityLevel
- `intentIntegrity`: modification tracking and approval
- `responsibilityAnnotations`: Scope and traceability

#### 4.3 Transformation Flow

```
1. BA inserts UseCase via MCP tool
   │
   ├─▶ Stored in `use_cases` collection
   │
   └─▶ Auto-transformation triggered
       │
       ├─▶ IntentExtractionAgent.extractIntent(useCase)
       │   └─▶ LLM analyzes → IntentAnalysis
       │
       ├─▶ TransformationService.transformIntentToCapability()
       │   └─▶ Maps IntentAnalysis → CapabilityNode
       │
       ├─▶ ValidationService.validate(capability)
       │   └─▶ 7-layer validation + risk assessment
       │
       └─▶ CapabilityService.createNode(capability)
           ├─▶ Validates dependencies exist
           ├─▶ Detects circular dependencies
           └─▶ Stores in `capabilities` collection
```

**Failure Handling**: If dependencies don't exist, transformation fails with error listing missing nodes. Future enhancement: dependency queue for deferred creation.

---

## 5. Integration Points

### 5.1 H2PAL Integration

> [!NOTE]
> **Status**: 📋 **PLANNED - Not Yet Implemented**
> 
> H2PAL integration is part of the roadmap but not currently implemented. The system currently operates independently.

**Planned H2PAL Integration**:

**H2PAL** (H2BIS Project Automation Layer) integration will enable:

#### Project Metadata Sync
- Automatically sync project information from H2PAL
- Enrich knowledge with project context
- Maintain consistent project definitions

#### Optional Task Linkage
- Associate knowledge documents with specific tasks
- Provide context for task execution
- Track knowledge usage across tasks

#### Unified Ecosystem Authentication
- Share authentication mechanisms across H2BIS tools
- Support role-based access control
- Enable single sign-on experience

#### Permissions Management
- Consistent permission model with H2PAL
- Project-level access control
- Team-based authorization

#### Notifications
- Receive notifications about project events
- Alert on relevant knowledge updates
- Integrate with team communication workflows

---

### 5.2 MCP Integration

**Model Context Protocol** enables AI assistants to interact with ProjectBrain through 8 standardized tools:

- **CRUD operations**: Insert, find, update, delete documents and list collections
- **Capability graph operations**: Dependency analysis, impact assessment, implementation ordering

**Workflow**:
```
AI Assistant (Claude Desktop) 
    ↓ MCP Protocol (stdio transport)
h2bis-pb-mcp (MCP Server)
    ↓ HTTP REST API calls
h2bis-pb-api (Backend)
    ↓ Dual schema processing
    ├─→ Legacy CRUD (use_cases, features, entities collections)
    └─→ LLM transformation → Capability graph (capabilities collection)
    ↓ Database Operations
MongoDB (Knowledge Store)
```

**Auto-Transformation Flow**:
When inserting a UseCase or Feature via MCP:
1. Document stored in legacy collection
2. IntentExtractionAgent called (LLM)
3. CapabilityNode generated automatically
4. Dependency validation performed
5. Both documents stored (if validation passes)

---

### 5.3 AI Model Providers

ProjectBrain currently integrates with OpenAI for all LLM operations:

#### OpenAI (✅ Implemented)
- **GPT Models**: Used for intent extraction from use cases
- **Structured Output**: JSON mode for consistent IntentAnalysis format
- **Error Handling**: Retry logic with exponential backoff
- **Configuration**: Model and API key managed via environment variables

**Planned Future Integrations**:

#### Google Gemini (📋 Planned)
- Alternative LLM for text operations
- Multi-modal capabilities
- Fallback and comparison provider

#### Local Inference (📋 Planned)
- On-premise model hosting
- Privacy-sensitive use cases
- Cost optimization for high-volume operations

---

## 6. MCP Tools (Detailed)

### 6.1 CRUD Operations

#### insertDocument
**Purpose**: Insert a document into MongoDB with automatic capability generation

**Parameters**:
- `collection`: Target collection name (use_cases, features, entities, etc.)
- `document`: Document object matching the collection schema

**Behavior**:
1. Validates document against appropriate schema (UseCaseSchema, FeatureSchema, EntitySchema)
2. If UseCase or Feature: Triggers LLM-based transformation to CapabilityNode
3. Stores original document in specified collection
4. Stores generated CapabilityNode in capabilities collection (if applicable)
5. Returns MongoDB insertId

**Error Handling**:
- Schema validation failures → 400 error with validation details
- Missing dependencies → Capability creation fails with list of missing nodes
- LLM failures → Retries up to 3 times, then returns error

---

#### findDocument
**Purpose**: Query documents using MongoDB query syntax

**Parameters**:
- `collection`: Collection to search
- `query`: MongoDB query object (supports all MongoDB operators)
- `projection`: (Optional) Fields to return

**Returns**: Array of matching documents

**Use Cases**:
- Find use case by key: `{ key: "UC001_USER_REGISTRATION" }`
- Find all capabilities of a kind: `{ kind: "feature" }`
- Complex queries with relationships

---

#### updateDocument
**Purpose**: Update existing document with capability synchronization

**Parameters**:
- `collection`: Collection name
- `query`: MongoDB query to identify document
- `update`: Full replacement document (must pass schema validation)

**Behavior**:
1. Validates new document against schema
2. Updates document in collection
3. If UseCase/Feature: Re-generates CapabilityNode
4. Updates capability in capabilities collection

**Note**: Requires full document replacement, not partial updates (for data integrity)

---

#### deleteDocument
**Purpose**: Delete document with cascade to capability graph

**Parameters**:
- `collection`: Collection name
- `query`: MongoDB query to identify document(s)

**Behavior**:
1. Deletes document from specified collection
2. If UseCase/Feature: Deletes corresponding CapabilityNode
3. Removes references from other nodes' dependencies

**Returns**: Deletion count

---

#### listCollections
**Purpose**: Discover available MongoDB collections

**Parameters**: None

**Returns**: Array of collection names (e.g., `["use_cases", "features", "entities", "capabilities"]`)

**Use Case**: Helps AI assistants discover available data structures

---

### 6.2 Capability Graph Operations

#### getCapabilityDependencies
**Purpose**: Traverse the dependency tree for a capability node

**Parameters**:
- `nodeId`: Capability ID (e.g., `cap-UC001_USER_REGISTRATION`)
- `depth`: Traversal depth (1-10, default: 1)

**Returns**: Array of CapabilityNode objects representing all dependencies up to specified depth

**Algorithm**: Depth-first traversal with cycle detection

**Example**:
```json
{
  "nodeId": "cap-UC001_USER_REGISTRATION",
  "depth": 2
}
```
Returns: `cap-FT001_EMAIL_SERVICE`, `cap-FT002_AUTH_SERVICE`, and their dependencies

---

#### analyzeCapabilityImpact
**Purpose**: Assess the impact of modifying a capability

**Parameters**:
- `nodeId`: Capability ID to analyze

**Returns**: ImpactAnalysis object with:
- `directDependents`: Nodes that directly depend on this node
- `indirectDependents`: Nodes affected transitively (with depth info)
- `totalAffected`: Count of all affected nodes
- `riskLevel`: "low" (≤3), "medium" (4-10), or "high" (>10)
- `recommendations`: Actionable guidance (e.g., "Review and test 15 dependent nodes")

**Use Cases**:
- Pre-change risk assessment
- Identify ripple effects
- Plan testing scope

**Example Output**:
```json
{
  "nodeId": "cap-FT001_EMAIL_SERVICE",
  "totalAffected": 12,
  "riskLevel": "high",
  "recommendations": [
    "Review and test 12 dependent node(s)",
    "High transitive dependency - changes may have wide-reaching effects"
  ]
}
```

---

#### getImplementationOrder
**Purpose**: Calculate optimal implementation sequence using topological sort

**Parameters**:
- `nodeIds`: Array of capability IDs to order

**Returns**: Ordered array of CapabilityNode objects (dependencies first)

**Algorithm**: Kahn's algorithm for topological sorting

**Use Cases**:
- Plan development sprints
- Resolve dependency deadlocks
- Visualize implementation roadmap

**Example**:
```json
{
  "nodeIds": [
    "cap-UC001_USER_REGISTRATION",
    "cap-FT001_EMAIL_SERVICE",
    "cap-FT002_AUTH_SERVICE"
  ]
}
```
Returns: `[cap-FT001_EMAIL_SERVICE, cap-FT002_AUTH_SERVICE, cap-UC001_USER_REGISTRATION]`

---

## 7. Deployment Architecture

> [!NOTE]
> **Current Status**: Local Development Only
> 
> The system is currently designed for local development. Production deployment with Docker/Kubernetes is planned but not yet implemented.

### Current Development Setup

```
┌────────────────────────────────────────┐
│       Local Development Machine         │
│                                        │
│  ┌──────────┐  ┌──────────┐          │
│  │ pb-api   │  │ pb-mcp   │          │
│  │(Express) │  │(MCP Srv) │          │
│  │ :4000    │  │ stdio    │          │
│  └────┬─────┘  └────┬─────┘          │
│       │             │                 │
│       └─────────────┘                 │
│               │                       │
│      ┌────────▼────────┐              │
│      │  MongoDB:27017  │              │
│      │  (Local)        │              │
│      └─────────────────┘              │
│                                        │
│  Accessed via:                         │
│  - Claude Desktop (MCP client)         │
│  - Direct API calls (curl, Postman)    │
└────────────────────────────────────────┘
```

### Running the System

```bash
# 1. Start MongoDB (must be running on localhost:27017)
mongod

# 2. Start API Server
cd h2bis-pb-api
npm install
npm start    # Runs on http://localhost:4000

# 3. Start MCP Server (for Claude Desktop)
cd h2bis-pb-mcp
npm install
npm run build
npm start    # Connects via stdio to Claude Desktop

# 4. AI Library (dependency, auto-installed by API)
cd h2bis-pb-ai
npm install
npm run build
```

### Planned Production Deployment

Future deployment will use containerization and orchestration:

```
┌─────────────────────────────────────────────────┐
│         VKS (Vultr Kubernetes Service)          │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │ pb-web   │  │ pb-api   │  │ pb-mcp       │ │
│  │ (Next.js)│  │(Express) │  │ (MCP Server) │ │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘ │
│       │             │                │         │
│       └─────────────┴────────────────┘         │
│                     │                          │
│            ┌────────▼────────┐                 │
│            │    MongoDB      │                 │
│            │   (StatefulSet) │                 │
│            └─────────────────┘                 │
└─────────────────────────────────────────────────┘
```

### Container Strategy

**Each repository includes**:
- `Dockerfile` for containerization
- Container optimized for production
- Multi-stage builds for minimal image size
- Health check endpoints

### Kubernetes Deployment

**Helm charts per service**:
- Declarative infrastructure
- Environment-specific configurations
- Version-controlled deployments
- Easy rollback capabilities

**Key Resources**:
- Deployments for stateless services
- StatefulSet for MongoDB
- Services for networking
- Ingress for external access
- ConfigMaps for configuration
- Secrets for sensitive data

### CI/CD Pipelines

**Separate pipelines per service**:

Each repository has its own GitHub Actions workflow:

1. **Build Stage**
   - Run linters and type checks
   - Execute unit tests
   - Build Docker image
   - Tag with commit SHA

2. **Test Stage**
   - Run integration tests
   - Perform security scans
   - Validate configurations

3. **Deploy Stage**
   - Push image to registry
   - Update Helm chart
   - Deploy to VKS cluster
   - Run smoke tests
   - Update deployment status

**Benefits**:
- Fast, independent deployments
- Service-specific optimization
- Isolated failure domains
- Clear deployment history per service

---

## 8. System Workflows

### 8.1 UseCase to Capability Transformation Workflow

> [!IMPORTANT]
> This is the **core workflow** of ProjectBrain, automatically triggered when a UseCase or Feature is inserted.

```
1. BA/User inserts UseCase via MCP tool (insertDocument)
   ↓
2. knowledge.controller receives request
   ↓  Validates UseCase against UseCaseSchema (Zod)
   ↓
3. UseCase stored in `use_cases` collection
   ↓
4. Auto-transformation triggered
   ↓──▶ IntentExtractionAgent.extractIntent(useCase)
   │     │
   │     ├─▶ LLM called with system + user prompts
   │     ├─▶ Retry up to 3x on failure (exponential backoff)
   │     ├─▶ Cache check/store (if enabled)
   │     └─▶ Returns: IntentAnalysis
   │
   ↓──▶ TransformationService.transformIntentToCapability()
   │     │
   │     └─▶ Maps IntentAnalysis → CapabilityNode structure
   │
   ↓──▶ ValidationService.validate(capability)
   │     │
   │     ├─▶ Pre-validation (input quality)
   │     ├─▶ Extraction validation (intent analysis quality)
   │     ├─▶ Post-generation validation (completeness)
   │     ├─▶ Confidence scoring
   │     └─▶ Risk assessment (determines if human review needed)
   │
   ↓──▶ CapabilityService.createNode(capability)
   │     │
   │     ├─▶ Validates dependencies exist (referential integrity)
   │     │   └─▶ ❌ FAILS here if cap-FT001_EMAIL_SERVICE missing
   │     │
   │     ├─▶ Detects circular dependencies
   │     │
   │     └─▶ Stores in `capabilities` collection
   │
   ↓
5. Response: { useCaseId, capabilityId }
```

**Error Handling**:
- **Missing dependencies**: Returns 400 error with list of missing capability IDs
- **Circular dependency**: Returns 400 error showing the cycle
- **LLM failure**: Retries 3x, then returns 500 error
- **Validation failure**: Returns validation details and recommendations

---

### 8.2 Capability Graph Query Workflow

```
AI Assistant: "Show me what depends on the email service"
   ↓
MCP tool: getCapabilityDependencies
   ↓
h2bis-pb-mcp calls h2bis-pb-api/capabilities/dependencies
   ↓
CapabilityService.findDependents(nodeId, depth)
   ↓  Depth-first traversal with cycle detection
   ↓
Returns: Array of CapabilityNode objects
   ↓
MCP formats and returns to AI assistant
```

---

### 8.3 Impact Analysis Workflow

```
AI Assistant: "What would break if I change the auth service?"
   ↓
MCP tool: analyzeCapabilityImpact
   ↓
h2bis-pb-api/capabilities/impact/:nodeId
   ↓
CapabilityService.analyzeImpact(nodeId)
   ↓  ├─▶ Find direct dependents
   ↓  ├─▶ Find indirect dependents (recursive)
   ↓  ├─▶ Calculate risk level
   ↓  └─▶ Generate recommendations
   ↓
Returns: ImpactAnalysis object
```

---

### 8.4 Implementation Planning Workflow

```
AI Assistant: "What order should I implement these 5 use cases?"
   ↓
MCP tool: getImplementationOrder
   ↓
h2bis-pb-api/capabilities/implementation-order
   ↓
CapabilityService.getImplementationOrder(nodeIds)
   ↓  Kahn's algorithm (topological sort)
   ↓  Ensures dependencies come before dependents
   ↓
Returns: Ordered array of CapabilityNodes
   ↓
AI Assistant: "Implement in this order: [...]"
```

---

## 9. Design Principles

### 9.1 Polyrepo Independence

**Principle**: Each service is completely independent

**Implementation**:
- Separate Git repositories
- Independent versioning (semantic versioning)
- Own package.json and dependencies
- Individual deployment pipelines
- Service-specific documentation

**Benefits**:
- Clear ownership boundaries
- Flexible technology choices
- Simplified dependency management
- Reduced cognitive overhead
- Parallel development velocity

### 9.2 AI-First Design

**Principle**: AI integration is not an afterthought

**Implementation**:
- Vector embeddings for all content
- MCP tools as first-class citizens
- Prompt template infrastructure
- AI provider abstractions
- Semantic search capabilities

**Benefits**:
- Natural AI assistant integration
- Enhanced search and discovery
- Automated insights and analysis
- Future-proof for AI advancement

### 9.3 Knowledge-Centric Architecture

**Principle**: Knowledge is the primary asset

**Implementation**:
- Flexible document schemas
- Rich metadata support
- Version control for knowledge
- Graph-based relationships
- Multi-modal content support

**Benefits**:
- Accommodates diverse knowledge types
- Easy knowledge evolution
- Powerful querying capabilities
- Clear knowledge lineage

### 9.4 Ecosystem Integration

**Principle**: Seamless integration with H2BIS ecosystem

**Implementation**:
- H2PAL project synchronization
- Shared authentication layer
- Consistent permission model
- Unified notification system
- Cross-tool data enrichment

**Benefits**:
- Coherent user experience
- Reduced data duplication
- Streamlined workflows
- Ecosystem-wide insights

---

## 10. Security & Authentication

> [!NOTE]
> **Status**: 📋 **PLANNED - Not Yet Implemented**
> 
> Security features are planned but not currently implemented. Current deployment is for local development only with no authentication.

### Planned Authentication Strategy

**Unified Ecosystem Authentication**:
- JWT-based authentication shared with H2PAL
- Single sign-on experience
- Token refresh mechanisms
- Secure token storage

### Planned Authorization Model

**Role-Based Access Control (RBAC)**:
- User roles: Admin, Editor, Viewer
- Project-level permissions
- Team-based access control
- Fine-grained resource permissions

### Planned API Security

- HTTPS/TLS for all communications
- Request rate limiting
- Input validation and sanitization
- CORS configuration
- API key management for service-to-service

### Planned Data Security

- Encryption at rest for sensitive data
- Encrypted database connections
- Secure secret management (Kubernetes Secrets)
- Audit logging for sensitive operations
- Regular security scanning in CI/CD

---

## 11. Scalability & Performance

> [!NOTE]
> **Status**: 📋 **PLANNED - Not Yet Implemented**
> 
> Scalability features are planned for production deployment but not currently needed for local development.

### Planned Horizontal Scaling

**Stateless Services**:
- Multiple replicas of web, API, and MCP servers
- Load balancing across pods
- Auto-scaling based on metrics
- Session management via JWT (stateless)

**Stateful Services**:
- MongoDB replica sets for high availability
- Read replicas for query performance
- Sharding for large datasets (future)

### Planned Caching Strategy

**Application Level**:
- React Query caching in frontend
- HTTP cache headers
- API response caching (Redis consideration)

**Database Level**:
- MongoDB query result caching
- Index optimization
- Intent analysis cache (currently implemented in h2bis-pb-ai)

### Planned Performance Optimization

**Frontend**:
- Server-side rendering with Next.js
- Code splitting and lazy loading
- Image optimization
- CDN for static assets

**Backend**:
- Connection pooling for database
- Async/await for non-blocking operations
- Streaming for large responses
- Query optimization

---

## 12. Monitoring & Observability

> [!NOTE]
> **Status**: 📋 **PLANNED - Not Yet Implemented**
> 
> Monitoring infrastructure is planned for production deployment.

### Planned Metrics Collection

- Application performance metrics
- API response times
- Error rates and types
- Database query performance
- Resource utilization (CPU, memory)

### Planned Logging Strategy

**Structured Logging**:
- JSON formatted logs
- Log levels (ERROR, WARN, INFO, DEBUG)
- Request ID tracing
- Centralized log aggregation

### Planned Alerting

- Error rate thresholds
- Performance degradation alerts
- Security event notifications
- Deployment status updates

### Planned Tracing

- Distributed tracing across services
- Request flow visualization
- Bottleneck identification
- Performance profiling

---

## 13. Development Workflow

### Local Development

**Each service runs independently**:

```bash
# Frontend
cd h2bis-pb-web
npm install
npm run dev    # http://localhost:3000

# Backend API
cd h2bis-pb-api
npm install
npm run dev    # http://localhost:4000

# MCP Server
cd h2bis-pb-mcp
npm install
npm run build
npm start

# AI Library
cd h2bis-pb-ai
npm install
npm run build
```

### Testing Strategy

**Unit Tests**:
- Component tests (frontend)
- Function/module tests (backend, AI library)
- Tool tests (MCP server)

**Integration Tests**:
- API endpoint testing
- Database integration tests
- MCP tool execution tests

**End-to-End Tests**:
- Complete user workflows
- Cross-service interactions
- MCP integration flows

### Code Quality

- TypeScript for type safety
- ESLint for code standards
- Prettier for formatting
- Pre-commit hooks
- Code review requirements

---

## 14. Future Enhancements

### Phase 1: Critical Missing Features

1. **h2bis-pb-web - BA Web Interface**
   - Next.js frontend for Business Analysts
   - Chat-based UI for capability review and management
   - Dependency conflict resolution workflow
   - Visual capability graph explorer
   - Review queue for LLM-generated capabilities

2. **Dependency Queue System**
   - Queue capabilities with missing dependencies
   - Auto-create when dependencies are met
   - BA interface to resolve conflicts
   - Suggested creation order visualization

3. **Vector Embeddings & Semantic Search**
   - Generate embeddings for all capability nodes
   - Semantic search across use cases and capabilities
   - AI-powered knowledge recommendations
   - Related capability discovery

### Phase 2: Enhanced AI Features
- Multi-modal knowledge (images, diagrams in use cases)
- Real-time collaborative capability editing
- Advanced knowledge graph visualizations (D3.js/Cytoscape)
- AI-suggested knowledge links and relationships
- Automated quality improvement suggestions

### Phase 3: Enterprise Integration
- **H2PAL Sync**: Project metadata and task linkage
- **Authentication**: JWT-based auth with RBAC
- IDE plugins for knowledge access (VSCode, IntelliJ)
- Slack/Teams integration for notifications
- GitHub commit knowledge extraction
- JIRA/Linear integration

### Phase 4: Production Infrastructure
- Docker containerization for all services
- Kubernetes deployment with Helm charts
- CI/CD pipelines (GitHub Actions)
- Monitoring and observability (Prometheus, Grafana)
- Production database (MongoDB Atlas or self-hosted cluster)
- Multi-environment setup (dev, staging, prod)

### Phase 5: Platform Extensions
- Plugin system for custom validation rules
- Custom AI model integration (beyond OpenAI)
- Knowledge import/export utilities (CSV, JSON, YAML)
- Template marketplace for common use case patterns
- Custom schema extensions per project

---

## Conclusion

H2BIS ProjectBrain represents a modern, AI-first approach to knowledge management with a sophisticated **capability graph system**. The system leverages LLM-driven intent extraction to automatically transform use cases into a semantic graph of capabilities with dependency tracking, impact analysis, and implementation planning.

### Current State (January 2026)

**Implemented**:
- ✅ Dual schema system (legacy + modern CapabilityNode)
- ✅ LLM-powered intent extraction and transformation
- ✅ 7-layer validation framework with quality assessment
- ✅ Dependency graph with cycle detection and referential integrity
- ✅ Impact analysis and implementation ordering (topological sort)
- ✅ 8 MCP tools for AI assistant integration
- ✅ API-first architecture with Express + MongoDB

**In Development**:
- The system is designed to grow with BA workflows, supporting everything from simple use case storage to advanced AI-assisted capability management and dependency resolution

**Next Steps**:
- BA web interface for reviewing LLM-generated capabilities
- Dependency queue system for handling missing dependencies
- Vector embeddings for semantic search

---

**Document Version**: 2.0  
**Last Updated**: 2026-01-05  
**Status**: Reflects Actual Implementation (Updated from Conceptual)  
**Maintained By**: H2BIS Team

**Change Log**:
- 2026-01-05: Major update - documented actual implementation vs conceptual architecture
- 2025-12-17: Initial conceptual architecture document


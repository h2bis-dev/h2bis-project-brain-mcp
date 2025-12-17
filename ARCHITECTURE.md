# H2BIS ProjectBrain - Architecture

> **A centralized, AI-powered, multi-project knowledge base system**  
> Supporting modern software teams  
> Last updated: 12/2/25

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

ProjectBrain consists of four independent services, each in its own repository:

```
h2bis-pb/                    # Workspace folder (not a repo)
├── h2bis-pb-web/            # Next.js frontend
├── h2bis-pb-api/            # Express backend API
├── h2bis-pb-ai/             # AI utilities library
└── h2bis-pb-mcp/            # MCP server with tools
```

### 2.1 h2bis-pb-web (Frontend)

**Purpose**: Modern web application for visualizing project knowledge

**Technology Stack**:
- Next.js 15 (React framework with App Router)
- TypeScript (type-safe development)
- ShadCN UI (modern component library)
- React Query (server state management)
- TailwindCSS (utility-first styling)

**Responsibilities**:
- Render intuitive knowledge browsing interfaces
- Provide real-time search and filtering
- Display interactive knowledge visualizations
- Enable knowledge creation and editing
- Communicate with h2bis-pb-api for data operations

---

### 2.2 h2bis-pb-api (Backend API)

**Purpose**: Express.js backend providing RESTful API for knowledge management

**Technology Stack**:
- Node.js + Express.js (web server framework)
- TypeScript (type-safe development)
- MongoDB (NoSQL database)
- Mongoose (ODM for MongoDB)
- AI integrations (via h2bis-pb-ai)
- MCP integration (for AI assistant access)

**Responsibilities**:
- Expose RESTful API endpoints for CRUD operations
- Manage knowledge document lifecycle
- Perform data validation and business logic
- Integrate with AI utilities for enhanced features
- Handle authentication and authorization
- Interface with MCP server for AI interactions
- Sync with H2PAL for project metadata

---

### 2.3 h2bis-pb-ai (AI Utilities Library)

**Purpose**: Shared library providing AI processing capabilities

**Core Components**:

#### NLP Helpers
- Text analysis and processing
- Entity extraction
- Keyword identification
- Language understanding

#### Embedding Processors
- Generate vector embeddings from text
- Enable semantic search capabilities
- Support similarity comparisons
- Integrate with AI model providers

#### Document Chunking Utilities
- Split large documents intelligently
- Maintain context across chunks
- Optimize for embedding generation
- Handle various document formats

#### Prompt Templates
- Reusable AI prompt structures
- Consistent AI interaction patterns
- Context injection mechanisms
- Template versioning and management

**Responsibilities**:
- Abstract AI provider implementations
- Provide reusable NLP functionality
- Enable semantic search features
- Support AI-enhanced knowledge analysis
- Facilitate consistent AI interactions across services

---

### 2.4 h2bis-pb-mcp (MCP Server)

**Purpose**: Model Context Protocol server exposing knowledge operations to AI assistants

**Technology Stack**:
- Node.js + TypeScript
- @modelcontextprotocol/sdk (MCP framework)
- Custom tool implementations

**MCP Tools Exposed**:

#### knowledge.read
Read and retrieve knowledge documents with rich metadata and context

#### knowledge.write
Create and update knowledge documents with AI-assisted formatting and organization

#### knowledge.search
Perform advanced searches across the knowledge base with semantic understanding

#### project.summary
Generate AI-powered summaries of project knowledge and status

#### knowledge.graph.build
Construct knowledge graphs showing relationships between concepts, documents, and projects

#### ai.analyze
Perform AI-driven analysis on knowledge content for insights and recommendations

**Responsibilities**:
- Expose knowledge operations to AI assistants (like Claude)
- Enable natural language interaction with knowledge base
- Provide structured tool interfaces for AI consumption
- Handle tool validation and error management
- Integrate with backend API for data access

---

## 3. Technology Stack Summary

### Frontend Layer
| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with SSR/SSG |
| TypeScript | Type safety and developer experience |
| ShadCN UI | Modern, accessible UI components |
| React Query | Server state and cache management |
| TailwindCSS | Utility-first styling framework |

### Backend Layer
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web application framework |
| TypeScript | Type safety |
| MongoDB | NoSQL database for flexible schemas |
| Mongoose | MongoDB object modeling |

### AI Layer
| Component | Purpose |
|-----------|---------|
| NLP Helpers | Text analysis and processing |
| Embedding Processors | Vector generation for semantic search |
| Document Chunking | Intelligent document splitting |
| Prompt Templates | Reusable AI interaction patterns |

### MCP Layer
| Technology | Purpose |
|------------|---------|
| MCP SDK | Model Context Protocol implementation |
| Custom Tools | Knowledge-specific operations |
| TypeScript | Type-safe tool definitions |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Application containerization |
| Kubernetes | Container orchestration |
| Helm | Kubernetes package management |
| VKS | Vultr Kubernetes Service (cloud hosting) |
| GitHub | CI/CD pipelines per service |

---

## 4. Data Architecture

### Knowledge Document Model

Knowledge is stored as flexible documents in MongoDB, supporting:

**Structured Knowledge**:
- Use cases and user stories
- Technical specifications
- API documentation
- Architecture decisions

**Unstructured Knowledge**:
- Meeting notes
- Design discussions
- Research findings
- Best practices

**Metadata**:
- Project associations
- Tags and categories
- Creation and modification timestamps
- Author information
- H2PAL task linkages (optional)

### Vector Embeddings

All knowledge documents are processed to generate vector embeddings:
- Enable semantic search capabilities
- Find related content automatically
- Support AI-powered recommendations
- Facilitate knowledge graph construction

---

## 5. Integration Points

### 5.1 H2PAL Integration

**H2PAL** (H2BIS Project Automation Layer) integration enables:

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

**Model Context Protocol** enables AI assistants to:

- Access knowledge base through standardized tools
- Perform CRUD operations on knowledge documents
- Execute semantic searches
- Generate project summaries
- Build knowledge graphs
- Perform AI-driven analysis

**Workflow**:
```
AI Assistant (Claude) 
    ↓ MCP Protocol
h2bis-pb-mcp (MCP Server)
    ↓ API Calls
h2bis-pb-api (Backend)
    ↓ Database Operations
MongoDB (Knowledge Store)
```

---

### 5.3 AI Model Providers

ProjectBrain integrates with multiple AI providers:

#### OpenAI
- GPT models for text generation
- Embedding models for vector generation
- Primary AI provider for analysis and summarization

#### Google Gemini
- Alternative LLM for text operations
- Multi-modal capabilities
- Fallback and comparison provider

#### Local Inference (Optional Future)
- On-premise model hosting
- Privacy-sensitive use cases
- Cost optimization for high-volume operations

---

## 6. MCP Tools (Detailed)

### 6.1 knowledge.read

**Purpose**: Retrieve knowledge documents with full context

**Capabilities**:
- Fetch by ID or criteria
- Include related documents
- Retrieve with metadata
- Support filtering and projection

**Use Cases**:
- AI assistant needs project context
- Reference documentation lookup
- Knowledge exploration

---

### 6.2 knowledge.write

**Purpose**: Create and update knowledge documents

**Capabilities**:
- Create new knowledge entries
- Update existing documents
- AI-assisted formatting
- Automatic categorization

**Use Cases**:
- Capture meeting notes
- Document decisions
- Store research findings

---

### 6.3 knowledge.search

**Purpose**: Advanced search across knowledge base

**Capabilities**:
- Full-text search
- Semantic/vector search
- Filter by metadata
- Rank by relevance

**Use Cases**:
- Find relevant documentation
- Discover related concepts
- Answer specific questions

---

### 6.4 project.summary

**Purpose**: Generate AI-powered project summaries

**Capabilities**:
- Aggregate project knowledge
- Identify key themes
- Summarize status and progress
- Highlight important decisions

**Use Cases**:
- Onboard new team members
- Prepare status reports
- Quick project overview

---

### 6.5 knowledge.graph.build

**Purpose**: Construct knowledge graphs

**Capabilities**:
- Extract entities and relationships
- Build concept maps
- Identify knowledge clusters
- Visualize connections

**Use Cases**:
- Understand project structure
- Find knowledge gaps
- Explore relationships

---

### 6.6 ai.analyze

**Purpose**: AI-driven knowledge analysis

**Capabilities**:
- Sentiment analysis
- Trend identification
- Gap detection
- Quality assessment

**Use Cases**:
- Improve documentation quality
- Identify missing information
- Assess knowledge coverage

---

## 7. Deployment Architecture

### Polyrepo Deployment Model

Each service is independently deployed:

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

### 8.1 Knowledge Creation Workflow

```
User creates knowledge via Web UI
    ↓
h2bis-pb-web sends to API
    ↓
h2bis-pb-api validates and processes
    ↓
h2bis-pb-ai generates embeddings
    ↓
h2bis-pb-api stores in MongoDB
    ↓
Response returned to user
```

### 8.2 AI-Assisted Search Workflow

```
User searches via Web UI or AI Assistant
    ↓
Query sent to h2bis-pb-api
    ↓
h2bis-pb-ai generates query embedding
    ↓
Vector search on MongoDB
    ↓
Results ranked by relevance
    ↓
h2bis-pb-ai summarizes results
    ↓
Enhanced results returned
```

### 8.3 MCP Tool Execution Workflow

```
AI Assistant invokes MCP tool
    ↓
h2bis-pb-mcp validates request
    ↓
Tool calls h2bis-pb-api
    ↓
h2bis-pb-api processes request
    ↓
h2bis-pb-ai enhances if needed
    ↓
Data from/to MongoDB
    ↓
Formatted response to AI Assistant
```

### 8.4 H2PAL Sync Workflow

```
Project event in H2PAL
    ↓
Webhook/notification to h2bis-pb-api
    ↓
h2bis-pb-api processes metadata
    ↓
Knowledge enriched with project context
    ↓
Updates stored in MongoDB
    ↓
Acknowledgment to H2PAL
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

### Authentication Strategy

**Unified Ecosystem Authentication**:
- JWT-based authentication shared with H2PAL
- Single sign-on experience
- Token refresh mechanisms
- Secure token storage

### Authorization Model

**Role-Based Access Control (RBAC)**:
- User roles: Admin, Editor, Viewer
- Project-level permissions
- Team-based access control
- Fine-grained resource permissions

### API Security

- HTTPS/TLS for all communications
- Request rate limiting
- Input validation and sanitization
- CORS configuration
- API key management for service-to-service

### Data Security

- Encryption at rest for sensitive data
- Encrypted database connections
- Secure secret management (Kubernetes Secrets)
- Audit logging for sensitive operations
- Regular security scanning in CI/CD

---

## 11. Scalability & Performance

### Horizontal Scaling

**Stateless Services**:
- Multiple replicas of web, API, and MCP servers
- Load balancing across pods
- Auto-scaling based on metrics
- Session management via JWT (stateless)

**Stateful Services**:
- MongoDB replica sets for high availability
- Read replicas for query performance
- Sharding for large datasets (future)

### Caching Strategy

**Application Level**:
- React Query caching in frontend
- HTTP cache headers
- API response caching (Redis consideration)

**Database Level**:
- MongoDB query result caching
- Index optimization
- Embedding cache for repeated queries

### Performance Optimization

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

### Metrics Collection

- Application performance metrics
- API response times
- Error rates and types
- Database query performance
- Resource utilization (CPU, memory)

### Logging Strategy

**Structured Logging**:
- JSON formatted logs
- Log levels (ERROR, WARN, INFO, DEBUG)
- Request ID tracing
- Centralized log aggregation

### Alerting

- Error rate thresholds
- Performance degradation alerts
- Security event notifications
- Deployment status updates

### Tracing

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

### Phase 1: Advanced AI Features
- Multi-modal knowledge (images, diagrams)
- Real-time collaborative editing
- Advanced knowledge graph visualizations
- AI-suggested knowledge links

### Phase 2: Enhanced Integrations
- IDE plugins for knowledge access
- Slack/Teams integration
- GitHub commit knowledge extraction
- JIRA/Linear integration beyond H2PAL

### Phase 3: Enterprise Features
- Multi-tenancy support
- Advanced analytics dashboard
- Custom knowledge taxonomies
- Compliance and audit trails

### Phase 4: Platform Extensions
- Plugin system for custom tools
- Custom AI model integration
- Knowledge import/export utilities
- Template marketplace

---

## Conclusion

H2BIS ProjectBrain represents a modern, AI-first approach to knowledge management for software teams. Its polyrepo architecture ensures scalability and flexibility, while deep integration with AI and the H2BIS ecosystem provides powerful capabilities for knowledge creation, organization, and discovery.

The system is designed to grow with teams, supporting everything from simple knowledge storage to advanced AI-assisted workflows, all while maintaining clean separation of concerns and independent service deployments.

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-17  
**Status**: Conceptual Architecture  
**Maintained By**: H2BIS Team

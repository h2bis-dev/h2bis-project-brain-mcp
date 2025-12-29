H2BIS PROJECTBRAIN - LLM-DRIVEN DEVELOPMENT GUIDE

================================================================================
OVERVIEW
================================================================================

H2BIS ProjectBrain is a knowledge management system that bridges the gap between business requirements and AI-driven software development. It enables Business Analysts to write requirements in a human-friendly format, which are automatically transformed into an LLM-optimized structure for implementation.


================================================================================
THE TWO-SCHEMA ARCHITECTURE
================================================================================

For Business Analysts: Use Cases
    Purpose: Capture requirements in natural, narrative format
    Focus: Business value, user stories, acceptance criteria
    Storage: use_cases collection in MongoDB
    Format: Human-readable with flows, actors, and business context

For LLMs: Capabilities
    Purpose: Provide machine-optimized implementation guidance
    Focus: Technical details, dependencies, implementation hints
    Storage: capabilities collection in MongoDB
    Format: Graph-structured with precise technical mappings

Key Principle: 
    BAs write Use Cases 
        → System auto-generates Capabilities 
            → LLMs read Capabilities


================================================================================
DATA FLOW: FROM REQUIREMENTS TO IMPLEMENTATION
================================================================================

Step 1: BA Enters Use Case

    A Business Analyst creates a use case describing a feature:
        - What the user wants to achieve
        - Why it matters to the business
        - Step-by-step user interactions
        - Acceptance criteria for completion
        - Which systems/components are affected

    Entry Point: POST to /api/knowledge with use case JSON


Step 2: Automatic Transformation

    The system immediately:
        1. Validates the use case structure
        2. Stores it in the use_cases collection
        3. Automatically transforms it into a Capability
        4. Stores the capability in the capabilities collection

    Transformation Service extracts and restructures:
        Business narrative → Technical intent
        User flows → Behavioral specifications
        Technical surface → Precise file/component mappings
        Relationships → Dependency graph
        AI metadata → Implementation hints


Step 3: LLM Retrieval

    When an LLM is tasked with software development, it queries the system:

    Discovery: "What features need to be built?"
        - Queries capabilities by implementation status
        - Filters by tags, complexity, or priority

    Planning: "In what order should I build them?"
        - Retrieves dependency graph
        - Calculates topological sort for correct implementation order
        - Example: User Registration → User Login → View Profile

    Context: "What do I need to know about this feature?"
        - Gets the capability with full context
        - Includes dependencies (what must exist first)
        - Includes dependents (what will use this)
        - Includes impact analysis (what breaks if this changes)


Step 4: LLM Implementation

    The LLM uses the capability data to guide implementation:

    From Intent:
        - Understands the business purpose
        - Writes meaningful comments and documentation
        - Makes design decisions aligned with goals

    From Behavior:
        - Implements each user flow as a function/method
        - Generates test cases from acceptance criteria
        - Handles error scenarios explicitly

    From Realization:
        - Knows which files to create or modify
        - Understands the architecture (frontend/backend/database)
        - Creates the correct API endpoints
        - Designs database schema

    From Dependencies:
        - Ensures prerequisites are implemented first
        - Imports and references other modules correctly
        - Avoids building features out of order

    From AI Hints:
        - Estimates implementation effort
        - Avoids common pitfalls and security issues
        - Prioritizes testing strategies
        - Breaks complex work into manageable chunks

    From Artifacts:
        - Links generated code back to requirements
        - Tracks which files implement which capabilities
        - Enables bidirectional traceability


Step 5: Progress Tracking

    As the LLM implements features:
        - Updates implementation status (not_started → in_progress → code_complete → deployed)
        - Records completion percentage
        - Links created files to the capability
        - Reports any blockers encountered


================================================================================
CAPABILITY STRUCTURE: WHAT THE LLM SEES
================================================================================

Intent (The "Why")
    User goal: What the user wants to accomplish
    System responsibility: What the system must do
    Business value: Why this matters

Behavior (The "What")
    Acceptance criteria: Testable conditions for "done"
    Flows: Step-by-step user interactions (main, alternative, error)

Realization (The "Where")
    Frontend: Routes, components, pages
    Backend: API endpoints, services, repositories
    Data: Database collections/tables and operations

Dependencies (The "Prerequisites")
    Hard dependencies: Must be implemented first
    Soft dependencies: Nice to have but not required
    Reason: Why the dependency exists

AI Hints (The "How")
    Complexity score: Effort estimation (1-10)
    Failure modes: Common pitfalls to avoid
    Test focus areas: What to test thoroughly
    Recommended chunking: How to break down the work
    Non-functional requirements: Performance, security, scalability

Artifacts (The "Files")
    Source files: Components, modules, services
    Test files: Unit tests, integration tests
    Documentation: Guides, API docs

Implementation (The "Progress")
    Status: Current state (not_started, in_progress, deployed, etc.)
    Completion percentage: How much is done
    Last updated: When work was last performed
    Blockers: What's preventing progress


================================================================================
GRAPH-BASED INTELLIGENCE
================================================================================

Dependency Management
    The system maintains a directed graph of capabilities:
        - Each capability can depend on others
        - Dependencies determine implementation order
        - Circular dependencies are prevented
        - Topological sort ensures correct sequencing

Impact Analysis
    Before making changes, the LLM can query:
        - Which capabilities depend on this one?
        - How many features will be affected?
        - What's the risk level of this change?

    This prevents breaking existing functionality and guides refactoring decisions.


================================================================================
COMPLETE DEVELOPMENT WORKFLOW
================================================================================

1. Discovery Phase
    LLM queries: "Show me all features that need implementation"
        - Retrieves capabilities with status = "not_started"
        - Filters by tags or complexity if needed

2. Planning Phase
    LLM queries: "What order should I implement these in?"
        - Sends list of capability IDs
        - Receives topologically sorted order
        - Ensures dependencies are satisfied

3. Context Gathering
    LLM queries: "Give me full context for Feature X"
        - Receives the capability
        - Receives all dependencies (what must exist first)
        - Receives all dependents (what will use this)
        - Receives impact analysis

4. Implementation
    LLM generates code using:
        - Intent for understanding purpose
        - Behavior for implementing flows and tests
        - Realization for knowing which files to create
        - AI Hints for avoiding mistakes
        - Dependencies for importing prerequisites

5. Testing
    LLM generates tests based on:
        - Acceptance criteria (what must work)
        - Test focus areas (what to test thoroughly)
        - Failure modes (edge cases to cover)

6. Progress Tracking
    LLM updates:
        - Implementation status
        - Completion percentage
        - Links to created files
        - Any blockers encountered

7. Verification
    LLM checks:
        - Impact on dependent features
        - Whether all acceptance criteria are met
        - Whether all flows are implemented


================================================================================
USE CASES VS CAPABILITIES: WHEN TO USE WHAT
================================================================================

LLM Primarily Uses Capabilities
    During implementation: Always read from capabilities
    For dependencies: Use capability graph queries
    For technical details: Use realization mappings
    For testing: Use behavior and AI hints

LLM Occasionally References Use Cases
    For additional context: When capability is unclear
    For user perspective: To understand user stories
    For business justification: Why this feature exists
    For stakeholder communication: Human-readable format

Typical Pattern
    1. Start with Capability (machine-optimized)
    2. Reference Use Case if needed (human context)
    3. Implement from Capability (technical precision)
    4. Test against Capability (acceptance criteria)


================================================================================
BENEFITS OF THIS ARCHITECTURE
================================================================================

For Business Analysts
    - Write in familiar, narrative format
    - No need to understand technical implementation
    - Focus on business value and user needs
    - Single entry point for all requirements

For LLMs
    - Receive structured, machine-readable data
    - Get precise technical guidance
    - Understand dependencies and order
    - Access implementation hints and best practices
    - Track progress systematically

For the Organization
    - Bidirectional traceability (code ↔ requirements)
    - Automated synchronization (no manual duplication)
    - Graph-based intelligence (dependency management)
    - Progressive implementation tracking
    - Reduced risk through impact analysis


================================================================================
SUMMARY
================================================================================

H2BIS ProjectBrain creates a seamless bridge between business requirements and AI-driven development:

    1. BAs write Use Cases in human-friendly format
    
    2. System auto-generates Capabilities in LLM-optimized format
    
    3. LLMs query Capabilities to understand what to build
    
    4. Graph structure ensures correct implementation order
    
    5. Rich metadata guides safe and effective implementation
    
    6. Progress tracking maintains visibility throughout development
    
    7. Bidirectional linking ensures traceability from code to requirements

The result: Business requirements flow directly into working software through AI-driven development, with full traceability and intelligent dependency management.

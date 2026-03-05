# Use Case Attributes Analysis - Potential Redundancy with Project Level

## Attributes That May Duplicate Project-Level Concerns

The following Use Case attributes may be redundant because similar information already exists at the Project level. These should be evaluated for removal or refactoring to inherit from Project.

### 1. Architecture Patterns
**Use Case**: `architecturePatterns` (string[])  
**Project**: `metadata.architecture` (object with `overview`, `style`, `directoryStructure`, `stateManagement`)  
**Recommendation**: Remove from Use Case, inherit from Project `metadata.architecture.style`

### 2. Configuration
**Use Case**: `configuration.envVars` (string[])  
**Use Case**: `configuration.featureFlags` (string[])  
**Project**: Project-level configuration should be centralized  
**Recommendation**: Move to Project level or remove if not use-case-specific

### 3. Quality & Testing
**Use Case**: `quality.testTypes` (enum[])  
**Project**: `metadata.qualityGates.testingRequirements.testTypes` (string[])  
**Recommendation**: Remove from Use Case, inherit from Project `metadata.qualityGates.testingRequirements.testTypes`

**Use Case**: `quality.performanceCriteria` (string[])  
**Project**: `metadata.qualityGates` (has general quality criteria)  
**Recommendation**: Evaluate if this should be project-wide

**Use Case**: `quality.securityConsiderations` (string[])  
**Project**: `metadata.qualityGates` (general quality standards)  
**Recommendation**: Evaluate if security should be project-wide policy

### 4. Domain Model
**Use Case**: `domainModel.entities` (array)  
**Project**: `domainCatalog` (array)  
**Recommendation**: Use Case should reference Project's `domainCatalog` instead of duplicating entity definitions

### 5. Standards & Conventions
**Use Case**: Implicitly follows project conventions  
**Project**: `metadata.standards` (namingConventions, errorHandling, loggingConvention)  
**Recommendation**: Use Cases should not override project standards

---

## Summary of Attributes to Remove from Use Case

| Use Case Attribute | Reason | Project Equivalent |
|-------------------|--------|-------------------|
| `architecturePatterns` | Project defines architecture | `metadata.architecture` |
| `quality.testTypes` | Project defines test requirements | `metadata.qualityGates.testingRequirements.testTypes` |
| `configuration.envVars` | Project-level concern | Should be in Project metadata |
| `configuration.featureFlags` | Project-level concern | Should be in Project metadata |
| `domainModel.entities` | Duplicates catalog | `domainCatalog` |

---

## Attributes to Keep in Use Case (Use-Case-Specific)

These attributes are appropriately scoped to individual use cases:

- `projectId`, `type`, `key`, `name`, `description` - Identity
- `status.*` - Use case lifecycle tracking
- `businessValue`, `primaryActor` - Use case specifics
- `acceptanceCriteria`, `stakeholders` - Requirements
- `functionalRequirements.*`, `scope.*` - Detailed requirements
- `interfaces.*` - Use case interfaces
- `errorHandling.knownErrors` - Specific error scenarios
- `flows` - Use case flows
- `technicalSurface.*` - Implementation surface area
- `relationships` - Inter-use-case relationships
- `implementationRisk` - Use case risks
- `tags`, `normative` - Metadata
- `aiDirectives.*` - AI generation directives
- `aiMetadata.*` - AI processing metadata
- `quality.performanceCriteria` - If use-case-specific performance needs
- `quality.securityConsiderations` - If use-case-specific security needs

---

**Action Required**: Review and remove redundant attributes from Use Case schema, update to reference Project-level attributes instead.
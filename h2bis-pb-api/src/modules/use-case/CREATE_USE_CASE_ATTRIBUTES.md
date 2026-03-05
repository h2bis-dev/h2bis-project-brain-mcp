| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `projectId` | string | *required* | Foreign key to project |
| `type` | literal | `'use_case'` | Entity type |
| `key` | string | *required* | Unique key (lowercase alphanumeric with hyphens) |
| `name` | string | *required* | Use case name |
| `description` | string | *required* | Use case description |
| `status.lifecycle` | enum | `'idea'` | `idea`, `planned`, `in_development`, `ai_generated`, `human_reviewed`, `completed` |
| `status.reviewedByHuman` | boolean | `false` | Human review flag |
| `status.generatedByAI` | boolean | `false` | AI generation flag |
| `businessValue` | string | *required* | Business value explanation |
| `primaryActor` | string | *required* | Primary actor/user |
| `acceptanceCriteria` | string[] | `[]` | Acceptance criteria list |
| `stakeholders` | string[] | `undefined` | Stakeholder list |
| `functionalRequirements.must` | string[] | `[]` | Must-have requirements |
| `functionalRequirements.should` | string[] | `[]` | Should-have requirements |
| `functionalRequirements.wont` | string[] | `[]` | Won't-have requirements |
| `scope.inScope` | string[] | `[]` | In-scope items |
| `scope.outOfScope` | string[] | `[]` | Out-of-scope items |
| `scope.assumptions` | string[] | `[]` | Assumptions |
| `scope.constraints` | string[] | `[]` | Constraints |
| `domainModel.entities` | array | `[]` | Domain entities with `name`, `description`, `fields` |
| `interfaces.type` | enum | `'REST'` | `REST`, `GraphQL`, `Event`, `UI` |
| `interfaces.endpoints` | array | `[]` | Endpoints with `method`, `path`, `request`, `response` |
| `interfaces.events` | string[] | `[]` | Event list |
| `errorHandling.knownErrors` | array | `[]` | Known errors with `condition`, `expectedBehavior` |
| `quality.testTypes` | enum[] | `[]` | `unit`, `integration`, `e2e`, `security` |
| `quality.performanceCriteria` | string[] | `[]` | Performance requirements |
| `quality.securityConsiderations` | string[] | `[]` | Security considerations |
| `aiDirectives.generationLevel` | enum | `'partial'` | `skeleton`, `partial`, `full` |
| `aiDirectives.overwritePolicy` | enum | `'ifEmpty'` | `never`, `ifEmpty`, `always` |
| `flows` | array | `[]` | Flows with `name`, `steps`, `type` (`main`, `alternative`, `error`) |
| `technicalSurface.backend.repos` | string[] | *required* | Backend repositories |
| `technicalSurface.backend.endpoints` | string[] | `[]` | Backend endpoints |
| `technicalSurface.backend.collections` | array | `[]` | DB collections with `name`, `purpose`, `operations` (CREATE, READ, UPDATE, DELETE) |
| `technicalSurface.frontend.repos` | string[] | *required* | Frontend repositories |
| `technicalSurface.frontend.routes` | string[] | `[]` | Frontend routes |
| `technicalSurface.frontend.components` | string[] | `[]` | Frontend components |
| `relationships` | array | `[]` | Relationships with `type`, `targetType`, `targetKey`, `reason` |
| `implementationRisk` | array | `[]` | Implementation risks with `rule`, `normative` |
| `tags` | string[] | `[]` | Tags |
| `normative` | boolean | `false` | Normative validation flag |
| `aiMetadata.estimatedComplexity` | enum | `'medium'` | `low`, `medium`, `high` |
| `aiMetadata.implementationRisk` | string[] | `[]` | Implementation risks |
| `aiMetadata.suggestedOrder` | number | `undefined` | Suggested implementation order |
| `aiMetadata.testStrategy` | string[] | `[]` | Test strategy |
| `aiMetadata.nonFunctionalRequirements` | string[] | `[]` | Non-functional requirements |
| `aiMetadata.skipValidation` | boolean | `undefined` | Skip validation flag |
| `aiMetadata.normativeMode` | boolean | `undefined` | Normative mode flag |
| `aiMetadata.insufficiencyReasons` | string[] | `undefined` | Validation feedback |

**Full schema**: See [use-case.dto.ts](use-case.dto.ts) and [use_case_schema.ts](../../core/schemas/use_case_schema.ts)
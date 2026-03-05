| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `_id` | string | *required* | Unique identifier (1-100 chars) |
| `name` | string | *required* | Project name (1-255 chars) |
| `description` | string | `''` | Project description (max 1000 chars) |
| `lifecycle` | enum | `'planning'` | `planning`, `in_development`, `in_review`, `in_testing`, `staging`, `production`, `maintenance`, `archived` |
| `accessControl.allowAdmins` | boolean | `true` | Admin access |
| `accessControl.allowedRoles` | string[] | `[]` | Allowed roles |
| `metadata.repository` | string | `''` | Git repo URL |
| `metadata.techStack` | string[] | `[]` | Technologies |
| `metadata.language` | string | `''` | Primary language |
| `metadata.framework` | string | `''` | Primary framework |
| `metadata.architecture` | object | `{}` | Architecture details (`overview`, `style`, `directoryStructure`, `stateManagement`) |
| `metadata.authStrategy` | object | `{}` | Auth approach and implementation |
| `metadata.deployment` | object | `{}` | Environment and CI/CD |
| `metadata.externalServices` | array | `[]` | External integrations (`name`, `purpose`, `apiDocs`) |
| `metadata.standards` | object | `{}` | Naming, error handling, logging conventions |
| `metadata.qualityGates` | object | `{}` | Definition of done, code review checklist, testing requirements, documentation standards |
| `domainCatalog` | array | `[]` | Reusable models with `name`, `layer`, `fields` |

**Full schema**: See [project.dto.ts](project.dto.ts) and [project_schema.ts](project_schema.ts)

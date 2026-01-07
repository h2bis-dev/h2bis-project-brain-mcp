# Normative Validation Framework - Test Use Cases

## Test 1: Complete Normative Use Case (Should SUCCEED)

```json
{
  "type": "use_case",
  "key": "test-normative-complete",
  "name": "Complete Normative Test Use Case",
  "description": "A fully specified use case for testing normative validation",
  "businessValue": "Validates that complete normative use cases can generate capabilities",
  "primaryActor": "Test User",
  "normative": true,
  
  "status": {
    "lifecycle": "planned",
    "reviewedByHuman": false,
    "generatedByAI": false
  },
  
  "acceptanceCriteria": [
    "System validates all required fields",
    "Capability is generated successfully",
    "No insufficiency errors are returned"
  ],
  
  "flows": [
    {
      "name": "Main Flow",
      "type": "main",
      "steps": [
        "User submits complete use case",
        "System validates completeness",
        "System generates capability",
        "System returns success"
      ]
    }
  ],
  
  "technicalSurface": {
    "backend": {
      "repos": ["api"],
      "endpoints": ["/api/test/complete"],
      "collections": []
    },
    "frontend": {
      "repos": ["webapp"],
      "routes": ["/test/complete"],
      "components": ["TestComponent"]
    }
  },
  
  "relationships": [],
  "tags": ["test", "normative"]
}
```

**Expected Result**: 201 Created, `mode: "CONSTRAINED"`, `capabilityGenerated: true`

---

## Test 2: Incomplete Normative Use Case (Should REJECT)

```json
{
  "type": "use_case",
  "key": "test-normative-incomplete",
  "name": "Incomplete Normative Test Use Case",
  "description": "A use case missing technical surface",
  "businessValue": "Tests rejection of incomplete normative use cases",
  "primaryActor": "Test User",
  "normative": true,
  
  "status": {
    "lifecycle": "planned",
    "reviewedByHuman": false,
    "generatedByAI": false
  },
  
  "acceptanceCriteria": [
    "System detects missing technical surface",
    "System rejects capability generation",
    "System returns detailed insufficiency report"
  ],
  
  "flows": [
    {
      "name": "Main Flow",
      "type": "main",
      "steps": [
        "User submits incomplete use case",
        "System validates completeness",
        "System rejects generation"
      ]
    }
  ],
  
  "technicalSurface": {
    "backend": {
      "repos": [],
      "endpoints": [],
      "collections": []
    },
    "frontend": {
      "repos": [],
      "routes": [],
      "components": []
    }
  },
  
  "relationships": [],
  "tags": ["test", "normative"]
}
```

**Expected Result**: 400 Bad Request, `mode: "REJECTED"`, `insufficiencyReport` with field: `technicalSurface`

---

## Test 3: Non-Normative Use Case (Should use STANDARD mode)

```json
{
  "type": "use_case",
  "key": "test-standard",
  "name": "Standard Test Use Case",
  "description": "A use case without normative flag",
  "businessValue": "Tests standard generation with inference allowed",
  "primaryActor": "Test User",
  "normative": false,
  
  "status": {
    "lifecycle": "planned",
    "reviewedByHuman": false,
    "generatedByAI": false
  },
  
  "acceptanceCriteria": [
    "System allows AI inference",
    "Capability is generated even with minimal data"
  ],
  
  "flows": [
    {
      "name": "Main Flow",
      "type": "main",
      "steps": [
        "User submits standard use case",
        "System generates capability with inference"
      ]
    }
  ],
  
  "technicalSurface": {
    "backend": {
      "repos": [],
      "endpoints": [],
      "collections": []
    },
    "frontend": {
      "repos": [],
      "routes": [],
      "components": []
    }
  },
  
  "relationships": [],
  "tags": ["test"]
}
```

**Expected Result**: 201 Created, `mode: "STANDARD"`, `capabilityGenerated: true`

---

## How to Test

### Using curl (API directly)

```bash
# Test 1: Complete normative (should succeed)
curl -X POST http://localhost:3000/api/knowledge/insert \
  -H "Content-Type: application/json" \
  -d @test-complete-normative.json

# Test 2: Incomplete normative (should reject)
curl -X POST http://localhost:3000/api/knowledge/insert \
  -H "Content-Type: application/json" \
  -d @test-incomplete-normative.json

# Test 3: Non-normative (should succeed with inference)
curl -X POST http://localhost:3000/api/knowledge/insert \
  -H "Content-Type: application/json" \
  -d @test-standard.json
```

### Expected Console Output

**Test 1 (Complete Normative)**:
```
✅ UseCase detected, validating for capability generation...
   Normative flag: true
🔒 Normativity Check: { isNormative: true, decision: 'PROCEED', insufficiencies: 0 }
✅ Proceeding with CONSTRAINED capability generation...
🤖 Extracting intent for use case: test-normative-complete (STRICT MODE)
✅ Auto-generated capability cap-test-normative-complete in CONSTRAINED mode
```

**Test 2 (Incomplete Normative)**:
```
✅ UseCase detected, validating for capability generation...
   Normative flag: true
🔒 Normativity Check: { isNormative: true, decision: 'REJECT', insufficiencies: 1 }
❌ REJECTED: Normative use case is incomplete
   Insufficiencies: technicalSurface: Normative use case requires explicit technical surface
```

**Test 3 (Standard)**:
```
✅ UseCase detected, validating for capability generation...
   Normative flag: false
🔒 Normativity Check: { isNormative: false, decision: 'PROCEED', insufficiencies: 0 }
✅ Proceeding with STANDARD capability generation...
✅ Auto-generated capability cap-test-standard in STANDARD mode
```

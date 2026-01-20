## JWT Authentication - End-to-End Test

### Step 1: Login to get access token

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test6@gmail.com\",\"password\":\"your_password_here\"}"
```

**Expected Response:**
```json
{
  "id": "69674df605109cc722a84180",
  "email": "test6@gmail.com",
  "role": ["user"],
  "isActive": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 2: Test the protected endpoint with the access token

Copy the `accessToken` from Step 1 response, then:

```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Expected Response (Success ✅):**
```json
{
  "success": true,
  "message": "JWT verification successful",
  "user": {
    "userId": "69674df605109cc722a84180",
    "email": "test6@gmail.com",
    "roles": ["user"]
  }
}
```

### Step 3: Test with invalid/missing token

```bash
# Test without token
curl -X GET http://localhost:4000/api/auth/me

# Test with invalid token
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer invalid.token.here"
```

**Expected Response (Error ❌):**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

## PowerShell Version

### Step 1: Login
```powershell
$loginResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test6@gmail.com","password":"your_password_here"}'

$accessToken = $loginResponse.accessToken
Write-Host "Access Token: $accessToken"
```

### Step 2: Test Protected Endpoint
```powershell
$headers = @{
    "Authorization" = "Bearer $accessToken"
}

Invoke-RestMethod -Uri "http://localhost:4000/api/auth/me" `
  -Method GET `
  -Headers $headers | ConvertTo-Json
```

---

## Summary

✅ **What This Proves:**
1. Login endpoint generates valid JWT tokens
2. Protected endpoint verifies tokens correctly
3. JWT signature is valid and verified by your API
4. Authentication middleware works correctly

⚠️ **About External JWT Decoders:**
- When using jwt.io, you MUST paste your `JWT_ACCESS_SECRET` in the verify section
- The secret is in your `.env` file
- Never paste production secrets into public websites

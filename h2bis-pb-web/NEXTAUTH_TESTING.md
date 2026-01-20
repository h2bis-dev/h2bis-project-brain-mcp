# NextAuth with Custom API - Testing Guide

## Setup Complete ✅

Your NextAuth is now configured to work with your custom h2bis-pb-api JWT authentication.

## What Changed

### 1. NextAuth Configuration
- **Stores API tokens**: `accessToken` and `refreshToken` from your API
- **Supports role arrays**: Roles stored as `string[]` instead of single string
- **Session includes tokens**: Tokens accessible client-side via `useSession()`

### 2. TypeScript Types
- Extended NextAuth/JWT types to include custom fields
- File: [`next-auth.d.ts`](file:///c:/My_work/RnD/project_brain_prototype_node/h2bis-pb/h2bis-pb-web/src/types/next-auth.d.ts)

### 3. Helper Functions
- `getAccessToken()` - Get token from session
- `authenticatedFetch()` - Auto-includes token in requests
- File: [`session-helper.ts`](file:///c:/My_work/RnD/project_brain_prototype_node/h2bis-pb/h2bis-pb-web/src/lib/auth/session-helper.ts)

## How to Test

### 1. Login via Web UI

Navigate to `http://localhost:3000/login` and login with:
- Email: `test6@gmail.com`
- Password: `Abcd@1234`

### 2. Check Session (Client Component)

```typescript
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session } = useSession();
  
  console.log('Access Token:', session?.accessToken);
  console.log('User Roles:', session?.user.role);
  console.log('User ID:', session?.user.id);
}
```

### 3. Make Authenticated API Call

```typescript
import { authenticatedFetch } from '@/lib/auth/session-helper';

async function testProtectedEndpoint() {
  try {
    const response = await authenticatedFetch('http://localhost:4000/api/auth/me');
    const data = await response.json();
    console.log('✅ Protected endpoint response:', data);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}
```

### 4. Verify in Browser DevTools

1. Open DevTools → Application → Cookies
2. Find `next-auth.session-token`
3. The token is encrypted but contains your API tokens

## Expected Flow

```
1. User logs in via web UI
   ↓
2. NextAuth calls your API: POST /api/auth/login
   ↓
3. API returns: { id, email, role, accessToken, refreshToken }
   ↓
4. NextAuth stores tokens in encrypted JWT
   ↓
5. Session available via useSession()
   ↓
6. Frontend makes API calls with accessToken in Authorization header
```

## Session Structure

```typescript
{
  user: {
    id: "69674df605109cc722a84180",
    email: "test6@gmail.com",
    role: ["user"]
  },
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Common Issues

**Problem**: Session is null after login  
**Solution**: Restart web dev server to pick up type changes

**Problem**: TypeScript errors about missing properties  
**Solution**: Check `next-auth.d.ts` is in your `tsconfig.json` includes

**Problem**: API calls fail with 401  
**Solution**: Verify token is being sent: check Network tab → Headers → Authorization

## Next Steps (Optional)

1. **Token Refresh**: Implement automatic token refresh when accessToken expires
2. **API Client**: Create axios instance that auto-includes token
3. **Role Guards**: Create components/hooks to check user roles

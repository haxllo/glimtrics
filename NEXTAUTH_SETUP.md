# NextAuth.js Setup Guide

This guide explains how to configure authentication for the Glimtrics application.

## Quick Start

Authentication is already configured with:
- ✅ Email/password authentication
- ✅ OAuth providers (Google, GitHub) - requires setup
- ✅ Protected routes
- ✅ Session management

## Required Environment Variables

Add these to your `.env` file:

```env
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string-here"

# OAuth Providers (Optional - leave empty if not using)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

## Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this Node.js command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Setting Up OAuth Providers (Optional)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen if prompted
6. Application type: "Web application"
7. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - Add production URL when deploying
8. Copy **Client ID** and **Client Secret** to `.env`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Glimtrics
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Generate a new client secret
6. Copy **Client ID** and **Client Secret** to `.env`

## Authentication Flow

### Sign Up (Email/Password)
1. User visits `/auth/signup`
2. Fills in name, email, password
3. Account created in database with hashed password
4. Automatically signed in and redirected to dashboard

### Sign In (Email/Password)
1. User visits `/auth/login`
2. Enters email and password
3. Credentials verified against database
4. Session created and redirected to dashboard

### OAuth Sign In
1. User clicks "Google" or "GitHub" button
2. Redirected to OAuth provider
3. User authorizes application
4. Account created/linked in database
5. Redirected to dashboard

## Protected Routes

The `/dashboard/*` routes are automatically protected. If a user tries to access them without being authenticated, they'll be redirected to the login page.

### In Server Components

```typescript
import { requireAuth } from "@/lib/auth-helpers";

export default async function ProtectedPage() {
  const user = await requireAuth(); // Redirects if not authenticated
  
  return <div>Welcome, {user.name}!</div>;
}
```

### In Client Components

```typescript
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProtectedComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  if (status === "loading") return <div>Loading...</div>;
  
  if (!session) {
    router.push("/auth/login");
    return null;
  }
  
  return <div>Welcome, {session.user.name}!</div>;
}
```

## Session Management

Sessions are managed using JWT tokens and stored in the database.

### Get Current User (Server)

```typescript
import { getCurrentUser } from "@/lib/auth-helpers";

const user = await getCurrentUser();
if (user) {
  console.log(user.id, user.email, user.name);
}
```

### Sign Out

```typescript
"use client";

import { signOut } from "next-auth/react";

<button onClick={() => signOut({ callbackUrl: "/" })}>
  Sign Out
</button>
```

## Customization

### Custom Login Page

Edit `app/auth/login/page.tsx` and `components/auth/LoginForm.tsx`.

### Custom Signup Page

Edit `app/auth/signup/page.tsx` and `components/auth/SignupForm.tsx`.

### Add More OAuth Providers

1. Install the provider:
```bash
npm install next-auth
```

2. Add to `lib/auth.ts`:
```typescript
import TwitterProvider from "next-auth/providers/twitter";

providers: [
  // ... existing providers
  TwitterProvider({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  }),
]
```

3. Add credentials to `.env`:
```env
TWITTER_CLIENT_ID=""
TWITTER_CLIENT_SECRET=""
```

## Callbacks

### Session Callback

Adds user ID to session (already configured):

```typescript
async session({ token, session }) {
  if (token) {
    session.user.id = token.id;
  }
  return session;
}
```

### JWT Callback

Includes user data in JWT token (already configured):

```typescript
async jwt({ token, user }) {
  const dbUser = await prisma.user.findFirst({
    where: { email: token.email },
  });
  
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    picture: dbUser.image,
  };
}
```

## Security Best Practices

1. **Never commit `.env` file** - it contains secrets
2. **Use HTTPS in production** - required for secure cookies
3. **Rotate secrets regularly** - especially NEXTAUTH_SECRET
4. **Validate user input** - prevent SQL injection and XSS
5. **Rate limit authentication attempts** - prevent brute force
6. **Use strong passwords** - minimum 6 characters (increase for production)

## Troubleshooting

### "Invalid credentials" error
- Check that email exists in database
- Verify password is correct
- Ensure password is hashed with bcrypt

### OAuth redirect errors
- Verify callback URLs match exactly
- Check that OAuth credentials are correct
- Ensure provider is enabled in cloud console

### Session not persisting
- Check that NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

### "Configuration" error page
- Check that all required env variables are set
- Restart development server after changing .env
- Verify database connection is working

## Production Deployment

1. Set `NEXTAUTH_URL` to your production domain:
```env
NEXTAUTH_URL="https://yourdomain.com"
```

2. Update OAuth provider redirect URLs to production:
- Google: `https://yourdomain.com/api/auth/callback/google`
- GitHub: `https://yourdomain.com/api/auth/callback/github`

3. Use secure environment variables in hosting platform (Vercel, Netlify, etc.)

4. Enable HTTPS only cookies (automatic in production)

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Adapter](https://next-auth.js.org/adapters/prisma)
- [OAuth Provider Configuration](https://next-auth.js.org/configuration/providers/oauth)

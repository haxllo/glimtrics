# Supabase Database Setup Guide

This guide will help you set up a free Supabase PostgreSQL database for the AI Dashboards SaaS project.

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign Up"
3. Sign up with GitHub, Google, or email
4. Verify your email if required

## Step 2: Create a New Project

1. Click "New Project" in your Supabase dashboard
2. Fill in the project details:
   - **Name**: `ai-dashboards-saas` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Select "Free" (includes 500MB database, 1GB file storage, 2GB bandwidth)
3. Click "Create new project"
4. Wait 2-3 minutes for the project to be provisioned

## Step 3: Get Database Connection Strings

1. In your Supabase project dashboard, click on "Project Settings" (gear icon in the left sidebar)
2. Navigate to "Database" in the settings menu
3. Scroll down to "Connection string" section
4. You'll need two connection strings:

### Connection Pooling (Recommended for serverless)
- Select "Connection pooling" → "Transaction mode"
- Copy the connection string (starts with `postgresql://...`)
- This will be your `DATABASE_URL`

### Direct Connection
- Select "Direct connection"
- Copy the connection string
- This will be your `DIRECT_URL`

Both strings will have `[YOUR-PASSWORD]` placeholder - replace it with your database password.

## Step 4: Configure Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist):
```bash
cp .env.example .env
```

2. Add your Supabase connection strings to `.env`:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.compute.amazonaws.com:5432/postgres"
```

**Important**: Replace `[YOUR-PASSWORD]` with your actual database password!

## Step 5: Initialize Database with Prisma

Run these commands to set up your database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Optional: Open Prisma Studio to view your database
npx prisma studio
```

## Step 6: Verify Setup

1. Go to Supabase dashboard → "Table Editor"
2. You should see all your tables created:
   - User
   - Account
   - Session
   - VerificationToken
   - Subscription
   - Dashboard
   - Insight

## Free Tier Limits

Supabase Free Plan includes:
- **Database**: 500MB storage
- **File Storage**: 1GB
- **Bandwidth**: 2GB/month
- **API Requests**: Unlimited
- **Auth Users**: Unlimited
- **Realtime**: Unlimited
- **Edge Functions**: 500K invocations/month

Perfect for MVP and early development!

## Database Schema Overview

### User Model
- Authentication and user profile data
- Links to accounts, sessions, dashboards, and subscription

### Account Model
- OAuth provider accounts (Google, GitHub, etc.)
- Managed by NextAuth.js

### Session Model
- User sessions for authentication
- Managed by NextAuth.js

### Subscription Model
- Stripe billing information
- Plan tiers: free, basic, premium

### Dashboard Model
- User's data dashboards
- Stores uploaded data and metadata

### Insight Model
- AI-generated insights for each dashboard
- Types: trend, anomaly, suggestion

## Troubleshooting

### Connection Issues
- Ensure your IP is allowed (Supabase allows all IPs by default on free tier)
- Check that password is correctly encoded in URL
- Verify connection string format

### Password Issues
If your password contains special characters, URL encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `&` → `%26`

### Schema Push Fails
- Check that both DATABASE_URL and DIRECT_URL are set
- Ensure you're using the connection pooling URL for DATABASE_URL
- Try running `npx prisma generate` first

### View Database
Use Prisma Studio to inspect your data:
```bash
npx prisma studio
```
Opens at http://localhost:5555

## Production Considerations

For production deployment:
1. Enable Row Level Security (RLS) in Supabase
2. Set up database backups
3. Monitor connection pooling usage
4. Consider upgrading to Pro plan for more resources

## Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase + Prisma Guide](https://supabase.com/docs/guides/integrations/prisma)

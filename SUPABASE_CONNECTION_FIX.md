# Fix for Prepared Statement Errors

If you're seeing errors like `prepared statement "s0" already exists`, it's because Supabase uses connection pooling (PgBouncer) which requires special configuration.

## ✅ Solution: Update Your DATABASE_URL

In your `.env` file, make sure your `DATABASE_URL` includes these query parameters:

```env
# ❌ WRONG - Missing pgbouncer parameters
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# ✅ CORRECT - With pgbouncer parameters
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

## Required Parameters:

- `pgbouncer=true` - Disables prepared statements (PgBouncer doesn't support them)
- `connection_limit=1` - Limits connections for serverless environments

## Complete .env Setup:

```env
# Connection pooling URL (for queries) - Transaction mode
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct connection URL (for migrations)
DIRECT_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.compute.amazonaws.com:5432/postgres"
```

## How to Get Your Connection Strings from Supabase:

1. Go to your project in Supabase Dashboard
2. Click **Settings** → **Database**
3. Scroll to **Connection string** section
4. **Transaction mode (pooling)** → Copy this for `DATABASE_URL` and add `?pgbouncer=true&connection_limit=1`
5. **Direct connection** → Copy this for `DIRECT_URL`

## After Updating .env:

1. Stop your dev server (Ctrl+C)
2. Regenerate Prisma client:
   ```bash
   npx prisma generate
   ```
3. Restart dev server:
   ```bash
   npm run dev
   ```

## Still Having Issues?

If errors persist, clear the Next.js cache:
```bash
Remove-Item -Recurse -Force .next
npm run dev
```

#!/bin/sh
set -e

echo "🔧 Step 1: Running Better Auth migrations..."
npx @better-auth/cli migrate --config ./dist/src/lib/auth.js
echo "✅ Better Auth migrations completed!"

echo "🔧 Step 2: Running custom SQL migrations..."
# Run the init migration if posts table doesn't exist
if ! PGPASSWORD=postgres psql -h db -U postgres -d social_media -tc "SELECT 1 FROM pg_tables WHERE tablename = 'posts'" | grep -q 1; then
  echo "Running 001_init.sql migration..."
  PGPASSWORD=postgres psql -h db -U postgres -d social_media -f /app/src/db/migrations/001_init.sql
  echo "✅ Custom migrations completed!"
else
  echo "ℹ️  Custom tables already exist, skipping migration."
fi

echo "🚀 Starting application..."
exec "$@"

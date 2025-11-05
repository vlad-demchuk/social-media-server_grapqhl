# Docker Setup Guide

This guide explains how to run the application with Docker, including a local PostgreSQL database.

## Quick Start

### 1. Start Everything with Docker Compose

```bash
# Build and start both database and application
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

This will:
- Start a PostgreSQL database on port 5432
- Build and start your application on port 4000
- Automatically run Better Auth migrations using `docker-entrypoint.sh`
- Automatically run custom SQL migrations from `src/db/migrations/001_init.sql`
- Connect the app to the database

**What gets created automatically:**
- Better Auth tables: `users`, `accounts`, `sessions`, `verifications`
- Custom tables: `posts`, `comments`, `likes`, `conversations`, `conversation_participants`, `messages`, `notifications`

### 2. Access Your Application

- **GraphQL API**: http://localhost:4000/graphql
- **Auth API**: http://localhost:4000/api/auth

### 3. Stop Everything

```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (deletes database data)
docker-compose down -v
```

## Database Management

### Access the Database

```bash
# Connect to PostgreSQL CLI
docker exec -it social-media-db psql -U postgres -d social_media

# Or use any PostgreSQL client with:
# Host: localhost
# Port: 5432
# User: postgres
# Password: postgres
# Database: social_media
```

### Migrations

All migrations run automatically via `docker-entrypoint.sh` when the container starts:

**Step 1: Better Auth tables**
```bash
npx @better-auth/cli migrate --config ./dist/src/lib/auth.js
```
Creates: `users`, `accounts`, `sessions`, `verifications`

**Step 2: Custom SQL migrations**
```bash
psql -f /app/src/db/migrations/001_init.sql
```
Creates: `posts`, `comments`, `likes`, `conversations`, `conversation_participants`, `messages`, `notifications`

**Note**: Custom migrations only run if the tables don't already exist (checked by looking for the `posts` table).

### Run Seed Data

```bash
# After the containers are running and tables are created
docker exec -it social-media-app node src/db/seed.js
```

### View Database Logs

```bash
docker-compose logs db
```

## Using with External Database (Neon, etc.)

If you want to use your external Neon database instead of the local one:

1. **Edit `docker-compose.yml`** - Comment out or remove the `db` service
2. **Update app environment** - Make sure `DATABASE_URL` points to your Neon database
3. **Run only the app**:

```bash
docker-compose up app --build
```

Or use the simpler command:

```bash
docker build -t social-media-graphql .
docker run -p 4000:4000 --env-file .env social-media-graphql
```

## Development Workflow

### Rebuild After Code Changes

```bash
docker-compose up --build
```

### View Application Logs

```bash
# All services
docker-compose logs -f

# Just the app
docker-compose logs -f app

# Just the database
docker-compose logs -f db
```

### Execute Commands in Running Container

```bash
# Access app container shell
docker exec -it social-media-app /bin/sh

# Run a specific command
docker exec -it social-media-app node -e "console.log(process.env.DATABASE_URL)"

# Manually run Better Auth migration
docker exec -it social-media-app npx better-auth migrate --config ./dist/src/lib/auth.js

# Check existing tables
docker exec -it social-media-db psql -U postgres -d social_media -c "\dt"
```

## Troubleshooting

### Database Connection Issues

If you see `ECONNREFUSED` errors:

1. Check if database is healthy:
   ```bash
   docker-compose ps
   ```

2. Verify environment variables:
   ```bash
   docker exec -it social-media-app /bin/sh
   env | grep DATABASE_URL
   ```

3. Make sure `DATABASE_URL` points to `db:5432` (not `localhost:5432`)

### Reset Database

```bash
# Stop everything and delete volumes (complete reset)
docker-compose down -v

# Start fresh (Better Auth migrations will run automatically)
docker-compose up --build
```

### Better Auth Migration Issues

If Better Auth migrations fail:

1. Check the logs:
   ```bash
   docker-compose logs app
   ```

2. Verify the auth config file exists:
   ```bash
   docker exec -it social-media-app ls -la dist/src/lib/auth.js
   ```

3. Run migration manually:
   ```bash
   docker exec -it social-media-app npx better-auth migrate --config ./dist/src/lib/auth.js
   ```

### Port Already in Use

If port 4000 or 5432 is already in use:

1. Edit `docker-compose.yml`
2. Change the port mapping (e.g., `"4001:4000"` for app, `"5433:5432"` for db)

## How Migrations Work

### Automatic Migration Process

When you run `docker-compose up`, the `docker-entrypoint.sh` script executes automatically:

**1. Better Auth Migrations**
```bash
npx @better-auth/cli migrate --config ./dist/src/lib/auth.js
```
- Creates/updates: `users`, `accounts`, `sessions`, `verifications`
- The Better Auth CLI detects schema changes and only applies necessary migrations
- Safe to run multiple times (idempotent)

**2. Custom SQL Migrations**
```bash
psql -h db -U postgres -d social_media -f /app/src/db/migrations/001_init.sql
```
- Creates: `posts`, `comments`, `likes`, `conversations`, `conversation_participants`, `messages`, `notifications`
- Only runs if `posts` table doesn't exist (prevents duplicate runs)
- Includes all foreign keys, indexes, and constraints

**3. Start Application**
```bash
node dist/src/index.js
```

### Migration Files

- **`docker-entrypoint.sh`** - Orchestrates all migrations (mounted from host in docker-compose)
- **`src/db/migrations/001_init.sql`** - Custom table definitions (mounted from host)

### Adding New Migrations

To add new migrations:
1. Create a new SQL file in `src/db/migrations/`
2. Update `docker-entrypoint.sh` to run the new migration
3. Restart containers: `docker-compose down && docker-compose up --build`

## Configuration Files

- **`docker-compose.yml`** - Orchestrates database and app, mounts migration files and entrypoint
- **`docker-entrypoint.sh`** - Runs all migrations automatically on container startup (local dev only)
- **`Dockerfile`** - Builds the application image (Node 22 Alpine with postgresql-client)
- **`.dockerignore`** - Excludes files from Docker build
- **`src/db/migrations/001_init.sql`** - Custom table definitions
- **`.env`** - Environment variables (not included in image, loaded at runtime)

### Local Development vs Production

**Local Development (docker-compose):**
- `docker-entrypoint.sh` is mounted and runs migrations automatically
- Migration files are mounted from host
- Uses local PostgreSQL container

**Production (Dockerfile only):**
- No entrypoint script (clean production image)
- Migrations should be run separately (CI/CD pipeline)
- Uses external managed database (e.g., Neon)

## Production Deployment

For production, use external managed databases (like Neon) instead of the local PostgreSQL container. The local database is for development only.

```bash
# Build production image
docker build -t social-media-graphql:latest .

# Run with production environment
docker run -p 4000:4000 \
  -e DATABASE_URL="your-production-db-url" \
  -e NODE_ENV=production \
  social-media-graphql:latest
```

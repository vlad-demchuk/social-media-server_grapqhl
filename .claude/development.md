# Development Guide

## Getting Started

### Prerequisites
- Node.js >= 22
- PostgreSQL database
- npm or compatible package manager

### Installation
```bash
npm install
```

### Environment Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the following **required** variables in `.env`:
   - `DATABASE_URL` - Your Neon PostgreSQL connection string (pooled)
   - `BETTER_AUTH_SECRET` - Generate a random 32+ character secret key
   - `BETTER_AUTH_URL` - Auth endpoint URL (e.g., `http://localhost:4000/api/auth`)
   - `FRONTEND_URL` - Your frontend URL (e.g., `http://localhost:3000`)

3. **Optional**: Update additional Neon/Vercel variables if needed:
   - `DATABASE_URL_UNPOOLED` - For direct database connections
   - `POSTGRES_*` variables - For Vercel deployment
   - `NEXT_PUBLIC_STACK_*` - For Neon Auth integration
   - `PORT` - Server port (defaults to 4000)

**Note**: The project uses Neon PostgreSQL with connection pooling via pgbouncer.

### Database Setup
1. Run migrations in order from `src/db/migrations/`
2. Optional: Run seed script with `node src/db/seed.js`

## NPM Scripts

### Development
```bash
npm run dev
```
Starts development server with:
- Auto-restart on TypeScript file changes (ts-node-dev)
- GraphQL schema watching and type regeneration
- Concurrent process management

### Type Generation
```bash
npm run generate          # One-time generation
npm run generate:watch    # Watch mode for schema changes
```

### Production
```bash
npm start
```
Runs with ts-node (transpile-only mode)

## Development Workflow

### Adding a New Feature Module

1. **Create module directory**:
   ```
   src/modules/feature-name/
   ```

2. **Add repository** (`repository.ts`):
   - Database query functions
   - Use parameterized queries
   - Handle null checks with NotFoundException
   - Return typed results

3. **Add service** (`service.ts`):
   - Business logic
   - Call repository methods
   - Validation and transformations

4. **Add resolvers** (`resolvers.ts`):
   - Query/Mutation/Subscription resolvers
   - Access context for auth/db
   - Call service layer
   - Handle errors appropriately

5. **Define schema** (`typeDefs.ts`):
   - GraphQL type definitions
   - Use gql template tag
   - Export as default

6. **Create index** (`index.ts`):
   - Export resolvers and typeDefs
   - Barrel exports for clean imports

7. **Register module**:
   - Import in `src/schema.ts`
   - Add to schema composition

8. **Generate types**:
   - Run `npm run generate`
   - Import from `generated-types/`

### Database Changes

1. **Create migration** in `src/db/migrations/`:
   - Number sequentially (e.g., `012_description.sql`)
   - Include CREATE TABLE, indexes, constraints
   - Add foreign keys where appropriate

2. **Run migration** manually against database

3. **Update seed data** if needed in `src/db/seed.js`

### Common Patterns

#### Error Handling
```typescript
// Repository
if (!result.rows[0]) {
  throw new NotFoundException('Resource not found');
}

// Resolver
try {
  return await service.method();
} catch (error) {
  throw new BadRequestException('Invalid input');
}
```

#### Authentication Check
```typescript
// In resolver
if (!context.user) {
  throw new UnauthorizedException('Must be authenticated');
}
```

#### Database Query
```typescript
// Parameterized query
const result = await client.query(
  'SELECT * FROM table WHERE id = $1',
  [id]
);
```

## File References

### Key Entry Points
- `src/index.ts:1` - Main server entry
- `src/schema.ts:1` - GraphQL schema composition
- `src/context.ts:1` - Context creation
- `src/db/index.ts:1` - Database connection

### Module Examples
- User: `src/modules/user/`
- Post: `src/modules/post/`
- Comment: `src/modules/comment/`

### Configuration Files
- TypeScript: `tsconfig.json:1`
- GraphQL Codegen: `codegen.ts:1`
- Server config: `src/config/server.ts:1`
- Environment variables: `.env.example` (copy to `.env`)
- Database connection: `src/db/index.ts:1`
- Auth config: `src/lib/auth.ts:1`

## Debugging

### Check Generated Types
Located in `src/generated-types/graphql.ts` and module-specific `generated-types/`

### Database Connection
Verify connection in `src/db/index.ts`

### Server Configuration
Check `src/config/server.ts` for port and settings

### Recent Changes
Review git log:
- Recent refactoring to extract types and configs
- Added null checks for database operations
- Moved to barrel exports pattern

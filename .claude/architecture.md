# Architecture Guide

## TypeScript Configuration
- **Target**: esnext with nodenext modules
- **Strict Mode**: Full strict type checking enabled
- **Compiler Options**:
  - strictNullChecks, noImplicitAny, noImplicitReturns
  - noUnusedLocals, noUnusedParameters
  - forceConsistentCasingInFileNames

## GraphQL Architecture

### Schema Building
Located in `src/graphql/executableSchema.ts`:
- Uses `makeExecutableSchema` from `@graphql-tools/schema`
- Modular schema composition using GraphQL modules preset
- Type definitions split by feature module
- Resolvers organized by module
- Code generation via `@graphql-codegen/cli`
- All modules imported and combined into executable schema

### Context Pattern
Context creation in `src/graphql/context.ts` provides:
- **HTTP Context** (`createHttpContext`):
  - Session verification via better-auth
  - User normalization
  - PubSub instance for subscriptions
- **WebSocket Context** (`createWsContext`):
  - Connection params handling
  - Session data from client (TODO: implement secure token verification)
  - PubSub instance for real-time updates

Context includes:
- `user` - Authenticated user object
- `session` - Better-auth session
- `auth` - Auth instance
- `pubsub` - GraphQL subscriptions pub/sub

### Type Safety
- Generated types from GraphQL schemas in `src/generated-types/graphql.ts`
- Module-specific types in `modules/*/generated-types/`
- TypeScript resolvers with full type inference
- Context type defined in `src/graphql/types.ts`
- Custom exception types for error handling

## Exception Handling
Custom exceptions in `src/exeptions/`:
- `BadRequestException` - Invalid input
- `NotFoundException` - Resource not found
- `UnauthorizedException` - Auth failures

## Database Access Pattern
**Repository Layer** (e.g., `modules/*/repository.ts`):
- Raw SQL queries with pg client
- Parameterized queries for security
- Result type checking (rowCount, rows[0])
- Throws NotFoundException when appropriate

**Service Layer** (e.g., `modules/*/service.ts`):
- Business logic orchestration
- Calls repository methods
- Additional validation
- Data transformation

**Resolver Layer** (e.g., `modules/*/resolvers.ts`):
- GraphQL resolver functions
- Context access
- Calls service layer
- Returns typed responses

## Authentication Flow
- better-auth integration in `src/lib/auth.ts`
- Session management
- Context-based auth state
- Protected resolver patterns

## Development Patterns

### File Naming
- TypeScript files: camelCase
- SQL migrations: numbered with underscores
- Type definitions: `typeDefs.ts`
- Generated types: `generated-types/`

### Code Organization
1. Create feature module directory in `src/modules/`
2. Add repository (DB layer)
3. Add service (business logic)
4. Add resolvers (GraphQL layer)
5. Define typeDefs (schema)
6. Export via index.ts
7. Register in `src/graphql/executableSchema.ts`

### Type Generation
Configured in `codegen.ts`:
- Generates types from `src/graphql/typeDefs.ts` and `src/modules/**/typeDefs.ts`
- Uses `graphql-modules` preset for modular generation
- Base types in `src/generated-types/graphql.ts`
- Module-specific types in `modules/*/generated-types/module-types.ts`
- Context type imported from `src/graphql/types.ts`
- Run `npm run generate` to generate types
- Watch mode: `npm run generate:watch`

## Server Configuration
Extracted to `src/config/server.ts`:
- **Port**: From `PORT` env var (default: 4000)
- **Host**: Dynamic based on environment (0.0.0.0 in production, 127.0.0.1 locally)
- **CORS Settings**:
  - Origins: Frontend URL, localhost:3000, Apollo Studio
  - Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
  - Credentials: true (for cookies)
  - Allowed headers: Content-Type, Authorization, Apollo-Require-Preflight
- **Frontend URL**: From `FRONTEND_URL` env var

## Database Configuration
Located in `src/db/index.ts`:
- **Provider**: Neon PostgreSQL (serverless)
- **Connection**: pg Pool with connection pooling via pgbouncer
- **Connection string**: From `DATABASE_URL` env var
- **SSL**: Enabled by default (`ssl: true`)
- **Shared pool**: Single pool instance exported for all modules
- **Alternative**: `DATABASE_URL_UNPOOLED` for direct connections without pgbouncer
- **Vercel integration**: Supports `POSTGRES_*` env variables

## Authentication Configuration
Located in `src/lib/auth.ts`:
- **better-auth** setup with PostgreSQL database
- **Email/Password** authentication enabled
- **Custom table names** mapped to snake_case
- **Custom field mappings** for all models
- **Session cookies**: Secure, httpOnly, sameSite=none
- **Trusted origins**: Frontend URL + localhost + Apollo Studio
- **Number IDs**: Uses integer IDs instead of UUIDs

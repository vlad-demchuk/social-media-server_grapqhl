# Social Media GraphQL API - Project Context

## Overview
A GraphQL-based social media API built with TypeScript, Apollo Server, Express, and PostgreSQL. Implements authentication, posts, comments, likes, follows, conversations, messages, and notifications.

## Tech Stack
- **Runtime**: Node.js >=22
- **Language**: TypeScript 5.3.3 (strict mode)
- **API**: Apollo Server 5.x with GraphQL
- **Database**: PostgreSQL (via pg driver)
- **Authentication**: better-auth 1.3.8
- **Server**: Express 5.x with CORS
- **Code Generation**: GraphQL Code Generator
- **Dev Tools**: ts-node-dev, concurrently, nodemon

## Project Structure
```
src/
├── config/           # Server configuration
├── db/              # Database connection & migrations
│   ├── migrations/  # SQL migration files
│   └── seed.js      # Database seeding
├── exeptions/       # Custom exception classes
├── generated-types/ # GraphQL generated TypeScript types
├── graphql/         # GraphQL-specific files
│   ├── context.ts           # Context creation (HTTP & WebSocket)
│   ├── executableSchema.ts  # Schema builder
│   ├── graphql.d.ts         # GraphQL type declarations
│   ├── typeDefs.ts          # Root type definitions
│   └── types.ts             # GraphQL context & types
├── index.ts         # Application entry point
├── lib/             # Shared libraries (auth)
├── modules/         # Feature modules (modular architecture)
│   ├── comment/
│   ├── conversation/
│   ├── like/
│   ├── message/
│   ├── notification/
│   ├── post/
│   └── user/
└── utils/           # Helper utilities
```

## Module Architecture
Each module follows a consistent pattern:
- `index.ts` - Module exports
- `typeDefs.ts` - GraphQL type definitions
- `resolvers.ts` - GraphQL resolvers
- `service.ts` - Business logic
- `repository.ts` - Database operations
- `generated-types/` - Module-specific generated types

## Features
1. **Users** - Authentication, profiles, user management
2. **Posts** - Create, read, update, delete posts
3. **Comments** - Nested comments on posts
4. **Likes** - Like posts and comments
5. **Follows** - User follow/unfollow relationships
6. **Conversations** - Private messaging conversations
7. **Messages** - Real-time messaging
8. **Notifications** - User notifications system

## Database Schema
Migrations in `src/db/migrations/`:
- Users, Accounts, Sessions (auth)
- Posts, Comments, Likes
- Follows
- Conversations, Participants, Messages
- Verifications
- Notifications

## Environment Variables
Configured via `.env` file (not tracked in git). See `.env.example` for all variables:

### Required Variables
- `DATABASE_URL` - PostgreSQL connection string with SSL (Neon pooled connection)
- `BETTER_AUTH_SECRET` - Secret key for session encryption (32+ characters)
- `BETTER_AUTH_URL` - Auth service URL (`/api/auth` endpoint)
- `FRONTEND_URL` - Frontend application URL for CORS

### Database Variables (Neon PostgreSQL)
- `DATABASE_URL_UNPOOLED` - Direct connection without pgbouncer
- `PGHOST`, `PGUSER`, `PGDATABASE`, `PGPASSWORD` - Individual connection params
- Vercel Postgres templates: `POSTGRES_URL`, `POSTGRES_USER`, etc.

### Optional Variables
- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment mode (development/production)
- `NEXT_PUBLIC_STACK_PROJECT_ID`, `STACK_SECRET_SERVER_KEY` - Neon Auth (Next.js)

## Import Patterns
- Uses barrel exports (`index.ts` files)
- Absolute imports configured in tsconfig.json
- Generated types imported from module-specific directories
- GraphQL-related files organized in `src/graphql/` directory

## Key Files
- `src/index.ts` - Server entry with HTTP & WebSocket setup
- `src/graphql/executableSchema.ts` - Schema builder combining all modules
- `src/graphql/context.ts` - Context creation for HTTP and WebSocket connections
- `src/graphql/types.ts` - GraphQL context and shared types
- `src/config/server.ts` - Server configuration (port, CORS, etc.)
- `src/lib/auth.ts` - Better-auth configuration
- `src/db/index.ts` - PostgreSQL connection pool
- `codegen.ts` - GraphQL Code Generator configuration
- `.env.example` - Environment variables template

## WebSocket Support
- WebSocket server configured for GraphQL subscriptions
- Real-time features for messaging and notifications
- Separate context creation for HTTP and WebSocket connections
- Uses `graphql-ws` protocol

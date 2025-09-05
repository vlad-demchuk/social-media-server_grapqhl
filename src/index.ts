import express from 'express';
import http from 'http';
import cors from 'cors';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';

import { readFileSync } from 'fs';
import path from 'path';
import { gql } from 'graphql-tag';
import { resolvers } from './resolvers';

import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';

const PORT = 4000;

(async () => {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(
    cors({
      origin: 'http://localhost:3000', // Replace with your frontend's origin
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Specify allowed HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
      allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight'], // Add Apollo headers
    }),
  );

  app.use('/graphql', express.json());

  app.all('/api/auth/{*any}', toNodeHandler(auth));

  const typeDefs = gql(
    readFileSync(path.resolve(__dirname, './schema.graphql'), {
      encoding: 'utf-8',
    }),
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });

        console.log('>>>>> session in graphql:', session);

        return {
          user: session?.user || null,
          session,
          auth,
        };
      },
    }),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}/`);
})();

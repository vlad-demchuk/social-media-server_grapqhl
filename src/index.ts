import express from 'express';
import http from 'http';
import cors from 'cors';
import 'dotenv/config';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { readFileSync } from 'fs';
import path from 'path';
import { gql } from 'graphql-tag';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { resolvers } from './resolvers';

import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { auth, Session, User } from './lib/auth';

const PORT = process.env.PORT || 4000;
const HOST = process.env.PORT ? '0.0.0.0' : '127.0.0.1';

(async () => {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(
    cors({
      origin: [
        process.env.FRONTEND_URL,
        'http://localhost:3000',
        'https://studio.apollographql.com',
      ], // Replace with your frontend's origin
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

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsServerCleanup.dispose();
            },
          };
        },
      },
    ],
    introspection: true,
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });

        // Workaround for better auth defect
        const user = session?.user ? {
          ...session.user,
          id: Number(session.user.id),
        } : null;

        return {
          user,
          session: {
            ...session,
            user
          },
          auth,
        };
      },
    }),
  );

  interface ConnectionParams {
    session?: {
      data: {
        session: Session;
        user: User;
      };
    };
  }

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const wsServerCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        console.log('Handshake headers:', ctx.extra.request.headers);
        console.log('Connection params:', ctx.connectionParams);

        // TODO: Implement token verification for websockets
        // At the moment it's kinda challenge since NextJs rewrites don't work for ws/wss protocol,
        // and the server placed on another domain, that is the issue for cookie. As a possible workaround - JWT token.
        // For now just skipping this passing the session object from client. NOT SECURE!!!

        // const session = await auth.api.getSession({
        //   headers: fromNodeHeaders(ctx.extra.request.headers),
        // });

        const params = ctx.connectionParams as ConnectionParams;

        const { user, session } = params?.session?.data as { session: Session, user: User } || {};

        // Workaround for better auth defect
        const sessionUser = user ? {
          ...user,
          id: Number(user.id),
        } : null;

        return {
          user: sessionUser,
          session: {
            ...session,
            user
          },
        };
      },
      onConnect: () => {
        console.log('WS CONNECTED SUCCESSFULLY');
      },
    },
    wsServer,
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT, hostname: HOST }, resolve),
  );
  console.log(`🚀 Server ready at ${HOST}:${PORT}/`);
})();

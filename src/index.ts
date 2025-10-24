import http from 'http';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';

import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { PubSub } from 'graphql-subscriptions';

import { toNodeHandler } from 'better-auth/node';

import { auth } from './lib/auth';
import { config } from './config/server';
import { createHttpContext, createWsContext } from './graphql/context';
import { buildSchema } from './graphql/executableSchema';

(async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const pubsub = new PubSub();

  app.use(
    cors({
      origin: config.cors.origins,
      methods: config.cors.methods,
      credentials: config.cors.credentials,
      allowedHeaders: config.cors.allowedHeaders,
    }),
  );

  app.use('/graphql', express.json());

  app.all('/api/auth/{*any}', toNodeHandler(auth));

  const schema = buildSchema();

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
      context: async ({ req }) => createHttpContext(req, pubsub),
    }),
  );

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const wsServerCleanup = useServer(
    {
      schema,
      context: async (ctx) => createWsContext(ctx.connectionParams, pubsub),
      onConnect: () => {
        console.log('WS CONNECTED SUCCESSFULLY');
      },
    },
    wsServer,
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: config.port, hostname: config.host }, resolve),
  );
  console.log(`🚀 Server ready at ${config.host}:${config.port}/`);
})();

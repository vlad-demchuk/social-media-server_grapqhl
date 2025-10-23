import http from 'http';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { PubSub } from 'graphql-subscriptions';

import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';

import { auth, Session, User } from './lib/auth';
import { config } from './config/server';
import * as commentModule from './modules/comment';
import * as conversationModule from './modules/conversation';
import * as likeModule from './modules/like';
import * as messageModule from './modules/message';
import * as notificationModule from './modules/notification';
import * as postModule from './modules/post';
import * as userModule from './modules/user';
import { Resolvers } from './generated-types/graphql';
import { typeDefs } from './typeDefs';


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

  const schema = makeExecutableSchema({
    typeDefs: [
      typeDefs,
      commentModule.typeDefs,
      conversationModule.typeDefs,
      likeModule.typeDefs,
      messageModule.typeDefs,
      notificationModule.typeDefs,
      postModule.typeDefs,
      userModule.typeDefs,
    ],
    resolvers: [
      commentModule.resolvers,
      conversationModule.resolvers,
      likeModule.resolvers,
      messageModule.resolvers,
      notificationModule.resolvers,
      postModule.resolvers,
      userModule.resolvers,
    ] as Resolvers[],
  });

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
            user,
          },
          auth,
          pubsub,
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
            user,
          },
          pubsub,
        };
      },
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

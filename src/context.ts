import { auth, Session, User } from './lib/auth';
import { PubSub } from 'graphql-subscriptions';
import { fromNodeHeaders } from 'better-auth/node';
import { normalizeUser } from './utils/authHelpers';
import type { IncomingMessage } from 'http';

export type Context = {
  user: User | null,
  session: Session | null,
  auth: typeof auth,
  pubsub: PubSub
}

export interface ConnectionParams {
  session?: {
    data: {
      session: Session;
      user: User;
    };
  };
}

export const createHttpContext = async (req: IncomingMessage, pubsub: PubSub): Promise<Context> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  const user = normalizeUser(session?.user);

  return {
    user,
    session: session ? {
      ...session,
      user,
    } as unknown as Session : null,
    auth,
    pubsub,
  };
};

export const createWsContext = (connectionParams: unknown, pubsub: PubSub): Context => {
  // TODO: Implement token verification for websockets
  // At the moment it's kinda challenge since NextJs rewrites don't work for ws/wss protocol,
  // and the server placed on another domain, that is the issue for cookie. As a possible workaround - JWT token.
  // For now just skipping this passing the session object from client. NOT SECURE!!!

  const params = connectionParams as ConnectionParams;
  const { user, session } = params?.session?.data as { session: Session, user: User } || {};
  const sessionUser = normalizeUser(user);

  return {
    user: sessionUser,
    session: session ? {
      ...session,
      user: sessionUser,
    } as unknown as Session : null,
    auth,
    pubsub,
  };
};

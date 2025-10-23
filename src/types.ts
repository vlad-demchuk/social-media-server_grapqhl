import { auth, Session, User } from './lib/auth';
import { PubSub } from 'graphql-subscriptions';

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

export type { Session, User };

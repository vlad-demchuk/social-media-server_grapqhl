import { auth, Session, User } from './lib/auth';
import { PubSub } from 'graphql-subscriptions';

export type Context = {
  user: User,
  session: Session,
  auth: typeof auth,
  pubsub: PubSub
}

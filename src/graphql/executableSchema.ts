import { makeExecutableSchema } from '@graphql-tools/schema';
import { Resolvers } from '../generated-types/graphql';
import { typeDefs } from './typeDefs';

import * as commentModule from '../modules/comment';
import * as conversationModule from '../modules/conversation';
import * as likeModule from '../modules/like';
import * as messageModule from '../modules/message';
import * as notificationModule from '../modules/notification';
import * as postModule from '../modules/post';
import * as userModule from '../modules/user';

const modules = [
  commentModule,
  conversationModule,
  likeModule,
  messageModule,
  notificationModule,
  postModule,
  userModule,
];

export const buildSchema = () => {
  return makeExecutableSchema({
    typeDefs: [typeDefs, ...modules.map(m => m.typeDefs)],
    resolvers: modules.map(m => m.resolvers) as Resolvers[],
  });
};

import { NotificationModule } from './generated-types/module-types';
import { UnauthorizedException } from '../../exeptions';
import * as notificationService from './service';
import { withFilter } from 'graphql-subscriptions';
import { NotificationPayload } from '../../generated-types/graphql';
import { Context } from '../../context';

export const resolvers: NotificationModule.Resolvers = {
  Query: {
    notifications: async (_, __, context) => {
      if (!context.user) {
        throw new UnauthorizedException();
      }

      const notifications = await notificationService.getAll(context.user.id);

      return notifications;
    },
  },
  Subscription: {
    notificationAdded: {
      subscribe: withFilter<{ notificationAdded: NotificationPayload }, {}, Context>(
        (_parent, _args, context) => context.pubsub.asyncIterableIterator(
          'NOTIFICATION_ADDED'),
        async (payload, _, context) => {
          if (!payload) {
            return false;
          }

          const notificationAdded = payload.notificationAdded;

          if (!context.user.id) {
            return false;
          }

          return context.user.id !== notificationAdded.actor.id && context.user.id === notificationAdded.recipientId;
        },
      ),
    },
  },
};

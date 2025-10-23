import { NotificationModule } from './generated-types/module-types';
import * as notificationService from './service';
import { withFilter } from 'graphql-subscriptions';
import { NotificationPayload } from '../../generated-types/graphql';
import { Context } from '../../context';
import { requireAuth } from '../../utils/authHelpers';

export const resolvers: NotificationModule.Resolvers = {
  Query: {
    notifications: async (_, __, context) => {
      const user = requireAuth(context);

      const notifications = await notificationService.getAll(user.id);

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

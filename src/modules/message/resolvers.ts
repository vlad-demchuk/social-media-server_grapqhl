import { MessageModule } from './generated-types/module-types';
import * as messageService from './service';
import * as conversationService from '../conversation/service';
import { Message } from '../../generated-types/graphql';
import { withFilter } from 'graphql-subscriptions';
import { requireAuth } from '../../utils/authHelpers';
import { createSuccessResponse, createErrorResponse } from '../../utils/errorHelpers';

export const resolvers: MessageModule.Resolvers = {
  Query: {
    conversationMessages: async (_, args, context) => {
      requireAuth(context);

      const messages = await messageService.getConversationMessages(args.conversationId);

      return messages;
    },
  },
  Mutation: {
    createMessage: async (_, args, context) => {
      const user = requireAuth(context);

      try {
        const message = await messageService.create(
          {
            conversationId: args.conversationId,
            senderId: user.id,
            content: args.content,
          },
          context
        );

        return createSuccessResponse('Message successfully created!', { createdMessage: message });
      } catch (error) {
        return createErrorResponse(error, 'Failed to create message');
      }
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        (_parent, _args, context) => {
          if (!context) {
            throw new Error('Context is required for subscription');
          }
          return context.pubsub.asyncIterableIterator('MESSAGE_ADDED');
        },
        async (payload, _, context) => {
          if (!payload) {
            return false;
          }

          const messageAdded = (payload as { messageAdded: Message }).messageAdded;

          if (!context?.user?.id) {
            return false;
          }

          // if (context.user.id === messageAdded.sender.id) {
          //   return false;
          // }

          const isParticipant = await conversationService.isUserInChat(
            context?.user?.id,
            messageAdded?.conversationId,
          );

          return isParticipant;
        },
      ),
    },
  },
};

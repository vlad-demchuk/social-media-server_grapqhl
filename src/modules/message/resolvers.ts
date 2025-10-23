import { MessageModule } from './generated-types/module-types';
import * as messageService from './service';
import * as conversationService from '../conversation/service';
import { Message } from '../../generated-types/graphql';
import { withFilter } from 'graphql-subscriptions';
import { Context } from '../../context';
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
        const message = await messageService.create({
          conversationId: args.conversationId,
          senderId: user.id,
          content: args.content,
        });

        const messageAdded: Message = {
          id: message.id,
          conversationId: args.conversationId,
          content: message.content,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          sender: message.sender,
        };

        context.pubsub.publish('MESSAGE_ADDED', {
          messageAdded,
        });

        const conversation = await conversationService.getById(args.conversationId);

        context.pubsub.publish('CONVERSATIONS_UPDATED', {
          conversationsUpdated: conversation,
        });

        return createSuccessResponse('Message successfully created!', { createdMessage: message });
      } catch (error) {
        return createErrorResponse(error, 'Failed to create message');
      }
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter<{ messageAdded: Message }, {}, Context>(
        (_parent, _args, context) => context.pubsub.asyncIterableIterator(
          'MESSAGE_ADDED'),
        async (payload, _, context) => {
          if (!payload) {
            return false;
          }

          const messageAdded = payload.messageAdded;

          if (!context.user.id) {
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

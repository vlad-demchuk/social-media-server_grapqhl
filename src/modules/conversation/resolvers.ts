import * as conversationService from './service';
import { ConversationModule } from './generated-types/module-types';
import { withFilter } from 'graphql-subscriptions';
import { Conversation } from '../../generated-types/graphql';
import { Context } from '../../context';
import { requireAuth } from '../../utils/authHelpers';
import { createSuccessResponse, createErrorResponse } from '../../utils/errorHelpers';

export const resolvers: ConversationModule.Resolvers = {
  Query: {
    conversations: async (_, __, context) => {
      const user = requireAuth(context);

      const conversations = await conversationService.getAll(user.id);

      return conversations;
    },
  },
  Mutation: {
    createConversation: async (_, args, context) => {
      const user = requireAuth(context);

      try {
        let conversation = await conversationService.getDirectByUserIds(user.id, args.userId);
        let isConversationExisting = !!conversation;

        if (!isConversationExisting) {
          conversation = await conversationService.createDirect(user.id, args.userId);
          context.pubsub.publish('CONVERSATIONS_UPDATED', {
            conversationsUpdated: conversation,
          });
        }

        return createSuccessResponse(
          isConversationExisting ? 'Conversation already exists!' : 'Conversation successfully created!',
          { conversation },
        );
      } catch (error) {
        return createErrorResponse(error, 'Failed to create conversation');
      }
    },
  },
  Subscription: {
    conversationsUpdated: {
      subscribe: withFilter<{ conversationsUpdated: Conversation }, {}, Context>(
        (_parent, _args, context) => {
          return context.pubsub.asyncIterableIterator(
            'CONVERSATIONS_UPDATED');
        },
        async (payload, _, context) => {
          console.log('----------------------------------------------------');
          console.log('CONVERSATIONS_UPDATED');

          if (!payload) {
            return false;
          }

          const conversationsUpdated = payload.conversationsUpdated;

          if (!context.user.id) {
            return false;
          }

          const isParticipant = await conversationService.isUserInChat(
            context?.user?.id,
            conversationsUpdated.id,
          );

          return isParticipant;
        },
      ),
    },
  },
};

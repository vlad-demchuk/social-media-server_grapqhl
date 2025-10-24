import * as conversationService from './service';
import { ConversationModule } from './generated-types/module-types';
import { withFilter } from 'graphql-subscriptions';
import { Conversation } from '../../generated-types/graphql';
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
        const { conversation, isNew } = await conversationService.findOrCreateDirectConversation(
          user.id,
          args.userId,
          context
        );

        return createSuccessResponse(
          isNew ? 'Conversation successfully created!' : 'Conversation already exists!',
          { conversation }
        );
      } catch (error) {
        return createErrorResponse(error, 'Failed to create conversation');
      }
    },
  },
  Subscription: {
    conversationsUpdated: {
      subscribe: withFilter(
        (_parent, _args, context) => {
          if (!context) {
            throw new Error('Context is required for subscription');
          }
          return context.pubsub.asyncIterableIterator('CONVERSATIONS_UPDATED');
        },
        async (payload, _, context) => {
          console.log('----------------------------------------------------');
          console.log('CONVERSATIONS_UPDATED');

          if (!payload) {
            return false;
          }

          const conversationsUpdated = (payload as { conversationsUpdated: Conversation }).conversationsUpdated;

          if (!context?.user?.id) {
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

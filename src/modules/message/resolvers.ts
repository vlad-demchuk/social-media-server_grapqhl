import { MessageModule } from './generated-types/module-types';
import { UnauthorizedException } from '../../exeptions';
import * as messageService from './service';
import * as conversationService from '../conversation/service';
import { Message } from '../../generated-types/graphql';
import { withFilter } from 'graphql-subscriptions';
import { Context } from '../../context';

export const resolvers: MessageModule.Resolvers = {
  Query: {
    conversationMessages: async (_, args, context) => {
      if (!context.user) {
        throw new UnauthorizedException();
      }

      const messages = await messageService.getConversationMessages(args.conversationId);

      return messages;
    },
  },
  Mutation: {
    createMessage: async (_, args, context) => {
      if (!context.user) {
        throw new UnauthorizedException();
      }

      try {
        const message = await messageService.create({
          conversationId: args.conversationId,
          senderId: context.user.id,
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

        return {
          code: 200,
          success: true,
          message: 'Message successfully created!',
          createdMessage: message,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: `,
          error,
        };
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

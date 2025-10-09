import * as userService from './services/user.service';
import * as postService from './services/post.service';
import * as likeService from './services/like.service';
import * as commentService from './services/comment.service';
import * as conversationService from './services/conversation.service';
import * as messageService from './services/message.service';
import { Conversation, Message, NotificationPayload, NotificationType, Resolvers } from './types';
import { GraphQLError } from 'graphql/error';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { Context } from './context';

// TODO: handle errors

const pubsub = new PubSub();

export const resolvers: Resolvers = {
  Query: {
    // Users
    users: async (_, __, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const users = await userService.getAll();

      return users;
    },
    user: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const user = await userService.getOne(args.userId);

      return user;
    },
    searchUser: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const users = await userService.search(args.query);

      return users;
    },
    // Posts
    posts: async (_, __, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const posts = await postService.getAll(context.user.id);

      return posts;
    },
    userPosts: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const posts = await postService.getPostsByUserName(context.user.id, args.userName);

      return posts;
    },
    post: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const post = await postService.getById(context.user.id, args.postId);

      return post;
    },
    // Comments
    comments: async (_, args) => {
      const comments = await commentService.getByPostId(args.postId);

      return comments;
    },
    // Conversations
    conversations: async (_, __, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const conversations = await conversationService.getAll(context.user.id);

      return conversations;
    },
    // Messages
    conversationMessages: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const messages = await messageService.getConversationMessages(args.conversationId);

      return messages;
    },
  },
  Mutation: {
    // Posts
    createPost: async (_, args, context) => {
      try {
        const post = await postService.create({
          content: args.input.content,
          userId: Number(context.user.id),
        });

        return {
          code: 200,
          success: true,
          message: 'Post successfully created!',
          post,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong:`,
          error,
        };
      }
    },
    deletePost: async (_, args) => {
      try {
        await postService.remove(args.postId);

        return {
          code: 200,
          success: true,
          message: 'Post successfully deleted!',
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
    // Likes
    likePost: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      try {
        const post = await likeService.likePost(context.user.id, args.postId);

        const { id, image, name, emailVerified, updatedAt, createdAt, email } = context.user;

        const notificationPayload: NotificationPayload = {
          actor: {
            id,
            username: name,
            email,
            emailVerified,
            createdAt,
            updatedAt,
            image,
          },
          entityId: post.id,
          entityType: 'POST',
          preview: 'Your post was liked',
          type: NotificationType.Like,
          recipientId: post.owner.id,
        };

        await pubsub.publish('NOTIFICATION_ADDED', { notificationAdded: notificationPayload });

        return {
          code: 200,
          success: true,
          message: 'Like successfully created!',
          post,
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
    unlikePost: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      try {
        const post = await likeService.unlikePost(context.user.id, args.postId);

        return {
          code: 200,
          success: true,
          message: 'Like successfully deleted!',
          post,
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
    // Comments
    createComment: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      try {
        const comment = await commentService.create({
          content: args.input.content,
          userId: context.user.id,
          postId: args.input.postId,
        });

        const { id, image, name, emailVerified, updatedAt, createdAt, email } = context.user;

        const commentedPost = await postService.getById(context.user.id, args.input.postId);

        const notificationPayload: NotificationPayload = {
          actor: {
            id,
            username: name,
            email,
            emailVerified,
            createdAt,
            updatedAt,
            image,
          },
          entityId: comment.id,
          entityType: 'COMMENT',
          preview: 'Your post was commented',
          type: NotificationType.Comment,
          recipientId: commentedPost.owner.id,
        };

        await pubsub.publish('NOTIFICATION_ADDED', { notificationAdded: notificationPayload });

        return {
          code: 200,
          success: true,
          message: 'Comment successfully created!',
          comment,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong:`,
          error,
        };
      }
    },
    deleteComment: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      try {
        await commentService.remove(args.commentId);

        return {
          code: 200,
          success: true,
          message: 'Comment successfully deleted!',
          commentId: args.commentId,
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
    // Conversations
    createConversation: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      try {
        let conversation = await conversationService.getDirectByUserIds(context.user.id, args.userId);
        let isConversationExisting = !!conversation;

        if (!isConversationExisting) {
          conversation = await conversationService.createDirect(context.user.id, args.userId);
          pubsub.publish('CONVERSATIONS_UPDATED', {
            conversationsUpdated: conversation,
          });
        }

        return {
          code: 200,
          success: true,
          message: isConversationExisting ? 'Conversation is already existing!' : 'Conversation successfully created!',
          conversation,
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
    // Messages
    // @ts-ignore
    createMessage: async (_, args, context) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
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

        pubsub.publish('MESSAGE_ADDED', {
          messageAdded,
        });

        const conversation = await conversationService.getById(args.conversationId);

        pubsub.publish('CONVERSATIONS_UPDATED', {
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
        () => pubsub.asyncIterableIterator(
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
    notificationAdded: {
      subscribe: withFilter<{ notificationAdded: NotificationPayload }, {}, Context>(
        () => pubsub.asyncIterableIterator(
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
    conversationsUpdated: {
      subscribe: withFilter<{ conversationsUpdated: Conversation }, {}, Context>(
        () => pubsub.asyncIterableIterator(
          'CONVERSATIONS_UPDATED'),
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

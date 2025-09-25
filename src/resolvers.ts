import * as userService from './services/user.service';
import * as postService from './services/post.service';
import * as likeService from './services/like.service';
import * as commentService from './services/comment.service';
import * as conversationService from './services/conversation.service';
import * as messageService from './services/message.service';
import { ConversationParticipant, MessagePayload, NotificationPayload, NotificationType, Resolvers } from './types';
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
      console.log('>>>>> context.user.id:', context.user.id);
      console.log('>>>>> args.input.content:', args.input.content);
      try {
        const post = await postService.create({
          content: args.input.content,
          userId: Number(context.user.id),
        });

        console.log('>>>>> post:', post);

        return {
          code: 200,
          success: true,
          message: 'Post successfully created!',
          post,
        };
      } catch (error) {
        console.log('>>>>> error:', error);
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
          recipientId: post.id
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
        const conversation = await conversationService.createDirect(context.user.id, args.userId);

        return {
          code: 200,
          success: true,
          message: 'Conversation successfully created!',
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

        const { user: { id, name, image } } = context;

        const sender: ConversationParticipant = {
          id,
          username: name,
          image,
        };

        const messageAdded: MessagePayload = {
          id: message.id,
          conversationId: args.conversationId,
          content: message.content,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          sender,
        };

        pubsub.publish('MESSAGE_ADDED', {
          messageAdded,
        });

        return {
          code: 200,
          success: true,
          message: 'Conversation successfully created!',
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
      subscribe: withFilter<{ messageAdded: MessagePayload }, {}, Context>(
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

          if (context.user.id === messageAdded.sender.id) {
            return false;
          }

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

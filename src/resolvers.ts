import * as userService from './services/user.service';
import * as postService from './services/post.service';
import * as likeService from './services/like.service';
import * as commentService from './services/comment.service';
import * as conversationService from './services/conversation.service';
import * as messageService from './services/message.service';
import { ConversationParticipant, Resolvers } from './types';
import { GraphQLError } from 'graphql/error';
import { PubSub } from 'graphql-subscriptions';

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
          postId: args.postId,
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
        const conversationId = await conversationService.createDirect(context.user.id, args.userId);

        return {
          code: 200,
          success: true,
          message: 'Conversation successfully created!',
          conversationId,
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


        const sender: ConversationParticipant = {
          id: context.user.id,
          username: context.user.name,
          image: context.user.image
        }

        pubsub.publish('MESSAGE_ADDED', {
          messageAdded: { ...message, sender },
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
      subscribe: () => {
        console.log('SUBSCRIBED ON MESSAGE_ADDED');
        return pubsub.asyncIterableIterator('MESSAGE_ADDED');
      } ,
    },
  }
};

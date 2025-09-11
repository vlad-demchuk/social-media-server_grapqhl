import * as postService from './services/post.service';
import * as likeService from './services/like.service';
import * as commentService from './services/comment.service';
import { Resolvers } from './types';
import { GraphQLError } from 'graphql/error';

// TODO: get user from context
// TODO: handle errors

export const resolvers: Resolvers = {
  Query: {
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
    deleteComment: async (_, args) => {
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
  },
};

import * as postService from './services/post.service';
import * as likeService from './services/like.service';
import * as commentService from './services/comment.service';
import { Resolvers } from './types';

// TODO: get user from context
// TODO: handle errors

const currentUserId = 1;

export const resolvers: Resolvers = {
  Query: {
    // Posts
    posts: async () => {
      const posts = await postService.getAll(currentUserId);

      return posts;
    },
    // Comments
    comments: async (_, args) => {
      const comments = await commentService.getByPostId(args.postId);

      return comments;
    },
  },
  Mutation: {
    // Posts
    createPost: async (_, args) => {
      try {
        const post = await postService.create({
          content: args.input.content,
          userId: currentUserId,
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
          error
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
          error
        };
      }
    },
    // Likes
    likePost: async (_, args) => {
      try {
        const post = await likeService.likePost(currentUserId, args.postId);

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
          error
        };
      }
    },
    unlikePost: async (_, args) => {
      try {
        const post = await likeService.unlikePost(currentUserId, args.postId);

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
          error
        };
      }
    },
    // Comments
    createComment: async (_, args) => {
      try {
        const comment = await commentService.create({
          content: args.input.content,
          userId: 1,
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
          error
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
          error
        };
      }
    },
  },
};

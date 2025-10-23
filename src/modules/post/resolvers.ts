import { PostModule } from './generated-types/module-types';
import * as postService from './service';
import { requireAuth } from '../../utils/authHelpers';

export const resolvers: PostModule.Resolvers = {
  Query: {
    posts: async (_, __, context) => {
      const user = requireAuth(context);

      const posts = await postService.getAll(user.id);

      return posts;
    },
    userPosts: async (_, args, context) => {
      const user = requireAuth(context);

      const posts = await postService.getPostsByUserName(user.id, args.userName);

      return posts;
    },
    post: async (_, args, context) => {
      const user = requireAuth(context);

      const post = await postService.getById(user.id, args.postId);

      return post;
    },
  },
  Mutation: {
    createPost: async (_, args, context) => {
      const user = requireAuth(context);

      try {
        const post = await postService.create({
          content: args.input.content,
          userId: Number(user.id),
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
    deletePost: async (_, args, context) => {
      requireAuth(context);

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
  },
};

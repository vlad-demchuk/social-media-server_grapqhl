import { PostModule } from './generated-types/module-types';
import { UnauthorizedException } from '../../exeptions';
import * as postService from './service';

export const resolvers: PostModule.Resolvers = {
  Query: {
    posts: async (_, __, context) => {
      if (!context.user) {
        throw new UnauthorizedException();
      }

      const posts = await postService.getAll(context.user.id);

      return posts;
    },
    userPosts: async (_, args, context) => {
      if (!context.user) {
        throw new UnauthorizedException();
      }

      const posts = await postService.getPostsByUserName(context.user.id, args.userName);

      return posts;
    },
    post: async (_, args, context) => {
      if (!context.user) {
        throw new UnauthorizedException();
      }

      const post = await postService.getById(context.user.id, args.postId);

      return post;
    },
  },
  Mutation: {
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
  },
};

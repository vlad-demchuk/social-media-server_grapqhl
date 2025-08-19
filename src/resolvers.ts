import * as postService from "./services/post.service.js";
import * as likeService from "./services/like.service.js";
import { Resolvers } from "./types.js";

export const resolvers: Resolvers = {
  Query: {
    posts: async () => {
      const posts = await postService.getAll();

      return posts;
    },
  },
  Mutation: {
    createPost: async (_, args) => {
      try {
        const post = await postService.create({
          content: args.input.content,
          userId: 1,
        });

        return {
          code: 200,
          success: true,
          message: "Post successfully created!",
          post,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${error.extensions.response.body}`,
        };
      }
    },
    deletePost: async (_, args) => {
      try {
        await postService.remove(args.postId)

        return {
          code: 200,
          success: true,
          message: "Post successfully deleted!",
          postId: args.postId,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${error.extensions.response.body}`,
        };
      }
    },
    likePost: async (_, args) => {
      try {
        const post = await likeService.likePost(1, args.postId);
        
        return {
          code: 200,
          success: true,
          message: "Like successfully created!",
          post,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${error.extensions.response.body}`,
        };
      }
    },
    unlikePost: async (_, args) => {
      try {
        const post = await likeService.unlikePost(1, args.postId);
        
        return {
          code: 200,
          success: true,
          message: "Like successfully deleted!",
          post,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${error.extensions.response.body}`,
        };
      }
    },
  },
};

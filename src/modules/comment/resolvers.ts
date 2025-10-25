import * as commentService from './service';
import { CommentModule } from './generated-types/module-types';
import { requireAuth } from '../../utils/authHelpers';
import { createSuccessResponse, createErrorResponse } from '../../utils/errorHelpers';

export const resolvers: CommentModule.Resolvers = {
  Query: {
    comments: async (_, args) => {
      const comments = await commentService.getByPostId(args.postId);

      return comments;
    },
  },
  Mutation: {
    createComment: async (_, args, context) => {
      const user = requireAuth(context);

      try {
        const comment = await commentService.create(
          {
            content: args.input.content,
            userId: user.id,
            postId: args.input.postId,
          },
          context,
        );

        return createSuccessResponse('Comment successfully created!', { comment });
      } catch (error) {
        return createErrorResponse(error, 'Failed to create comment');
      }
    },
    deleteComment: async (_, args, context) => {
      requireAuth(context);

      try {
        await commentService.remove(args.commentId);

        return createSuccessResponse('Comment successfully deleted!', { commentId: args.commentId });
      } catch (error) {
        return createErrorResponse(error, 'Failed to delete comment');
      }
    },
  },
};

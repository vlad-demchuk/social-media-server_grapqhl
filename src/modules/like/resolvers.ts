import * as likeService from './service';
import { LikeModule } from './generated-types/module-types';
import { requireAuth } from '../../utils/authHelpers';
import { createSuccessResponse, createErrorResponse } from '../../utils/errorHelpers';

export const resolvers: LikeModule.Resolvers = {
  Mutation: {
    likePost: async (_, args, context) => {
      const user = requireAuth(context);

      try {
        const post = await likeService.likePost(user.id, args.postId, context, user);

        return createSuccessResponse('Like successfully created!', { post });
      } catch (error) {
        return createErrorResponse(error, 'Failed to create like');
      }
    },
    unlikePost: async (_, args, context) => {
      const user = requireAuth(context);

      try {
        const post = await likeService.unlikePost(user.id, args.postId);

        return createSuccessResponse('Like successfully deleted!', { post });
      } catch (error) {
        return createErrorResponse(error, 'Failed to delete like');
      }
    },
  },
};

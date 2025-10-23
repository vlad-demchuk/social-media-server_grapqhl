import * as likeService from './service';
import { NotificationPayload } from '../../generated-types/graphql';
import { LikeModule } from './generated-types/module-types';
import { requireAuth } from '../../utils/authHelpers';

export const resolvers: LikeModule.Resolvers = {
  Mutation: {
    likePost: async (_, args, context) => {
      const user = requireAuth(context);

      try {
        const post = await likeService.likePost(user.id, args.postId);

        const { id, image, name, emailVerified, updatedAt, createdAt, email } = user;

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
          type: 'LIKE',
          recipientId: post.owner.id,
        };

        await context.pubsub.publish('NOTIFICATION_ADDED', { notificationAdded: notificationPayload });

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
      const user = requireAuth(context);

      try {
        const post = await likeService.unlikePost(user.id, args.postId);

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
  },
};

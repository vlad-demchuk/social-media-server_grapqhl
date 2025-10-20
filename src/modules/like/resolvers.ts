import { GraphQLError } from 'graphql/error';
import * as likeService from './service';
import { NotificationPayload } from '../../generated-types/graphql';
import { LikeModule } from './generated-types/module-types';

export const resolvers: LikeModule.Resolvers = {
  Mutation: {
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
  }
}

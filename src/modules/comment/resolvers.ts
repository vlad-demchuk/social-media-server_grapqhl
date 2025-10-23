import * as commentService from './service';
import * as postService from '../post/service';
import { CommentModule } from './generated-types/module-types';
import { NotificationPayload } from '../../generated-types/graphql';
import { requireAuth } from '../../utils/authHelpers';

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
        const comment = await commentService.create({
          content: args.input.content,
          userId: user.id,
          postId: args.input.postId,
        });

        const { id, image, name, emailVerified, updatedAt, createdAt, email } = user;

        const commentedPost = await postService.getById(user.id, args.input.postId);

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
          entityId: comment.id,
          entityType: 'COMMENT',
          preview: 'Your post was commented',
          type: 'COMMENT',
          recipientId: commentedPost.owner.id,
        };

        await context.pubsub.publish('NOTIFICATION_ADDED', { notificationAdded: notificationPayload });

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
      requireAuth(context);

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

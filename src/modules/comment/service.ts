import { Comment, CreateCommentInput } from '../../generated-types/graphql';
import * as commentRepository from './repository';
import * as postService from '../post/service';
import { Context, User } from '../../graphql/types';
import { createNotificationPayload, shouldSendNotification, publishNotification } from '../../utils/notificationHelpers';

export const getByPostId = async (postId: number) => {
  return commentRepository.findByPostId(postId);
};

export const create = async (
  {
    content,
    userId,
    postId,
  }: CreateCommentInput & { userId: number },
  context: Context,
  user: User
): Promise<Comment> => {
  const comment = await commentRepository.insert({ content, userId, postId });

  // Handle notification logic
  const commentedPost = await postService.getById(userId, postId);

  if (shouldSendNotification(userId, commentedPost.owner.id)) {
    const notificationPayload = createNotificationPayload(
      user,
      comment.id,
      'COMMENT',
      'Your post was commented',
      'COMMENT',
      commentedPost.owner.id,
    );

    await publishNotification(context, notificationPayload);
  }

  return comment;
};

export const remove = async (id: number) => {
  return commentRepository.deleteById(id);
};




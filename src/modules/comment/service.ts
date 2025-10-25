import { Comment, CreateCommentInput } from '../../generated-types/graphql';
import * as commentRepository from './repository';
import * as postService from '../post/service';
import { Context } from '../../graphql/types';
import { shouldSendNotification, publishNotification } from '../../utils/notificationHelpers';
import * as notificationService from '../notification/service';

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
): Promise<Comment> => {
  const comment = await commentRepository.insert({ content, userId, postId });

  // Handle notification logic
  const commentedPost = await postService.getById(userId, postId);

  if (shouldSendNotification(userId, commentedPost.owner.id)) {
    const notificationPayload = await notificationService.create({
      recipientId: commentedPost.owner.id,
      actorId: userId,
      type: 'COMMENT',
      entityId: commentedPost.id,
      entityType: 'POST',
      preview: content,
    });

    await publishNotification(context, notificationPayload);
  }

  return comment;
};

export const remove = async (id: number) => {
  return commentRepository.deleteById(id);
};

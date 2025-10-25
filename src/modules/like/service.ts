import { getById as getPostById } from '../post/service';
import { Post } from '../../generated-types/graphql';
import * as likeRepository from './repository';
import { Context, User } from '../../graphql/types';
import {
  createNotificationPayload,
  publishNotification,
  shouldSendNotification,
} from '../../utils/notificationHelpers';
import * as notificationService from '../notification/service';

export const likePost = async (
  userId: number,
  postId: number,
  context: Context,
  user: User,
): Promise<Post> => {
  await likeRepository.insert(userId, postId);

  const post = await getPostById(userId, postId);

  if (shouldSendNotification(userId, post.owner.id)) {
    const notificationPayload = createNotificationPayload(
      user,
      post.id,
      'POST',
      'Your post was liked',
      'LIKE',
      post.owner.id,
    );

    await notificationService.create({
      recipientId: post.owner.id,
      actorId: userId,
      type: 'LIKE',
      entityId: post.id,
      entityType: 'POST',
      preview: 'Your post was liked',
    });

    await publishNotification(context, notificationPayload);
  }

  return post;
};

export const unlikePost = async (userId: number, postId: number): Promise<Post> => {
  await likeRepository.deleteByUserAndPost(userId, postId);

  const post = await getPostById(userId, postId);

  return post;
};

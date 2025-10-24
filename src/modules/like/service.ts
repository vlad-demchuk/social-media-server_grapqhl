import { getById as getPostById } from '../post/service';
import { Post } from '../../generated-types/graphql';
import * as likeRepository from './repository';
import { Context, User } from '../../graphql/types';
import { createNotificationPayload, shouldSendNotification, publishNotification } from '../../utils/notificationHelpers';

export const likePost = async (
  userId: number,
  postId: number,
  context: Context,
  user: User
): Promise<Post> => {
  await likeRepository.insert(userId, postId);

  const post = await getPostById(userId, postId);

  // Handle notification logic
  if (shouldSendNotification(userId, post.owner.id)) {
    const notificationPayload = createNotificationPayload(
      user,
      post.id,
      'POST',
      'Your post was liked',
      'LIKE',
      post.owner.id,
    );

    await publishNotification(context, notificationPayload);
  }

  return post;
};

export const unlikePost = async (userId: number, postId: number): Promise<Post> => {
  await likeRepository.deleteByUserAndPost(userId, postId);

  const post = await getPostById(userId, postId);

  return post;
};

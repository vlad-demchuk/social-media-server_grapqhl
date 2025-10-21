import { getById as getPostById } from '../post/service';
import { Post } from '../../generated-types/graphql';
import * as likeRepository from './repository';

export const likePost = async (userId: number, postId: number): Promise<Post> => {
  await likeRepository.insert(userId, postId);

  const post = await getPostById(userId, postId);

  return post;
};

export const unlikePost = async (userId: number, postId: number): Promise<Post> => {
  await likeRepository.deleteByUserAndPost(userId, postId);

  const post = await getPostById(userId, postId);

  return post;
};

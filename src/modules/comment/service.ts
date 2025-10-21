import { Comment, CreateCommentInput } from '../../generated-types/graphql';
import * as commentRepository from './repository';

export const getByPostId = async (postId: number) => {
  return commentRepository.findByPostId(postId);
};

export const create = async ({
  content,
  userId,
  postId,
}: CreateCommentInput & { userId: number }): Promise<Comment> => {
  return commentRepository.insert({ content, userId, postId });
};

export const remove = async (id: number) => {
  return commentRepository.deleteById(id);
};




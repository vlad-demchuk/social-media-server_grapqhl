import { CreatePostInput, Post } from '../../generated-types/graphql';
import * as postRepository from './repository';
import { NotFoundException } from '../../exeptions/NotFoundException';

export const getAll = async (currentUserId: number) => {
  return postRepository.findAll(currentUserId);
};

export const getPostsByUserName = async (currentUserId: number, userName: string) => {
  return postRepository.findByUserName(currentUserId, userName);
};

export const getById = async (userId: number, postId: number): Promise<Post> => {
  const post = await postRepository.findById(userId, postId);
  
  if (!post) {
    throw new NotFoundException('Post not found');
  }
  
  return post;
};

export const create = async ({
  content,
  userId,
}: CreatePostInput & { userId: number }) => {
  const row = await postRepository.insert({ content, userId });

  return {
    id: row.id,
    content: row.content,
    createdAt: row.createdAt,
    owner: row.owner,
    likesCount: 0,
    commentsCount: 0,
    isLiked: false,
  };
};

export const remove = async (id: number) => {
  return postRepository.deleteById(id);
};

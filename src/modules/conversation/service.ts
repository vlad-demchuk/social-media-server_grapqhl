import { Conversation } from '../../generated-types/graphql';
import * as conversationRepository from './repository';
import { Context } from '../../graphql/types';

// TODO: Implement pagination/infinite scrolling

export const getAll = async (currentUserId: number) => {
  return conversationRepository.findAll(currentUserId);
};

export const getDirectByUserIds = async (currentUserId: number, secondUserId: number): Promise<Conversation | null> => {
  const existing = await conversationRepository.findDirectByUserIds(currentUserId, secondUserId);

  if (existing) {
    return await getById(existing.id);
  } else {
    return null;
  }
};

export const getById = async (conversationId: number) => {
  return conversationRepository.findById(conversationId);
};

export const createDirect = async (currentUserId: number, secondUserId: number): Promise<Conversation> => {
  return conversationRepository.insertDirect(currentUserId, secondUserId);
};

export const isUserInChat = async (userId: number, conversationId: number) => {
  return conversationRepository.checkUserInChat(userId, conversationId);
};

export const findOrCreateDirectConversation = async (
  currentUserId: number,
  secondUserId: number,
  context: Context
): Promise<{ conversation: Conversation; isNew: boolean }> => {
  let conversation = await getDirectByUserIds(currentUserId, secondUserId);
  let isNew = false;

  if (!conversation) {
    conversation = await createDirect(currentUserId, secondUserId);
    isNew = true;

    // Publish to subscribers
    context.pubsub.publish('CONVERSATIONS_UPDATED', {
      conversationsUpdated: conversation,
    });
  }

  return { conversation, isNew };
};

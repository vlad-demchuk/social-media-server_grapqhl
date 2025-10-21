import { Message } from '../../generated-types/graphql';
import * as messageRepository from './repository';

export const getConversationMessages = async (conversationId: number) => {
  return messageRepository.findByConversationId(conversationId);
};

export const create = async ({
  conversationId,
  senderId,
  content,
}: {
  conversationId: number;
  senderId: number;
  content: string;
}): Promise<Message> => {
  return messageRepository.insert({ conversationId, senderId, content });
};


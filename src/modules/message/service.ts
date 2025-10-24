import { Message } from '../../generated-types/graphql';
import * as messageRepository from './repository';
import * as conversationRepository from '../conversation/repository';
import { Context } from '../../graphql/types';

export const getConversationMessages = async (conversationId: number) => {
  return messageRepository.findByConversationId(conversationId);
};

export const create = async (
  {
    conversationId,
    senderId,
    content,
  }: {
    conversationId: number;
    senderId: number;
    content: string;
  },
  context: Context
): Promise<Message> => {
  const message = await messageRepository.insert({ conversationId, senderId, content });

  // Publish message to subscribers
  const messageAdded: Message = {
    id: message.id,
    conversationId,
    content: message.content,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    sender: message.sender,
  };

  context.pubsub.publish('MESSAGE_ADDED', { messageAdded });

  // Update conversation and notify
  const conversation = await conversationRepository.findById(conversationId);
  context.pubsub.publish('CONVERSATIONS_UPDATED', {
    conversationsUpdated: conversation,
  });

  return message;
};


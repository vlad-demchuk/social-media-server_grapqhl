import * as notificationRepository from './repository';

export const getAll = async (recipientId: number) => {
  return notificationRepository.findAll(recipientId);
};

export const create = async ({
  recipientId,
  actorId,
  type,
  entityId,
  entityType,
  preview,
}: {
  recipientId: number;
  actorId: number;
  type: 'LIKE' | 'COMMENT' | 'MESSAGE';
  entityId: number;
  entityType: 'POST' | 'COMMENT' | 'MESSAGE';
  preview?: string;
}) => {
  return notificationRepository.insert({
    recipientId,
    actorId,
    type,
    entityId,
    entityType,
    preview,
  });
};

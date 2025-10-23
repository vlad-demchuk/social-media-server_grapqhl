import { NotificationPayload } from '../generated-types/graphql';
import { User } from '../lib/auth';
import { Context } from '../context';

export const createNotificationPayload = (
  user: User,
  entityId: number,
  entityType: 'POST' | 'COMMENT',
  preview: string,
  type: 'LIKE' | 'COMMENT',
  recipientId: number,
): NotificationPayload => {
  const { id, image, name, emailVerified, updatedAt, createdAt, email } = user;

  return {
    actor: {
      id,
      username: name,
      email,
      emailVerified,
      createdAt,
      updatedAt,
      image,
    },
    entityId,
    entityType,
    preview,
    type,
    recipientId,
  };
};

export const shouldSendNotification = (actorId: number, recipientId: number): boolean => {
  return actorId !== recipientId;
};

export const publishNotification = async (
  context: Context,
  notificationPayload: NotificationPayload,
): Promise<void> => {
  await context.pubsub.publish('NOTIFICATION_ADDED', { notificationAdded: notificationPayload });
};

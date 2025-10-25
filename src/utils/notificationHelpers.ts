import { Notification } from '../generated-types/graphql';
import { Context } from '../graphql/types';

export const shouldSendNotification = (actorId: number, recipientId: number): boolean => {
  return actorId !== recipientId;
};

export const publishNotification = async (
  context: Context,
  notificationPayload: Notification,
): Promise<void> => {
  await context.pubsub.publish('NOTIFICATION_ADDED', { notificationAdded: notificationPayload });
};

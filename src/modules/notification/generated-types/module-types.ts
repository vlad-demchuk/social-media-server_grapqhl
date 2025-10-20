import * as Types from "../../../generated-types/graphql";
export namespace NotificationModule {
  interface DefinedFields {
    Notification: 'id' | 'recipientId' | 'actor' | 'type' | 'entityId' | 'entityType' | 'preview' | 'read' | 'createdAt';
    NotificationPayload: 'recipientId' | 'actor' | 'type' | 'entityId' | 'entityType' | 'preview';
    Query: 'notifications';
    Subscription: 'notificationAdded';
  };
  
  interface DefinedEnumValues {
    NotificationType: 'LIKE' | 'COMMENT';
  };
  
  export type NotificationType = DefinedEnumValues['NotificationType'];
  export type Notification = Pick<Types.Notification, DefinedFields['Notification']>;
  export type User = Types.User;
  export type NotificationPayload = Pick<Types.NotificationPayload, DefinedFields['NotificationPayload']>;
  export type Query = Pick<Types.Query, DefinedFields['Query']>;
  export type Subscription = Pick<Types.Subscription, DefinedFields['Subscription']>;
  
  export type NotificationResolvers = Pick<Types.NotificationResolvers, DefinedFields['Notification']>;
  export type NotificationPayloadResolvers = Pick<Types.NotificationPayloadResolvers, DefinedFields['NotificationPayload']>;
  export type QueryResolvers = Pick<Types.QueryResolvers, DefinedFields['Query']>;
  export type SubscriptionResolvers = Pick<Types.SubscriptionResolvers, DefinedFields['Subscription']>;
  
  export interface Resolvers {
    Notification?: NotificationResolvers;
    NotificationPayload?: NotificationPayloadResolvers;
    Query?: QueryResolvers;
    Subscription?: SubscriptionResolvers;
  };
}
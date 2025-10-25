import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum NotificationType { LIKE COMMENT }

  type Notification {
    id: Int!
    recipientId: Int!
    actor: User!
    type: NotificationType!
    entityId: Int!
    entityType: String!
    preview: String
    read: Boolean!
    createdAt: DateTime!
  }

  extend type Query {
    "List all notifications"
    notifications: [Notification!]!
  }

  extend type Subscription {
    notificationAdded: Notification!
  }
`;

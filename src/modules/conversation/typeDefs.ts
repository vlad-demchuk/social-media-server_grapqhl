import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type ConversationParticipant {
    id: Int!
    username: String!
    image: String
  }

  type Conversation {
    id: Int!
    type: String!
    name: String
    createdAt: DateTime!
    participants: [User!]!
    lastMessage: Message
    creator: User!
  }

  type CreateConversationResponse {
    "HTTP-like status code"
    code: Int!
    "Indicates whether the operation succeeded"
    success: Boolean!
    "Human-readable status message"
    message: String!
    "The created conversation id, if successful"
    conversation: Conversation
  }

  extend type Query {
    "List all user conversations"
    conversations: [Conversation!]!
  }

  extend type Mutation {
    "Create a new conversation"
    createConversation(userId: Int!): CreateConversationResponse!
  }

  extend type Subscription {
    conversationsUpdated: Conversation!
  }
`;

import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Message {
    id: Int!
    content: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    sender: User!
    conversationId: Int!
  }

  type CreateMessageResponse {
    "HTTP-like status code"
    code: Int!
    "Indicates whether the operation succeeded"
    success: Boolean!
    "Human-readable status message"
    message: String!
    "The created message, if successful"
    createdMessage: Message
  }

  extend type Query {
    "List all conversation messages"
    conversationMessages(conversationId: Int!): [Message!]!
  }

  extend type Mutation {
    "Create a new conversation message"
    createMessage(conversationId: Int!, content: String!): CreateMessageResponse!
  }
  
  extend type Subscription {
      messageAdded: Message!
  }
`;

import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    "Unique user identifier"
    id: Int!
    "User username"
    username: String!
    "User email"
    email: String!
    "Creation timestamp"
    createdAt: DateTime!
    "Whether the current user verified the email"
    emailVerified: Boolean!
    "User avatar link"
    image: String
    "Timestamp of the last updated"
    updatedAt: DateTime!
  }

  extend type Query {
    "List all users"
    users: [User!]!
    "Single user"
    user(userId: Int!): User!
    "Search user by username or email"
    searchUser(query: String!): [User!]!
  }
`;

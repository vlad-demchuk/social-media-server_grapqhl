import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Comment {
    "Unique comment identifier"
    id: Int!
    "Text content of the comment"
    content: String!
    "Creation timestamp"
    createdAt: DateTime!
    "Comment author"
    author: User!
  }

  input CreateCommentInput {
    "Identifier of the post to comment on"
    postId: Int!
    "Text body of the comment"
    content: String!
  }

  type CreateCommentResponse {
    "HTTP-like status code"
    code: Int!
    "Indicates whether the operation succeeded"
    success: Boolean!
    "Human-readable status message"
    message: String!
    "The created comment, if successful"
    comment: Comment
  }

  type DeleteCommentResponse {
    "HTTP-like status code"
    code: Int!
    "Indicates whether the operation succeeded"
    success: Boolean!
    "Human-readable status message"
    message: String!
    "Identifier of the deleted comment"
    commentId: Int
  }

  extend type Query {
    "List comments for a specific post"
    comments(postId: Int!): [Comment!]!
  }

  extend type Mutation {
    "Create a new comment on a post"
    createComment(input: CreateCommentInput!): CreateCommentResponse!
    "Delete a comment by its identifier"
    deleteComment(commentId: Int!): DeleteCommentResponse!
  }
`;

import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type LikePostResponse {
    "HTTP-like status code"
    code: Int!
    "Indicates whether the operation succeeded"
    success: Boolean!
    "Human-readable status message"
    message: String!
    "Post with updated like counts"
    post: Post
  }

  extend type Mutation {
    "Add a like to a post"
    likePost(postId: Int!): LikePostResponse!
    "Remove a like from a post"
    unlikePost(postId: Int!): LikePostResponse!
  }
`;

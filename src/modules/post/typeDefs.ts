import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Post {
    "Unique post identifier"
    id: Int!
    "Text content of the post"
    content: String!
    "Creation timestamp"
    createdAt: DateTime!
    "Author's username"
    owner: User!
    "Number of likes on this post"
    likesCount: Int!
    "Number of comments on this post"
    commentsCount: Int!
    "Whether the current user liked this post"
    isLiked: Boolean!
  }

  input CreatePostInput {
    "Text body for the new post"
    content: String!
  }

  type CreatePostResponse {
    "HTTP-like status code"
    code: Int!
    "Indicates whether the operation succeeded"
    success: Boolean!
    "Human-readable status message"
    message: String!
    "The created post, if successful"
    post: Post
  }

  type DeletePostResponse {
    "HTTP-like status code"
    code: Int!
    "Indicates whether the operation succeeded"
    success: Boolean!
    "Human-readable status message"
    message: String!
  }

  extend type Query {
    "List all posts"
    posts: [Post!]!
    "List user posts"
    userPosts(userName: String!): [Post!]!
    "Single post"
    post(postId: Int!): Post!
  }

  extend type Mutation {
    "Create a new post"
    createPost(input: CreatePostInput!): CreatePostResponse!
    "Delete a post by its identifier"
    deletePost(postId: Int!): DeletePostResponse!
  }
`;

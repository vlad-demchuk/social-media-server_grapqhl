import * as Types from "../../../generated-types/graphql";
import * as gm from "graphql-modules";
export namespace PostModule {
  interface DefinedFields {
    Post: 'id' | 'content' | 'createdAt' | 'owner' | 'likesCount' | 'commentsCount' | 'isLiked';
    CreatePostResponse: 'code' | 'success' | 'message' | 'post';
    DeletePostResponse: 'code' | 'success' | 'message';
    Query: 'posts' | 'userPosts' | 'post';
    Mutation: 'createPost' | 'deletePost';
  };
  
  interface DefinedInputFields {
    CreatePostInput: 'content';
  };
  
  export type Post = Pick<Types.Post, DefinedFields['Post']>;
  export type DateTime = Types.DateTime;
  export type User = Types.User;
  export type CreatePostInput = Pick<Types.CreatePostInput, DefinedInputFields['CreatePostInput']>;
  export type CreatePostResponse = Pick<Types.CreatePostResponse, DefinedFields['CreatePostResponse']>;
  export type DeletePostResponse = Pick<Types.DeletePostResponse, DefinedFields['DeletePostResponse']>;
  export type Query = Pick<Types.Query, DefinedFields['Query']>;
  export type Mutation = Pick<Types.Mutation, DefinedFields['Mutation']>;
  
  export type PostResolvers = Pick<Types.PostResolvers, DefinedFields['Post']>;
  export type CreatePostResponseResolvers = Pick<Types.CreatePostResponseResolvers, DefinedFields['CreatePostResponse']>;
  export type DeletePostResponseResolvers = Pick<Types.DeletePostResponseResolvers, DefinedFields['DeletePostResponse']>;
  export type QueryResolvers = Pick<Types.QueryResolvers, DefinedFields['Query']>;
  export type MutationResolvers = Pick<Types.MutationResolvers, DefinedFields['Mutation']>;
  
  export interface Resolvers {
    Post?: PostResolvers;
    CreatePostResponse?: CreatePostResponseResolvers;
    DeletePostResponse?: DeletePostResponseResolvers;
    Query?: QueryResolvers;
    Mutation?: MutationResolvers;
  };
  
  export interface MiddlewareMap {
    '*'?: {
      '*'?: gm.Middleware[];
    };
    Post?: {
      '*'?: gm.Middleware[];
      id?: gm.Middleware[];
      content?: gm.Middleware[];
      createdAt?: gm.Middleware[];
      owner?: gm.Middleware[];
      likesCount?: gm.Middleware[];
      commentsCount?: gm.Middleware[];
      isLiked?: gm.Middleware[];
    };
    CreatePostResponse?: {
      '*'?: gm.Middleware[];
      code?: gm.Middleware[];
      success?: gm.Middleware[];
      message?: gm.Middleware[];
      post?: gm.Middleware[];
    };
    DeletePostResponse?: {
      '*'?: gm.Middleware[];
      code?: gm.Middleware[];
      success?: gm.Middleware[];
      message?: gm.Middleware[];
    };
    Query?: {
      '*'?: gm.Middleware[];
      posts?: gm.Middleware[];
      userPosts?: gm.Middleware[];
      post?: gm.Middleware[];
    };
    Mutation?: {
      '*'?: gm.Middleware[];
      createPost?: gm.Middleware[];
      deletePost?: gm.Middleware[];
    };
  };
}
import * as Types from "../../../generated-types/graphql";
import * as gm from "graphql-modules";
export namespace LikeModule {
  interface DefinedFields {
    LikePostResponse: 'code' | 'success' | 'message' | 'post';
    Mutation: 'likePost' | 'unlikePost';
  };
  
  export type LikePostResponse = Pick<Types.LikePostResponse, DefinedFields['LikePostResponse']>;
  export type Post = Types.Post;
  export type Mutation = Pick<Types.Mutation, DefinedFields['Mutation']>;
  
  export type LikePostResponseResolvers = Pick<Types.LikePostResponseResolvers, DefinedFields['LikePostResponse']>;
  export type MutationResolvers = Pick<Types.MutationResolvers, DefinedFields['Mutation']>;
  
  export interface Resolvers {
    LikePostResponse?: LikePostResponseResolvers;
    Mutation?: MutationResolvers;
  };
  
  export interface MiddlewareMap {
    '*'?: {
      '*'?: gm.Middleware[];
    };
    LikePostResponse?: {
      '*'?: gm.Middleware[];
      code?: gm.Middleware[];
      success?: gm.Middleware[];
      message?: gm.Middleware[];
      post?: gm.Middleware[];
    };
    Mutation?: {
      '*'?: gm.Middleware[];
      likePost?: gm.Middleware[];
      unlikePost?: gm.Middleware[];
    };
  };
}
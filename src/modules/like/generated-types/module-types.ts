import * as Types from "../../../generated-types/graphql";
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
}
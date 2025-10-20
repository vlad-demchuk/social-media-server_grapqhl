import * as Types from "../../../generated-types/graphql";
import * as gm from "graphql-modules";
export namespace CommentModule {
  interface DefinedFields {
    Comment: 'id' | 'content' | 'createdAt' | 'author';
    CreateCommentResponse: 'code' | 'success' | 'message' | 'comment';
    DeleteCommentResponse: 'code' | 'success' | 'message' | 'commentId';
    Query: 'comments';
    Mutation: 'createComment' | 'deleteComment';
  };
  
  interface DefinedInputFields {
    CreateCommentInput: 'postId' | 'content';
  };
  
  export type Comment = Pick<Types.Comment, DefinedFields['Comment']>;
  export type DateTime = Types.DateTime;
  export type User = Types.User;
  export type CreateCommentInput = Pick<Types.CreateCommentInput, DefinedInputFields['CreateCommentInput']>;
  export type CreateCommentResponse = Pick<Types.CreateCommentResponse, DefinedFields['CreateCommentResponse']>;
  export type DeleteCommentResponse = Pick<Types.DeleteCommentResponse, DefinedFields['DeleteCommentResponse']>;
  export type Query = Pick<Types.Query, DefinedFields['Query']>;
  export type Mutation = Pick<Types.Mutation, DefinedFields['Mutation']>;
  
  export type CommentResolvers = Pick<Types.CommentResolvers, DefinedFields['Comment']>;
  export type CreateCommentResponseResolvers = Pick<Types.CreateCommentResponseResolvers, DefinedFields['CreateCommentResponse']>;
  export type DeleteCommentResponseResolvers = Pick<Types.DeleteCommentResponseResolvers, DefinedFields['DeleteCommentResponse']>;
  export type QueryResolvers = Pick<Types.QueryResolvers, DefinedFields['Query']>;
  export type MutationResolvers = Pick<Types.MutationResolvers, DefinedFields['Mutation']>;
  
  export interface Resolvers {
    Comment?: CommentResolvers;
    CreateCommentResponse?: CreateCommentResponseResolvers;
    DeleteCommentResponse?: DeleteCommentResponseResolvers;
    Query?: QueryResolvers;
    Mutation?: MutationResolvers;
  };
  
  export interface MiddlewareMap {
    '*'?: {
      '*'?: gm.Middleware[];
    };
    Comment?: {
      '*'?: gm.Middleware[];
      id?: gm.Middleware[];
      content?: gm.Middleware[];
      createdAt?: gm.Middleware[];
      author?: gm.Middleware[];
    };
    CreateCommentResponse?: {
      '*'?: gm.Middleware[];
      code?: gm.Middleware[];
      success?: gm.Middleware[];
      message?: gm.Middleware[];
      comment?: gm.Middleware[];
    };
    DeleteCommentResponse?: {
      '*'?: gm.Middleware[];
      code?: gm.Middleware[];
      success?: gm.Middleware[];
      message?: gm.Middleware[];
      commentId?: gm.Middleware[];
    };
    Query?: {
      '*'?: gm.Middleware[];
      comments?: gm.Middleware[];
    };
    Mutation?: {
      '*'?: gm.Middleware[];
      createComment?: gm.Middleware[];
      deleteComment?: gm.Middleware[];
    };
  };
}
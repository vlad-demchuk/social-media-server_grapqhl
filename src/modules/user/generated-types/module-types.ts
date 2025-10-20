import * as Types from "../../../generated-types/graphql";
import * as gm from "graphql-modules";
export namespace UserModule {
  interface DefinedFields {
    User: 'id' | 'username' | 'email' | 'createdAt' | 'emailVerified' | 'image' | 'updatedAt';
    Query: 'users' | 'user' | 'searchUser';
  };
  
  export type User = Pick<Types.User, DefinedFields['User']>;
  export type DateTime = Types.DateTime;
  export type Query = Pick<Types.Query, DefinedFields['Query']>;
  
  export type UserResolvers = Pick<Types.UserResolvers, DefinedFields['User']>;
  export type QueryResolvers = Pick<Types.QueryResolvers, DefinedFields['Query']>;
  
  export interface Resolvers {
    User?: UserResolvers;
    Query?: QueryResolvers;
  };
  
  export interface MiddlewareMap {
    '*'?: {
      '*'?: gm.Middleware[];
    };
    User?: {
      '*'?: gm.Middleware[];
      id?: gm.Middleware[];
      username?: gm.Middleware[];
      email?: gm.Middleware[];
      createdAt?: gm.Middleware[];
      emailVerified?: gm.Middleware[];
      image?: gm.Middleware[];
      updatedAt?: gm.Middleware[];
    };
    Query?: {
      '*'?: gm.Middleware[];
      users?: gm.Middleware[];
      user?: gm.Middleware[];
      searchUser?: gm.Middleware[];
    };
  };
}
import * as Types from "../../../generated-types/graphql";
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
}
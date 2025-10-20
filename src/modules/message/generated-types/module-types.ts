import * as Types from "../../../generated-types/graphql";
import * as gm from "graphql-modules";
export namespace MessageModule {
  interface DefinedFields {
    Message: 'id' | 'content' | 'createdAt' | 'updatedAt' | 'sender' | 'conversationId';
    CreateMessageResponse: 'code' | 'success' | 'message' | 'createdMessage';
    Query: 'conversationMessages';
    Mutation: 'createMessage';
    Subscription: 'messageAdded';
  };
  
  export type Message = Pick<Types.Message, DefinedFields['Message']>;
  export type DateTime = Types.DateTime;
  export type User = Types.User;
  export type CreateMessageResponse = Pick<Types.CreateMessageResponse, DefinedFields['CreateMessageResponse']>;
  export type Query = Pick<Types.Query, DefinedFields['Query']>;
  export type Mutation = Pick<Types.Mutation, DefinedFields['Mutation']>;
  export type Subscription = Pick<Types.Subscription, DefinedFields['Subscription']>;
  
  export type MessageResolvers = Pick<Types.MessageResolvers, DefinedFields['Message']>;
  export type CreateMessageResponseResolvers = Pick<Types.CreateMessageResponseResolvers, DefinedFields['CreateMessageResponse']>;
  export type QueryResolvers = Pick<Types.QueryResolvers, DefinedFields['Query']>;
  export type MutationResolvers = Pick<Types.MutationResolvers, DefinedFields['Mutation']>;
  export type SubscriptionResolvers = Pick<Types.SubscriptionResolvers, DefinedFields['Subscription']>;
  
  export interface Resolvers {
    Message?: MessageResolvers;
    CreateMessageResponse?: CreateMessageResponseResolvers;
    Query?: QueryResolvers;
    Mutation?: MutationResolvers;
    Subscription?: SubscriptionResolvers;
  };
  
  export interface MiddlewareMap {
    '*'?: {
      '*'?: gm.Middleware[];
    };
    Message?: {
      '*'?: gm.Middleware[];
      id?: gm.Middleware[];
      content?: gm.Middleware[];
      createdAt?: gm.Middleware[];
      updatedAt?: gm.Middleware[];
      sender?: gm.Middleware[];
      conversationId?: gm.Middleware[];
    };
    CreateMessageResponse?: {
      '*'?: gm.Middleware[];
      code?: gm.Middleware[];
      success?: gm.Middleware[];
      message?: gm.Middleware[];
      createdMessage?: gm.Middleware[];
    };
    Query?: {
      '*'?: gm.Middleware[];
      conversationMessages?: gm.Middleware[];
    };
    Mutation?: {
      '*'?: gm.Middleware[];
      createMessage?: gm.Middleware[];
    };
    Subscription?: {
      '*'?: gm.Middleware[];
      messageAdded?: gm.Middleware[];
    };
  };
}
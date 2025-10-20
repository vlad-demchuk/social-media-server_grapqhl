import * as Types from "../../../generated-types/graphql";
import * as gm from "graphql-modules";
export namespace ConversationModule {
  interface DefinedFields {
    ConversationParticipant: 'id' | 'username' | 'image';
    Conversation: 'id' | 'type' | 'name' | 'createdAt' | 'participants' | 'lastMessage' | 'creator';
    CreateConversationResponse: 'code' | 'success' | 'message' | 'conversation';
    Query: 'conversations';
    Mutation: 'createConversation';
    Subscription: 'conversationsUpdated';
  };
  
  export type ConversationParticipant = Pick<Types.ConversationParticipant, DefinedFields['ConversationParticipant']>;
  export type Conversation = Pick<Types.Conversation, DefinedFields['Conversation']>;
  export type DateTime = Types.DateTime;
  export type User = Types.User;
  export type Message = Types.Message;
  export type CreateConversationResponse = Pick<Types.CreateConversationResponse, DefinedFields['CreateConversationResponse']>;
  export type Query = Pick<Types.Query, DefinedFields['Query']>;
  export type Mutation = Pick<Types.Mutation, DefinedFields['Mutation']>;
  export type Subscription = Pick<Types.Subscription, DefinedFields['Subscription']>;
  
  export type ConversationParticipantResolvers = Pick<Types.ConversationParticipantResolvers, DefinedFields['ConversationParticipant']>;
  export type ConversationResolvers = Pick<Types.ConversationResolvers, DefinedFields['Conversation']>;
  export type CreateConversationResponseResolvers = Pick<Types.CreateConversationResponseResolvers, DefinedFields['CreateConversationResponse']>;
  export type QueryResolvers = Pick<Types.QueryResolvers, DefinedFields['Query']>;
  export type MutationResolvers = Pick<Types.MutationResolvers, DefinedFields['Mutation']>;
  export type SubscriptionResolvers = Pick<Types.SubscriptionResolvers, DefinedFields['Subscription']>;
  
  export interface Resolvers {
    ConversationParticipant?: ConversationParticipantResolvers;
    Conversation?: ConversationResolvers;
    CreateConversationResponse?: CreateConversationResponseResolvers;
    Query?: QueryResolvers;
    Mutation?: MutationResolvers;
    Subscription?: SubscriptionResolvers;
  };
  
  export interface MiddlewareMap {
    '*'?: {
      '*'?: gm.Middleware[];
    };
    ConversationParticipant?: {
      '*'?: gm.Middleware[];
      id?: gm.Middleware[];
      username?: gm.Middleware[];
      image?: gm.Middleware[];
    };
    Conversation?: {
      '*'?: gm.Middleware[];
      id?: gm.Middleware[];
      type?: gm.Middleware[];
      name?: gm.Middleware[];
      createdAt?: gm.Middleware[];
      participants?: gm.Middleware[];
      lastMessage?: gm.Middleware[];
      creator?: gm.Middleware[];
    };
    CreateConversationResponse?: {
      '*'?: gm.Middleware[];
      code?: gm.Middleware[];
      success?: gm.Middleware[];
      message?: gm.Middleware[];
      conversation?: gm.Middleware[];
    };
    Query?: {
      '*'?: gm.Middleware[];
      conversations?: gm.Middleware[];
    };
    Mutation?: {
      '*'?: gm.Middleware[];
      createConversation?: gm.Middleware[];
    };
    Subscription?: {
      '*'?: gm.Middleware[];
      conversationsUpdated?: gm.Middleware[];
    };
  };
}
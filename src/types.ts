import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from './context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

/** Comments */
export type Comment = {
  __typename?: 'Comment';
  /** Text content of the comment */
  content: Scalars['String']['output'];
  /** Creation timestamp */
  createdAt: Scalars['DateTime']['output'];
  /** Unique comment identifier */
  id: Scalars['Int']['output'];
  /** Author's username */
  username: Scalars['String']['output'];
};

export type CreateCommentInput = {
  /** Text body of the comment */
  content: Scalars['String']['input'];
  /** Identifier of the post to comment on */
  postId: Scalars['Int']['input'];
};

export type CreateCommentResponse = {
  __typename?: 'CreateCommentResponse';
  /** HTTP-like status code */
  code: Scalars['Int']['output'];
  /** The created comment, if successful */
  comment?: Maybe<Comment>;
  /** Human-readable status message */
  message: Scalars['String']['output'];
  /** Indicates whether the operation succeeded */
  success: Scalars['Boolean']['output'];
};

export type CreatePostInput = {
  /** Text body for the new post */
  content: Scalars['String']['input'];
};

export type CreatePostResponse = {
  __typename?: 'CreatePostResponse';
  /** HTTP-like status code */
  code: Scalars['Int']['output'];
  /** Human-readable status message */
  message: Scalars['String']['output'];
  /** The created post, if successful */
  post?: Maybe<Post>;
  /** Indicates whether the operation succeeded */
  success: Scalars['Boolean']['output'];
};

export type DeleteCommentResponse = {
  __typename?: 'DeleteCommentResponse';
  /** HTTP-like status code */
  code: Scalars['Int']['output'];
  /** Identifier of the deleted comment */
  commentId?: Maybe<Scalars['Int']['output']>;
  /** Human-readable status message */
  message: Scalars['String']['output'];
  /** Indicates whether the operation succeeded */
  success: Scalars['Boolean']['output'];
};

export type DeletePostResponse = {
  __typename?: 'DeletePostResponse';
  /** HTTP-like status code */
  code: Scalars['Int']['output'];
  /** Human-readable status message */
  message: Scalars['String']['output'];
  /** Identifier of the deleted post */
  postId?: Maybe<Scalars['Int']['output']>;
  /** Indicates whether the operation succeeded */
  success: Scalars['Boolean']['output'];
};

/** Likes */
export type LikePostResponse = {
  __typename?: 'LikePostResponse';
  /** HTTP-like status code */
  code: Scalars['Int']['output'];
  /** Human-readable status message */
  message: Scalars['String']['output'];
  /** Post with updated like counts */
  post?: Maybe<Post>;
  /** Indicates whether the operation succeeded */
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new comment on a post */
  createComment: CreateCommentResponse;
  /** Create a new post */
  createPost: CreatePostResponse;
  /** Delete a comment by its identifier */
  deleteComment: DeleteCommentResponse;
  /** Delete a post by its identifier */
  deletePost: DeletePostResponse;
  /** Add a like to a post */
  likePost: LikePostResponse;
  /** Remove a like from a post */
  unlikePost: LikePostResponse;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['Int']['input'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['Int']['input'];
};


export type MutationLikePostArgs = {
  postId: Scalars['Int']['input'];
};


export type MutationUnlikePostArgs = {
  postId: Scalars['Int']['input'];
};

/** Posts */
export type Post = {
  __typename?: 'Post';
  /** Number of comments on this post */
  commentsCount: Scalars['Int']['output'];
  /** Text content of the post */
  content: Scalars['String']['output'];
  /** Creation timestamp */
  createdAt: Scalars['DateTime']['output'];
  /** Unique post identifier */
  id: Scalars['Int']['output'];
  /** Whether the current user liked this post */
  isLiked: Scalars['Boolean']['output'];
  /** Number of likes on this post */
  likesCount: Scalars['Int']['output'];
  /** Author's username */
  username: Scalars['String']['output'];
};

/** Queries */
export type Query = {
  __typename?: 'Query';
  /** List comments for a specific post */
  comments: Array<Comment>;
  /** Single post */
  post: Post;
  /** List all posts */
  posts: Array<Post>;
  /** List user posts */
  userPosts: Array<Post>;
};


/** Queries */
export type QueryCommentsArgs = {
  postId: Scalars['Int']['input'];
};


/** Queries */
export type QueryPostArgs = {
  postId: Scalars['Int']['input'];
};


/** Queries */
export type QueryUserPostsArgs = {
  userName: Scalars['String']['input'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Comment: ResolverTypeWrapper<Comment>;
  CreateCommentInput: CreateCommentInput;
  CreateCommentResponse: ResolverTypeWrapper<CreateCommentResponse>;
  CreatePostInput: CreatePostInput;
  CreatePostResponse: ResolverTypeWrapper<CreatePostResponse>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DeleteCommentResponse: ResolverTypeWrapper<DeleteCommentResponse>;
  DeletePostResponse: ResolverTypeWrapper<DeletePostResponse>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LikePostResponse: ResolverTypeWrapper<LikePostResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Comment: Comment;
  CreateCommentInput: CreateCommentInput;
  CreateCommentResponse: CreateCommentResponse;
  CreatePostInput: CreatePostInput;
  CreatePostResponse: CreatePostResponse;
  DateTime: Scalars['DateTime']['output'];
  DeleteCommentResponse: DeleteCommentResponse;
  DeletePostResponse: DeletePostResponse;
  Int: Scalars['Int']['output'];
  LikePostResponse: LikePostResponse;
  Mutation: {};
  Post: Post;
  Query: {};
  String: Scalars['String']['output'];
};

export type CommentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCommentResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommentResponse'] = ResolversParentTypes['CreateCommentResponse']> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatePostResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreatePostResponse'] = ResolversParentTypes['CreatePostResponse']> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeleteCommentResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteCommentResponse'] = ResolversParentTypes['DeleteCommentResponse']> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  commentId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeletePostResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeletePostResponse'] = ResolversParentTypes['DeletePostResponse']> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LikePostResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LikePostResponse'] = ResolversParentTypes['LikePostResponse']> = {
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createComment?: Resolver<ResolversTypes['CreateCommentResponse'], ParentType, ContextType, RequireFields<MutationCreateCommentArgs, 'input'>>;
  createPost?: Resolver<ResolversTypes['CreatePostResponse'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'input'>>;
  deleteComment?: Resolver<ResolversTypes['DeleteCommentResponse'], ParentType, ContextType, RequireFields<MutationDeleteCommentArgs, 'commentId'>>;
  deletePost?: Resolver<ResolversTypes['DeletePostResponse'], ParentType, ContextType, RequireFields<MutationDeletePostArgs, 'postId'>>;
  likePost?: Resolver<ResolversTypes['LikePostResponse'], ParentType, ContextType, RequireFields<MutationLikePostArgs, 'postId'>>;
  unlikePost?: Resolver<ResolversTypes['LikePostResponse'], ParentType, ContextType, RequireFields<MutationUnlikePostArgs, 'postId'>>;
};

export type PostResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  commentsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  likesCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  comments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<QueryCommentsArgs, 'postId'>>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<QueryPostArgs, 'postId'>>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  userPosts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryUserPostsArgs, 'userName'>>;
};

export type Resolvers<ContextType = Context> = {
  Comment?: CommentResolvers<ContextType>;
  CreateCommentResponse?: CreateCommentResponseResolvers<ContextType>;
  CreatePostResponse?: CreatePostResponseResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DeleteCommentResponse?: DeleteCommentResponseResolvers<ContextType>;
  DeletePostResponse?: DeletePostResponseResolvers<ContextType>;
  LikePostResponse?: LikePostResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};


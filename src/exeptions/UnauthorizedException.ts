import { GraphQLError } from 'graphql/error';

export class UnauthorizedException extends GraphQLError {
  constructor(message: string = 'Authentication required') {
    super(message, {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
}

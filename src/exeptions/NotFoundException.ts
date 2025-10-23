import { GraphQLError } from 'graphql/error';

export class NotFoundException extends GraphQLError {
  constructor(message: string = 'Resource not found') {
    super(message, {
      extensions: { code: 'NOT_FOUND' },
    });
  }
}

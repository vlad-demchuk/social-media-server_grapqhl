import { GraphQLError } from 'graphql/error';

export class BadRequestException extends GraphQLError {
  constructor(message: string = 'Bad request') {
    super(message, {
      extensions: { code: 'BAD_REQUEST' },
    });
  }
}

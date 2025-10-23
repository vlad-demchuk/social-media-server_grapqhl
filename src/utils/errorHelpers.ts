import { GraphQLError } from 'graphql/error';

export interface MutationResponse {
  code: number;
  success: boolean;
  message: string;
}

export const createSuccessResponse = <T extends Record<string, any>>(
  message: string,
  data?: T,
): MutationResponse & T => {
  return {
    code: 200,
    success: true,
    message,
    ...data,
  } as MutationResponse & T;
};

export const createErrorResponse = (
  error: unknown,
  defaultMessage: string = 'Something went wrong',
): MutationResponse & { error: unknown } => {
  const message = error instanceof Error ? error.message : defaultMessage;
  
  return {
    code: 500,
    success: false,
    message,
    error,
  };
};

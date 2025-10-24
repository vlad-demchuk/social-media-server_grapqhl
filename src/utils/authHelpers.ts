import { Context } from '../graphql/types';
import { UnauthorizedException } from '../exeptions';
import { User } from '../lib/auth';

export const requireAuth = (context: Context): User => {
  if (!context.user) {
    throw new UnauthorizedException();
  }
  return context.user;
};

/**
 * Normalizes BetterAuth user object by converting string id to number.
 * Workaround for better-auth defect where id is returned as string despite useNumberId config.
 */
export const normalizeUser = (user: any): User | null => {
  if (!user) return null;
  return {
    ...user,
    id: Number(user.id),
  };
};

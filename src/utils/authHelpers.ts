import { Context } from '../context';
import { UnauthorizedException } from '../exeptions';
import { User } from '../lib/auth';

export const requireAuth = (context: Context): User => {
  if (!context.user) {
    throw new UnauthorizedException();
  }
  return context.user;
};

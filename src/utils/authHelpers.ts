import { Context } from '../context';
import { UnauthorizedException } from '../exeptions';

export const requireAuth = (context: Context) => {
  if (!context.user) {
    throw new UnauthorizedException();
  }
  return context.user;
};

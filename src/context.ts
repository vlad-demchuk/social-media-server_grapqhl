import { auth, Session, User } from './lib/auth';

export type Context = {
  user: User,
  session: Session,
  auth: typeof auth,
}

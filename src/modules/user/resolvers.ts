import { UserModule } from './generated-types/module-types';
import { UnauthorizedException } from '../../exeptions';
import * as userService from './service';

export const resolvers: UserModule.Resolvers = {
  Query: {
    users: async (_, __, context) => {
      if (!context.user) {
        throw new UnauthorizedException();
      }

      const users = await userService.getAll();

      return users;
    },
    user: async (_, args, context) => {
      if (!context.user) {
        throw new UnauthorizedException();
      }

      const user = await userService.getOne(args.userId);

      return user;
    },
    searchUser: async (_, args, context) => {
      if (!context.user) {
        throw new UnauthorizedException();
      }

      const users = await userService.search(args.query);

      return users;
    },
  },
};

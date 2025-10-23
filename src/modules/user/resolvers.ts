import { UserModule } from './generated-types/module-types';
import * as userService from './service';
import { requireAuth } from '../../utils/authHelpers';
import { NotFoundException } from '../../exeptions/NotFoundException';

export const resolvers: UserModule.Resolvers = {
  Query: {
    users: async (_, __, context) => {
      requireAuth(context);

      const users = await userService.getAll();

      return users;
    },
    user: async (_, args, context) => {
      requireAuth(context);

      const user = await userService.getOne(args.userId);
      
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    },
    searchUser: async (_, args, context) => {
      requireAuth(context);

      const users = await userService.search(args.query);

      return users;
    },
  },
};

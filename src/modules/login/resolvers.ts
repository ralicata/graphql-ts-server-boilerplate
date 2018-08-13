import * as bcrypt from 'bcryptjs';

import { ResolverMap } from '../../types/graphql-utils.d';
import { GQL } from '../../types/schema';
import { User } from '../../entity/User';
import { invalidLogin, confirmEmailError } from './errorMessages';

const errorResponse = [
  {
    path: 'email',
    message: invalidLogin
  }
];

export const resolvers: ResolverMap = {
  Query: {
    b: () => `Ok`
  },
  Mutation: {
    login: async (
      _: any,
      args: GQL.ILoginOnMutationArguments
      // { redis, url }
    ) => {
      const { email, password } = args;

      const user = await User.findOne({
        where: { email }
      });

      if (!user) {
        return errorResponse;
      }

      if (!user.confirmed) {
        return [
          {
            path: 'email',
            message: confirmEmailError
          }
        ];
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return errorResponse;
      }

      return null;
    }
  }
};

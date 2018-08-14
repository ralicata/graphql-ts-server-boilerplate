import * as bcrypt from 'bcryptjs';
import { invalidLogin, confirmEmailError } from './errorMessages';
import { ResolverMap } from '../../types/graphql-utils';
import { GQL } from '../../types/schema';
import { User } from '../../entity/User';

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
    login: async (_: any, args: GQL.ILoginOnMutationArguments, { session }) => {
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

      // valid login
      session.userId = user.id;

      return null;
    }
  }
};

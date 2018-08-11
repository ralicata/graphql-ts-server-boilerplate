import * as bcrypt from 'bcryptjs';
import { ResolverMap } from '../../types/graphql-utils.d';
import { GQL } from '../../types/schema';
import { User } from '../../entity/User';

export const resolvers: ResolverMap = {
  Query: {
    bye: () => `Bye`
  },
  Mutation: {
    register: async (
      _: any,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword
      });
      await user.save();
      return (email = password);
    }
  }
};

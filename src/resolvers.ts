import { ResolverMap } from './types/graphql-utils';
import { GQL } from './types/schema';

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: GQL.IHelloOnQueryArguments) =>
      `Bye ${name || 'World'}`
  },
  Mutation: {
    register: (
      _: any,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      return (email = password);
    }
  }
};

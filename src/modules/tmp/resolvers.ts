import { ResolverMap } from '../../types/graphql-utils.d';
import { GQL } from '../../types/schema';

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: GQL.IHelloOnQueryArguments) =>
      `Bye ${name || 'World'}`
  }
};

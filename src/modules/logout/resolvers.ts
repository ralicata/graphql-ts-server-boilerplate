import { ResolverMap } from '../../types/graphql-utils';

export const resolvers: ResolverMap = {
  Query: {
    c: () => 'c'
  },
  Mutation: {
    logout: (_, __, { session }) =>
      new Promise(res =>
        session.destroy(err => {
          if (err) {
            console.log('logout error: ', err);
          }
          res(true);
        })
      )
  }
};

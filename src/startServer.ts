import 'reflect-metadata';
import 'dotenv/config';
import { GraphQLServer } from 'graphql-yoga';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { createTypeormConnection } from './utils/createTypeormConnection';
import { confirmEmail } from './routes/confirmEmail';
import { genSchema } from './utils/genSchema';
import { redis } from './redis';

const RedisStore = connectRedis(session);

export const startServer = async () => {
  const server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + '://' + request.get('host'),
      session: request.session
    })
  });

  server.express.use(
    session({
      name: 'qid',
      store: new RedisStore({}),
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  const cors = {
    credentials: true,
    origin: '*'
  };

  server.express.get('/confirm/:id', confirmEmail);

  await createTypeormConnection();
  const app = await server.start({
    cors,
    port: process.env.NODE_ENV === 'test' ? 0 : 4000
  });
  console.log('Server is running on localhost:4000');
  return app;
};

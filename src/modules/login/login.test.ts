import { request } from 'graphql-request';
import { Connection } from 'typeorm';
import { createTypeormConnection } from '../../utils/createTypeormConnection';
import { invalidLogin, confirmEmailError } from './errorMessages';
import { User } from '../../entity/User';

const email = 'fake@example.com';
const password = '3sdfsf333q';

let conn: Connection;

const loginMutation = (e: string, p: string) => `
  mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

const registerMutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

beforeAll(async () => {
  conn = await createTypeormConnection();
});

afterAll(async () => {
  conn.close();
});

const loginExpectError = async (e: string, p: string, err: {}) => {
  const response = await request(
    process.env.TEST_HOST as string,
    loginMutation(e, p)
  );

  expect(response).toEqual({
    login: [
      {
        path: 'email',
        message: err
      }
    ]
  });
};

describe('Login', () => {
  test('email not found send back error', async () => {
    await loginExpectError('bob@bob.com', 'whatever', invalidLogin);
  });

  test('email not confirmed', async () => {
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password)
    );

    await loginExpectError(email, password, confirmEmailError);

    await User.update({ email }, { confirmed: true });

    await loginExpectError(email, 'aslkdfjaksdljf', invalidLogin);

    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, password)
    );

    expect(response).toEqual({ login: null });
  });
});

import { Connection } from 'typeorm';
import { createTypeormConnection } from '../../utils/createTypeormConnection';
import { invalidLogin, confirmEmailError } from './errorMessages';
import { User } from '../../entity/User';
import { TestClient } from '../../utils/TestClient';

const email = 'fake@example.com';
const password = '3sdfsf333q';

let conn: Connection;

beforeAll(async () => {
  conn = await createTypeormConnection();
});

afterAll(async () => {
  conn.close();
});

const client = new TestClient(process.env.TEST_HOST as string);

const loginExpectError = async (e: string, p: string, err: string) => {
  const response = await client.login(e, p);

  expect(response.data).toEqual({
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
    await client.register(email, password);

    await loginExpectError(email, password, confirmEmailError);

    await User.update({ email }, { confirmed: true });

    await loginExpectError(email, 'aslkdfjaksdljf', invalidLogin);

    const response = await client.login(email, password);

    expect(response.data).toEqual({ login: null });
  });
});

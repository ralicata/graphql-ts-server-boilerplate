import { User } from '../../entity/User';
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from './errorMessages';
import { createTypeormConnection } from '../../utils/createTypeormConnection';
import { Connection } from 'typeorm';
import { TestClient } from '../../utils/TestClient';

const email = 'tom@example.com';
const password = '3sdfsf333q';

let conn: Connection;

beforeAll(async () => {
  conn = await createTypeormConnection();
});

afterAll(async () => {
  conn.close();
});

const client = new TestClient(process.env.TEST_HOST as string);

describe('Register user', async () => {
  it('with valid email and password', async () => {
    const response = await client.register(email, password);

    expect(response.data).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it('with email already taken', async () => {
    const response2 = await client.register(email, password);

    expect(response2.data.register).toHaveLength(1);
    expect(response2.data.register[0]).toEqual({
      path: 'email',
      message: duplicateEmail
    });
  });

  it('with invalid email', async () => {
    const response3 = await client.register('b', password);

    expect(response3.data).toEqual({
      register: [
        {
          path: 'email',
          message: emailNotLongEnough
        },
        {
          path: 'email',
          message: invalidEmail
        }
      ]
    });
  });

  it('with invalid password', async () => {
    const response4 = await client.register(email, 'aa');
    expect(response4.data).toEqual({
      register: [
        {
          path: 'password',
          message: passwordNotLongEnough
        }
      ]
    });
  });

  it('with invalid email and password', async () => {
    const response5 = await client.register('a', 'bb');
    expect(response5.data).toEqual({
      register: [
        {
          path: 'email',
          message: emailNotLongEnough
        },
        {
          path: 'email',
          message: invalidEmail
        },
        {
          path: 'password',
          message: passwordNotLongEnough
        }
      ]
    });
  });
});

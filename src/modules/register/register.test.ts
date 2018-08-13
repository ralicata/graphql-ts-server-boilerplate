import { request } from 'graphql-request';
import { startServer } from '../../startServer';
import { User } from '../../entity/User';
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from './errorMessages';

let getHost = () => '';

beforeAll(async () => {
  const app = await startServer();
  const { port }: any = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = 'tom@example.com';
const password = '3sdfsf333q';

const mutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

describe('Register user', async () => {
  it('with valid email and password', async () => {
    const response = await request(getHost(), mutation(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it('with email already taken', async () => {
    const response2: any = await request(getHost(), mutation(email, password));
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: 'email',
      message: duplicateEmail
    });
  });

  it('with invalid email', async () => {
    const response3: any = await request(getHost(), mutation('ee', password));
    expect(response3).toEqual({
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
    const response4: any = await request(getHost(), mutation(email, 'ad'));
    expect(response4).toEqual({
      register: [
        {
          path: 'password',
          message: passwordNotLongEnough
        }
      ]
    });
  });

  it('with invalid email and password', async () => {
    const response5: any = await request(getHost(), mutation('s', 'ad'));
    expect(response5).toEqual({
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

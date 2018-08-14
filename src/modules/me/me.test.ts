import { Connection } from 'typeorm';
import { createTypeormConnection } from '../../utils/createTypeormConnection';
import { User } from '../../entity/User';
import { TestClient } from '../../utils/TestClient';

const email = 'john2@example.com';
const password = 'qwerty123';
let userId: string;

let conn: Connection;

beforeAll(async () => {
  conn = await createTypeormConnection();
  const user = await User.create({
    email,
    password,
    confirmed: true
  }).save();
  userId = user.id;
});

afterAll(async () => {
  conn.close();
});

const client = new TestClient(process.env.TEST_HOST as string);

describe('me()', () => {
  test("can't get user if not logged in", async () => {
    const response = await client.me();

    expect(response.data).toEqual({
      me: null
    });
  });

  test('get user if logged in', async () => {
    await client.login(email, password);

    const response = await client.me();

    expect(response.data).toEqual({
      me: {
        id: userId,
        email
      }
    });
  });
});

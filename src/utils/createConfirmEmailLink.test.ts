import { createConfirmEmailLink } from './createConfirmEmailLink';
import { createTypeormConnection } from './createTypeormConnection';
import { User } from '../entity/User';
import * as Redis from 'ioredis';
import fetch from 'node-fetch';

let userId = '';
const redis = new Redis();

beforeAll(async () => {
  await createTypeormConnection();
  const user = await User.create({
    email: 'john@example.com',
    password: 'qwerty123'
  }).save();
  userId = user.id;
});

describe('Create confirmation link', () => {
  test('with valid id', async () => {
    const url = await createConfirmEmailLink(
      process.env.TEST_HOST as string,
      userId,
      redis
    );
    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual('ok');
    const user = await User.findOne({ where: { id: userId } });
    expect((user as User).confirmed).toBeTruthy();
    const chunks = url.split('/');
    const key = chunks[chunks.length - 1];
    const value = await redis.get(key);
    expect(value).toBeNull();
  });

  test('with invalid id', async () => {
    const url = `${process.env.TEST_HOST}/confirm/1234`;
    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual('invalid');
  });
});

import fetch from 'node-fetch';

test('with invalid id', async () => {
  const url = `${process.env.TEST_HOST}/confirm/1234`;
  const response = await fetch(url);
  const text = await response.text();
  expect(text).toEqual('invalid');
});

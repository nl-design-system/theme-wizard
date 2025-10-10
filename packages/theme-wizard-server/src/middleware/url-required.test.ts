import { Hono } from 'hono';
import { test, expect } from 'vitest';
import { requireUrlParam } from './url-required';

test('throws 400 when url is missing', async () => {
  const app = new Hono();
  app.get('/test', requireUrlParam, (c) => c.text('ok'));
  const response = await app.request('/test');

  expect(response.status).toBe(400);
  expect(await response.text()).toBe('missing `url` parameter: specify a url like ?url=example.com');
});

test('throws 400 when url is empty', async () => {
  const app = new Hono();
  app.get('/test', requireUrlParam, (c) => c.text('ok'));
  const response = await app.request('/test?url=');

  expect(response.status).toBe(400);
});

test('throws 400 when url is whitespace', async () => {
  const app = new Hono();
  app.get('/test', requireUrlParam, (c) => c.text('ok'));
  const response = await app.request('/test?url=%20');

  expect(response.status).toBe(400);
});

test('sets url in context when valid', async () => {
  const app = new Hono<{ Variables: { url: string } }>();
  app.get('/test', requireUrlParam, (c) => c.text('ok'));
  const response = await app.request('/test?url=example.com');

  expect(response.status).toBe(200);
  expect(await response.text()).toBe('ok');
});

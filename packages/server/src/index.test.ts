import { test, expect } from 'vitest';
import app from './index';

test('health check', async () => {
  const response = await app.request('/healthz');
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({});
});

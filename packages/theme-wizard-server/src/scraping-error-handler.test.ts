import { Hono } from 'hono';
import { describe, test, expect } from 'vitest';
import { withScrapingErrorHandler } from './scraping-error-handler';

describe('withScrapingErrorHandler', () => {
  test('converts scraping errors with statusCode to 400', async () => {
    const app = new Hono();
    app.get(
      '/test',
      withScrapingErrorHandler(async () => {
        const error = new Error('custom error');
        // @ts-expect-error We're mimicking an internal getCss error here
        error.statusCode = 404;
        throw error;
      }),
    );

    const response = await app.request('/test');
    expect(response.status).toBe(400);
    expect(await response.text()).toBe('custom error');
  });

  test('converts unknown errors to 500', async () => {
    const app = new Hono();
    app.get(
      '/test',
      withScrapingErrorHandler(async () => {
        throw new Error('unexpected error');
      }),
    );

    const response = await app.request('/test');
    expect(response.status).toBe(500);
    expect(await response.text()).toBe('encountered a scraping error');
  });

  test('returns response when no error', async () => {
    const app = new Hono();
    app.get(
      '/test',
      withScrapingErrorHandler(async (c) => {
        return c.text('success');
      }),
    );

    const response = await app.request('/test');
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('success');
  });
});

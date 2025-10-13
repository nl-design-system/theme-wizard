import { ScrapingError } from '@nl-design-system-community/css-scraper';
import { Hono } from 'hono';
import { describe, test, expect } from 'vitest';
import { withScrapingErrorHandler } from './scraping-error-handler';

describe('withScrapingErrorHandler', () => {
  test('converts scraping errors with statusCode to 400', async () => {
    const app = new Hono();
    app.get(
      '/test',
      withScrapingErrorHandler(async () => {
        throw new ScrapingError('Scraping Error', 404, 'example.com');
      }),
    );
    const response = await app.request('/test');

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Scraping Error');
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

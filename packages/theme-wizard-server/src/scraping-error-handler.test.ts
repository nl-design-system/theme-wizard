import { ScrapingError } from '@nl-design-system-community/css-scraper';
import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';
import { withScrapingErrorHandler } from './scraping-error-handler';

describe('withScrapingErrorHandler', () => {
  it('converts scraping errors with statusCode to 400', async () => {
    const app = new Hono();
    app.get(
      '/test',
      withScrapingErrorHandler(async () => {
        throw new ScrapingError('Scraping Error', 'https://example.com/non-existent-page');
      }),
    );
    const response = await app.request('/test');

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      errors: [
        {
          name: 'ScrapingError',
          message: 'Scraping Error',
        },
      ],
      ok: false,
    });
  });

  it('converts unknown errors to 500', async () => {
    const app = new Hono();
    app.get(
      '/test',
      withScrapingErrorHandler(async () => {
        throw new Error('unexpected error');
      }),
    );
    const response = await app.request('/test');

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: {
        message: 'encountered a scraping error',
      },
      ok: false,
    });
  });

  it('returns response when no error', async () => {
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

import { test, expect, describe, vi, type Mock } from 'vitest';
import app from './index';

vi.mock('@nl-design-system-community/css-scraper', () => ({
  getCss: vi.fn(),
}));

test('health check', async () => {
  const response = await app.request('/healthz');
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({});
});

describe('/api/v1', () => {
  describe('/css', () => {
    describe('query param validation', () => {
      test('missing `url` query param', async () => {
        const response = await app.request('/api/v1/css');
        expect.soft(response.status).toBe(400);
        expect.soft(await response.text()).toBe('missing `url` parameter: specify a url like ?url=example.com');
      });
    });

    describe('happy path', () => {
      const mockedGetCssData = [
        {
          css: 'a { color: blue; }',
          href: 'example.com',
          type: 'style',
          url: 'https://example.com',
        },
      ];
      test('returns a string of css', async () => {
        const { getCss } = await import('@nl-design-system-community/css-scraper');
        (getCss as Mock).mockResolvedValueOnce(mockedGetCssData);
        const response = await app.request('/api/v1/css?url=example.com');
        expect.soft(await response.text()).toBe('a { color: blue; }');
        expect.soft(response.headers.get('content-type')).toContain('text/css');
      });

      test('contains server-timing', async () => {
        const { getCss } = await import('@nl-design-system-community/css-scraper');
        (getCss as Mock).mockResolvedValueOnce(mockedGetCssData);
        const response = await app.request('/api/v1/css?url=example.com');
        const expectedTiming = 'scraping;desc="Scraping CSS";dur=';
        expect.soft(response.headers.get('server-timing')).toContain(expectedTiming);
        const duration = response.headers.get('server-timing')?.substring(expectedTiming.length);
        expect.soft(duration).not.toBeNaN();
        expect.soft(Number(duration)).toBeGreaterThanOrEqual(0);
      });
    });

    describe('error handling', () => {
      test('errors thrown by getCss are handled', async () => {
        const { getCss } = await import('@nl-design-system-community/css-scraper');
        const scraperError = new Error();
        // @ts-expect-error We're mimicking an internal getCss error here
        scraperError.statusCode = 403;
        (getCss as Mock).mockRejectedValueOnce(scraperError);
        const response = await app.request('/api/v1/css?url=thisdoesnotexist.com');
        expect.soft(response.status).toBe(400);
      });

      test('generic errors are handled', async () => {
        const { getCss } = await import('@nl-design-system-community/css-scraper');
        (getCss as Mock).mockRejectedValueOnce(new Error());
        const response = await app.request('/api/v1/css?url=thisdoesnotexist.com');
        expect.soft(response.status).toBe(500);
      });
    });
  });
});

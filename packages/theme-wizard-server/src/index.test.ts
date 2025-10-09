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
  describe('/css & /css-design-tokens param valiation', () => {
    describe('query param validation', () => {
      test('missing `url` query param', async () => {
        const response = await app.request('/api/v1/css');
        expect.soft(response.status).toBe(400);
        expect.soft(await response.text()).toBe('missing `url` parameter: specify a url like ?url=example.com');
      });
    });
  });

  describe('/css', () => {
    describe('fetching css', () => {
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
    });
  });

  describe('/css-design-tokens', () => {
    const mockedGetCssData = [
      {
        css: 'a { color: blue; }',
        href: 'example.com',
        type: 'style',
        url: 'https://example.com',
      },
    ];

    test('returns tokens', async () => {
      const { getCss } = await import('@nl-design-system-community/css-scraper');
      (getCss as Mock).mockResolvedValueOnce(mockedGetCssData);
      const response = await app.request('/api/v1/css-design-tokens?url=example.com');
      expect.soft(response.headers.get('content-type')).toContain('application/json');
      expect.soft(await response.json()).toEqual({
        box_shadow: {},
        color: {
          'blue-edec3e9a': {
            $extensions: {
              'com.projectwallace.css-authored-as': 'blue',
              'com.projectwallace.css-properties': ['color'],
              'com.projectwallace.usage-count': 1,
            },
            $type: 'color',
            $value: {
              alpha: 1,
              colorSpace: 'srgb',
              components: [0, 0, 1],
            },
          },
        },
        duration: {},
        easing: {},
        font_family: {},
        font_size: {},
        gradient: {},
        line_height: {},
        radius: {},
      });
    });

    test('contains server-timing', async () => {
      const { getCss } = await import('@nl-design-system-community/css-scraper');
      (getCss as Mock).mockResolvedValueOnce(mockedGetCssData);
      const response = await app.request('/api/v1/css-design-tokens?url=example.com');
      const expectedTiming = 'scraping;desc="Scraping CSS";dur=';
      expect.soft(response.headers.get('server-timing')).toContain(expectedTiming);
      const duration = response.headers.get('server-timing')?.substring(expectedTiming.length);
      expect.soft(duration).not.toBeNaN();
      expect.soft(Number(duration)).toBeGreaterThanOrEqual(0);
    });
  });
});

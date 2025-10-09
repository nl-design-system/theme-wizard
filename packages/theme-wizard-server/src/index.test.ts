import { test, expect, describe, vi, type Mock } from 'vitest';
import app from './index';

vi.mock('@nl-design-system-community/css-scraper', () => ({
  getCss: vi.fn(),
}));

describe('health check', () => {
  test('returns correct response', async () => {
    const response = await app.request('/healthz');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({});
  });

  test('does not send server timing header', async () => {
    const response = await app.request('/healthz');
    expect(response.headers.get('server-timing')).toBeNull();
  });
});

describe('/api/v1', () => {
  const mockedGetCssData = [
    {
      css: 'a { color: blue; }',
      href: 'example.com',
      type: 'style',
      url: 'https://example.com',
    },
  ];

  describe('shared /css & /css-design-tokens', () => {
    for (const url of ['/api/v1/css', '/api/v1/css-design-tokens']) {
      test('missing `url` query param', async () => {
        const response = await app.request(url);
        expect.soft(response.status).toBe(400);
        expect.soft(await response.text()).toBe('missing `url` parameter: specify a url like ?url=example.com');
      });

      test('contains server-timing', async () => {
        const { getCss } = await import('@nl-design-system-community/css-scraper');
        (getCss as Mock).mockResolvedValueOnce(mockedGetCssData);
        const response = await app.request(`${url}?url=example.com`);
        const timingHeader = response.headers.get('server-timing');
        expect.soft(timingHeader).toMatch(/scraping;dur=\d+(:?\.\d+);desc="Scraping CSS"/);
      });
    }
  });

  describe('/css', () => {
    test('returns a string of css', async () => {
      const { getCss } = await import('@nl-design-system-community/css-scraper');
      (getCss as Mock).mockResolvedValueOnce(mockedGetCssData);
      const response = await app.request('/api/v1/css?url=example.com');

      expect.soft(await response.text()).toBe('a { color: blue; }');
      expect.soft(response.headers.get('content-type')).toContain('text/css');
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
  });
});

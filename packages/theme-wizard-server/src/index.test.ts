import * as cssScraper from '@nl-design-system-community/css-scraper';
import { test, expect, describe, vi } from 'vitest';
import app from './index';

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
  test('/ redirects to openapi', async () => {
    const response = await app.request('/');
    expect.soft(response.status).toBe(302);
    expect.soft(response.headers.get('Location')).toBe('/api/v1/openapi.json');
  });

  describe('openapi.json', () => {
    test('exists', async () => {
      const response = await app.request('/api/v1/openapi.json');
      expect.soft(response.status).toBe(200);
      expect.soft(response.headers.get('Content-Type')).toBe('application/json');
    });

    test('lists all endpoints', async () => {
      const response = await app.request('/api/v1/openapi.json');
      const data = await response.json();
      const endpoints = Object.keys(data.paths);
      expect(endpoints).toEqual(['/healthz', '/api/v1/css', '/api/v1/css-design-tokens']);
    });
  });

  const mockedGetCssData = 'a { color: blue; }';

  describe('shared /css & /css-design-tokens', () => {
    for (const url of ['/api/v1/css', '/api/v1/css-design-tokens']) {
      test('missing `url` query param', async () => {
        const response = await app.request(url);
        expect.soft(response.status).toBe(400);
        expect.soft(await response.json()).toEqual({
          errors: [
            {
              name: 'invalid_type',
              message: 'Invalid input: expected string, received undefined',
              path: 'url',
            },
          ],
          ok: false,
        });
      });

      test('contains server-timing', async () => {
        vi.spyOn(cssScraper, 'getCss').mockResolvedValueOnce(mockedGetCssData);
        const response = await app.request(`${url}?url=example.com`);
        const timingHeader = response.headers.get('server-timing');
        expect.soft(timingHeader).toMatch(/scraping;dur=\d+(:?\.\d+);desc="Scraping CSS"/);
      });
    }
  });

  describe('/css', () => {
    test('returns a string of css', async () => {
      vi.spyOn(cssScraper, 'getCss').mockResolvedValueOnce(mockedGetCssData);
      const response = await app.request('/api/v1/css?url=example.com');

      expect.soft(await response.text()).toBe(mockedGetCssData);
      expect.soft(response.headers.get('content-type')).toContain('text/css');
    });
  });

  describe('/css-design-tokens', () => {
    const mockCss = `
      a {
        color: blue;
        font-size: 16px;
        font-family: Arial, system-ui, sans-serif;
      }
    `;

    test('returns tokens', async () => {
      vi.spyOn(cssScraper, 'getCss').mockResolvedValueOnce(mockCss);
      const response = await app.request('/api/v1/css-design-tokens?url=example.com');

      expect.soft(response.headers.get('content-type')).toContain('application/json');
      expect.soft(await response.json()).toEqual({
        colors: {
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
        fontFamilies: {
          'fontFamily-4aaee372': {
            $extensions: {
              'com.projectwallace.css-authored-as': 'Arial, system-ui, sans-serif',
              'com.projectwallace.usage-count': 1,
            },
            $type: 'fontFamily',
            $value: ['Arial', 'system-ui', 'sans-serif'],
          },
        },
        fontSizes: {
          'fontSize-171eed': {
            $extensions: {
              'com.projectwallace.css-authored-as': '16px',
              'com.projectwallace.usage-count': 1,
            },
            $type: 'dimension',
            $value: {
              unit: 'px',
              value: 16,
            },
          },
        },
      });
    });
  });
});

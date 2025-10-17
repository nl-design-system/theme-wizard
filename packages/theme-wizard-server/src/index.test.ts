import * as cssScraper from '@nl-design-system-community/css-scraper';
import { test, expect, describe, vi, beforeEach } from 'vitest';

vi.mock('@vercel/related-projects', () => ({
  withRelatedProject: vi.fn(),
}));

import { withRelatedProject } from '@vercel/related-projects';
import app from './index';

describe('cors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear module cache so app re-imports on the fly with fresh mocks
    vi.resetModules();
  });

  test('allows request without origin', async () => {
    const response = await app.request('/');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  test('allows theme wizard website origin', async () => {
    const origin = 'http://localhost:8080';
    vi.mocked(withRelatedProject).mockReturnValue(origin);
    // Re-import app so it has withRelatedProject correctly mocked
    const { default: app } = await import('./index');
    const response = await app.request('/', {
      headers: { origin },
    });
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(origin);
  });

  test('disallows foreign origins', async () => {
    vi.mocked(withRelatedProject).mockReturnValue('https://example.com');
    // Re-import app so it has withRelatedProject correctly mocked
    const { default: app } = await import('./index');
    const response = await app.request('/', {
      headers: { origin: 'https://spoof-website.com' },
    });
    expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });
});

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

  describe('swagger docs', () => {
    test('shows the UI', async () => {
      const response = await app.request('/api/docs');

      expect.soft(response.status).toBe(200);
      expect.soft(response.headers.get('content-type')).toContain('text/html');
      expect.soft(await response.text()).toContain('<div id="swagger-ui">');
    });
  });

  const mockedGetCssData = 'a { color: blue; }';

  describe('shared /css & /css-design-tokens', () => {
    for (const url of ['/api/v1/css', '/api/v1/css-design-tokens']) {
      test(`missing "url" query param (${url})`, async () => {
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

      test(`contains server-timing (${url})`, async () => {
        vi.spyOn(cssScraper, 'getCss').mockResolvedValueOnce(mockedGetCssData);
        const response = await app.request(`${url}?url=example.com`);
        const timingHeader = response.headers.get('server-timing');
        expect.soft(timingHeader).toMatch(/scraping;dur=\d+(:?\.\d+);desc="Scraping CSS"/);
      });

      test('contain security headers', async () => {
        vi.spyOn(cssScraper, 'getCss').mockResolvedValueOnce(mockedGetCssData);
        const response = await app.request(`${url}?url=example.com`);

        const hsts = response.headers.get('Strict-Transport-Security');
        expect.soft(hsts).toBe('max-age=15552000; includeSubDomains');

        const poweredBy = response.headers.get('X-Powered-By');
        expect.soft(poweredBy).toBeNull();
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

    test('server error', async () => {
      vi.spyOn(cssScraper, 'getCss').mockRejectedValueOnce(new Error('Generic error'));
      const response = await app.request('/api/v1/css?url=example.com');

      expect.soft(response.status).toBe(500);
      expect.soft(await response.json()).toEqual({
        error: {
          message: 'Internal server error',
        },
        ok: false,
      });
    });
  });

  describe('/css-design-tokens', () => {
    const mockCss = `
      a {
        background-color: red;
        font-size: 1rem;
        font-family: Georgia, "Times New Roman", serif;
      }
    `;

    test('returns tokens', async () => {
      vi.spyOn(cssScraper, 'getCss').mockResolvedValueOnce(mockCss);
      const response = await app.request('/api/v1/css-design-tokens?url=example.com');

      expect.soft(response.headers.get('content-type')).toContain('application/json');
      expect.soft(await response.json()).toEqual([
        {
          $extensions: {
            'nl.nldesignsystem.theme-wizard.css-authored-as': 'red',
            'nl.nldesignsystem.theme-wizard.css-properties': ['background-color'],
            'nl.nldesignsystem.theme-wizard.token-id': 'red-edecb2da',
            'nl.nldesignsystem.theme-wizard.usage-count': 1,
          },
          $type: 'color',
          $value: {
            alpha: 1,
            colorSpace: 'srgb',
            components: [1, 0, 0],
          },
        },
        {
          $extensions: {
            'nl.nldesignsystem.theme-wizard.css-authored-as': 'Georgia, "Times New Roman", serif',
            'nl.nldesignsystem.theme-wizard.css-properties': ['font-family'],
            'nl.nldesignsystem.theme-wizard.token-id': 'fontFamily-c0fc8c3a',
            'nl.nldesignsystem.theme-wizard.usage-count': 1,
          },
          $type: 'fontFamily',
          $value: ['Georgia', 'Times New Roman', 'serif'],
        },
        {
          $extensions: {
            'nl.nldesignsystem.theme-wizard.css-authored-as': '1rem',
            'nl.nldesignsystem.theme-wizard.css-properties': ['font-size'],
            'nl.nldesignsystem.theme-wizard.token-id': 'fontSize-17fec9',
            'nl.nldesignsystem.theme-wizard.usage-count': 1,
          },
          $type: 'dimension',
          $value: {
            unit: 'rem',
            value: 1,
          },
        },
      ]);
    });
  });
});

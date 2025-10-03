import { test, expect, describe } from 'vitest';
import { isLocalhostUrl, getCssFromHtml } from './get-css';

describe('isLocalhostUrl', () => {
  test('localhost', () => {
    expect(isLocalhostUrl('http://localhost')).toBeTruthy();
    expect(isLocalhostUrl('http://localhost:8080')).toBeTruthy();
  });
  test('127.0.0.1', () => {
    expect(isLocalhostUrl('http://127.0.0.1/')).toBeTruthy();
    expect(isLocalhostUrl('http://127.0.0.1/hello-world')).toBeTruthy();
    expect(isLocalhostUrl('http://127.0.0.1:8080')).toBeTruthy();
  });
  test('192.168.*.*', () => {
    expect(isLocalhostUrl('http://192.168.0.0')).toBeTruthy();
    expect(isLocalhostUrl('http://192.168.1.1')).toBeTruthy();
  });
});

describe('getCssFromHtml', () => {
  describe('<style> tags', () => {
    test('single style element', () => {
      const html = `
        <style>.my-css { color: red; }</style>
      `;
      expect(getCssFromHtml(html, 'example.com')).toEqual([
        {
          css: '.my-css { color: red; }',
          type: 'style',
          url: 'example.com',
        },
      ]);
    });

    test('multiple style elements', () => {
      const html = `
        <style>.my-css { color: red; }</style>
        <p>Hello world</p>
        <style>.my-css { background: green; }</style>
      `;
      expect(getCssFromHtml(html, 'example.com')).toEqual([
        {
          css: '.my-css { color: red; }',
          type: 'style',
          url: 'example.com',
        },
        {
          css: '.my-css { background: green; }',
          type: 'style',
          url: 'example.com',
        },
      ]);
    });

    test('empty style tag', () => {
      const html = `<style></style>`;
      expect(getCssFromHtml(html, 'example.com')).toEqual([]);
    });

    test('empty style tag with whitespace', () => {
      const html = `<style> </style>`;
      expect(getCssFromHtml(html, 'example.com')).toEqual([]);
    });
  });

  describe('<link> tags', () => {
    // Tets matrix:
    // - href: absolute | relative | base64-encoded
    // - <base> element present: yes | no
    // - media: null | string
    // - rel: stylesheet | alternate stylesheet | etc
    test('rel=stylesheet href=absolute', () => {
      expect(
        getCssFromHtml('<link rel="stylesheet" href="https://example.com/style.css">', 'https://example.com'),
      ).toEqual([
        {
          css: undefined,
          href: 'https://example.com/style.css',
          media: undefined,
          rel: 'stylesheet',
          type: 'link',
          url: 'https://example.com/style.css',
        },
      ]);
    });

    test('rel="stylesheet alternate"', () => {
      expect(
        getCssFromHtml('<link rel="stylesheet alternate" href="https://example.com/style.css">', 'https://example.com'),
      ).toEqual([
        {
          css: undefined,
          href: 'https://example.com/style.css',
          media: undefined,
          rel: 'stylesheet alternate',
          type: 'link',
          url: 'https://example.com/style.css',
        },
      ]);
    });

    test('rel="stylesheet media=(prefers-color-scheme: dark)"', () => {
      expect(
        getCssFromHtml(
          '<link rel="stylesheet" href="https://example.com/style.css" media="(prefers-color-scheme: dark)">',
          'https://example.com',
        ),
      ).toEqual([
        {
          css: undefined,
          href: 'https://example.com/style.css',
          media: '(prefers-color-scheme: dark)',
          rel: 'stylesheet',
          type: 'link',
          url: 'https://example.com/style.css',
        },
      ]);
    });

    describe('relative URLs', () => {
      test('rel=stylesheet href=./style.css', () => {
        expect(getCssFromHtml('<link rel="stylesheet" href="./style.css">', 'https://example.com')).toEqual([
          {
            css: undefined,
            href: './style.css',
            media: undefined,
            rel: 'stylesheet',
            type: 'link',
            url: 'https://example.com/style.css',
          },
        ]);
      });

      test('rel=stylesheet href=./style.css', () => {
        expect(
          getCssFromHtml('<link rel="stylesheet" href="../../style.css">', 'https://example.com/blog/post'),
        ).toEqual([
          {
            css: undefined,
            href: '../../style.css',
            media: undefined,
            rel: 'stylesheet',
            type: 'link',
            url: 'https://example.com/style.css',
          },
        ]);
      });
    });

    test('handles base64 encoded hrefs', () => {
      const expectedCss = 'test {}';
      const href = `data:text/css;base64,${btoa(expectedCss)}`;
      const html = `<link rel="stylesheet" href="${href}">`;
      expect(getCssFromHtml(html, 'example.com')).toEqual([
        {
          css: expectedCss,
          href: href,
          media: undefined,
          rel: 'stylesheet',
          type: 'link',
          url: href,
        },
      ]);
    });
  });

  describe('inline `style=".." attributes', () => {
    test('a single element with a style attribute', () => {
      const html = `<p style="font-size: 20px; font-weight: bold;">I am h1</p>`;
      expect(getCssFromHtml(html, 'example.com')).toEqual([
        {
          css: ':where([css-scraper-inline-styles]) { font-size: 20px; font-weight: bold; }',
          type: 'inline',
          url: 'example.com',
        },
      ]);
    });

    test('multiple elements with a style attribute', () => {
      const html = `
        <p style="font-size: 20px;">I am h1</p>
        <marquee style="animation-duration: 60s;">WHIEEEEE</marquee>
      `;
      expect(getCssFromHtml(html, 'example.com')).toEqual([
        {
          css: ':where([css-scraper-inline-styles]) { font-size: 20px;animation-duration: 60s; }',
          type: 'inline',
          url: 'example.com',
        },
      ]);
    });

    test('missing trailing ;', () => {
      const html = `
        <p style="font-size: 20px">I am h1</p>
        <marquee style="animation-duration: 60s;">WHIEEEEE</marquee>
      `;
      expect(getCssFromHtml(html, 'example.com')).toEqual([
        {
          css: ':where([css-scraper-inline-styles]) { font-size: 20px;animation-duration: 60s; }',
          type: 'inline',
          url: 'example.com',
        },
      ]);
    });

    test('empty attribute', () => {
      const html = '<p style="">test</p>';
      expect(getCssFromHtml(html, 'example.com')).toEqual([]);
    });

    test('attribute with whitespace only', () => {
      const html = '<p style="  ">test</p>';
      expect(getCssFromHtml(html, 'example.com')).toEqual([]);
    });
  });
});

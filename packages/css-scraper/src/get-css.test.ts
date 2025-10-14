import { test, expect, describe, vi, beforeEach, type Mock } from 'vitest';
import { ForbiddenError, NotFoundError, ConnectionRefusedError, InvalidUrlError, TimeoutError } from './errors';
import { getCssFromHtml, getImportUrls, getCssFile, getCssOrigins, getCss, getDesignTokens } from './get-css';

const CSS_FILE_REPONSE_MOCK = {
  headers: new Headers({ 'Content-Type': 'text/css' }),
  ok: true,
  status: 200,
  text: async () => 'a { color: blue; }',
};

describe('getCssOrigins', () => {
  globalThis.fetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('get a CSS file directly (no further scraping', async () => {
    (fetch as Mock).mockResolvedValueOnce(CSS_FILE_REPONSE_MOCK);
    const result = await getCssOrigins('https://example.com/style.css');
    expect(result).toEqual([
      {
        css: 'a { color: blue; }',
        href: 'https://example.com/style.css',
        type: 'file',
      },
    ]);
  });

  test('get remote CSS referenced in a <link> tag', async () => {
    // Mock the HTML request
    const mockHtml = `
      <html>
        <head>
          <link rel="stylesheet" href="https://example.com/style.css">
        </head>
      </html>
    `;
    (fetch as Mock).mockResolvedValueOnce({
      headers: new Headers({ 'Content-Type': 'text/html' }),
      ok: true,
      status: 200,
      text: async () => mockHtml,
    });

    // Mock the CSS request
    const mockCss = 'a { color: blue; }';
    (fetch as Mock).mockResolvedValueOnce(CSS_FILE_REPONSE_MOCK);

    const result = await getCssOrigins('https://example.com');
    expect(result).toEqual([
      {
        css: mockCss,
        href: 'https://example.com/style.css',
        media: undefined,
        rel: 'stylesheet',
        type: 'link',
        url: 'https://example.com/style.css',
      },
    ]);
  });

  test('get embedded CSS from a <style> tag', async () => {
    // Mock the HTML request
    const mockCss = 'a { color: blue; }';
    const mockHtml = `
      <html>
        <head>
          <style>${mockCss}</style>
        </head>
      </html>
    `;
    (fetch as Mock).mockResolvedValueOnce({
      headers: new Headers({ 'Content-Type': 'text/html' }),
      ok: true,
      status: 200,
      text: async () => mockHtml,
    });

    const result = await getCssOrigins('https://example.com');
    expect(result).toEqual([
      {
        css: mockCss,
        type: 'style',
        url: 'https://example.com/',
      },
    ]);
  });

  test('deep-fetch CSS from an @import rule', async () => {
    // Mock the HTML request
    const mockCss = '@import url("./fonts.css");';
    const mockHtml = `
      <html>
        <head>
          <style>${mockCss}</style>
        </head>
      </html>
    `;
    (fetch as Mock).mockResolvedValueOnce({
      headers: new Headers({ 'Content-Type': 'text/html' }),
      ok: true,
      status: 200,
      text: async () => mockHtml,
    });

    // Mock the CSS request
    (fetch as Mock).mockResolvedValueOnce(CSS_FILE_REPONSE_MOCK);

    const result = await getCssOrigins('https://example.com');
    expect(result).toEqual([
      {
        css: mockCss,
        type: 'style',
        url: 'https://example.com/',
      },
      {
        css: 'a { color: blue; }',
        href: './fonts.css',
        type: 'import',
        url: './fonts.css',
      },
    ]);
  });

  test('fetch CSS from a remote source with relative path and <base> element in the HTML', async () => {
    // Mock the HTML request
    const mockHtml = `
      <html>
        <head>
          <link rel="stylesheet" href="./style.css">
          <base href="https://example.com">
        </head>
      </html>
    `;
    (fetch as Mock).mockResolvedValueOnce({
      headers: new Headers({ 'Content-Type': 'text/html' }),
      ok: true,
      status: 200,
      text: async () => mockHtml,
    });

    // Mock the CSS request
    const mockCss = 'a { color: blue; }';
    (fetch as Mock).mockResolvedValueOnce(CSS_FILE_REPONSE_MOCK);

    const result = await getCssOrigins('https://example.com/very/deep/path/to/page');
    expect(result).toEqual([
      {
        css: mockCss,
        href: './style.css',
        media: undefined,
        rel: 'stylesheet',
        type: 'link',
        url: 'https://example.com/style.css',
      },
    ]);
  });

  test('strips wyback machine toolbar', async () => {
    // Mock the HTML request
    const mockCss = 'html { color: green; }';
    const mockHtml = `
      <!doctype>
      <html>
        <head><script type="text/javascript">
          __wm.init("https://web.archive.org/web");
          __wm.wombat("https://www.projectwallace.com/","20250307010338","https://web.archive.org/","web","https://web-static.archive.org/_static/",
                  "1741309418");
          </script>
          <link rel="stylesheet" type="text/css" href="https://web-static.archive.org/_static/css/banner-styles.css?v=p7PEIJWi" />
          <link rel="stylesheet" type="text/css" href="https://web-static.archive.org/_static/css/iconochive.css?v=3PDvdIFv" />
          <!-- End Wayback Rewrite JS Include -->
          <title>Hello World</title>
        </head>
        <body><!-- BEGIN WAYBACK TOOLBAR INSERT -->

          EVERYTHING IN BETWEEN HERE WILL BE REMOVED

          <script>console.log('test');</script>
          <style>${mockCss}</style>

          <!-- END WAYBACK TOOLBAR INSERT -->

          <h1>Hello World</h1>
          <style>${mockCss}</style>
        </body>
      </html>
    `;
    (fetch as Mock).mockResolvedValueOnce({
      headers: new Headers({ 'Content-Type': 'text/html' }),
      ok: true,
      status: 200,
      text: async () => mockHtml,
    });

    const result = await getCssOrigins('https://web.archive.org/web/20250311183954/https://example.com/');
    expect(result).toEqual([
      {
        css: mockCss,
        type: 'style',
        url: 'https://web.archive.org/web/20250311183954/https://example.com/',
      },
    ]);
  });

  describe('errors', () => {
    test('InvalidUrlError', async () => {
      await expect(getCssOrigins('')).rejects.toThrowError(InvalidUrlError);
    });

    test('NotFoundError', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });
      await expect(getCssOrigins('http://example.com')).rejects.toThrowError(NotFoundError);
    });

    test('ForbiddenError', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      });
      await expect(getCssOrigins('http://example.com')).rejects.toThrowError(ForbiddenError);
    });

    test('ConnectionRefusedError', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'fetch failed',
      });
      await expect(getCssOrigins('http://example.com')).rejects.toThrowError(ConnectionRefusedError);
    });

    test('ConnectionRefusedError (localhost)', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'fetch failed',
      });
      await expect(getCssOrigins('http://localhost:8080')).rejects.toThrowError(ConnectionRefusedError);
    });

    test('TimeoutError', async () => {
      (fetch as Mock).mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));
      await expect(getCssOrigins('http://example.com/style.css', { timeout: 0 })).rejects.toThrowError(TimeoutError);
    });
  });
});

describe('getCss', () => {
  test('concatenates origins', async () => {
    const mockCss = 'a { color: blue; }';
    (fetch as Mock).mockResolvedValueOnce(CSS_FILE_REPONSE_MOCK);
    const result = await getCss('example.com/style.css');
    expect(result).toBe(mockCss);
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

describe('getImportUrls', () => {
  describe('1 @import', () => {
    test('no url(), single quotes', () => {
      expect(getImportUrls(`@import 'test.css';`)).toEqual(['test.css']);
    });

    test('no url(), double quotes', () => {
      expect(getImportUrls(`@import "test.css";`)).toEqual(['test.css']);
    });

    test('url() w/o quotes', () => {
      expect(getImportUrls('@import url(test.css);')).toEqual(['test.css']);
    });

    test('url() w/ single quotes', () => {
      expect(getImportUrls(`@import url('test.css');`)).toEqual(['test.css']);
    });

    test('url() w/ double quotes', () => {
      expect(getImportUrls(`@import url("test.css");`)).toEqual(['test.css']);
    });
  });

  test('multiple @imports', () => {
    // examples from https://developer.mozilla.org/en-US/docs/Web/CSS/@import#examples
    const css = `
      @import "custom.css";
      @import url("chrome://communicator/skin/");
      @import "fine-print.css" print;
      @import "bluish.css" print, screen;
      @import "common.css" screen;
      @import "landscape.css" screen and (orientation: landscape);
    `;
    expect(getImportUrls(css)).toEqual([
      'custom.css',
      'chrome://communicator/skin/',
      'fine-print.css',
      'bluish.css',
      'common.css',
      'landscape.css',
    ]);
  });

  test('multiple consecutive (minified) @imports', () => {
    const css = '@import "custom1.css";@import "custom2.css";';
    expect(getImportUrls(css)).toEqual(['custom1.css', 'custom2.css']);
  });

  describe('with layer()', () => {
    test('@import with layer', () => {
      expect(getImportUrls(`@import url("test.css") layer;`)).toEqual(['test.css']);
    });

    test('@import url() layer(test)', () => {
      expect(getImportUrls(`@import url("test.css") layer(test);`)).toEqual(['test.css']);
    });

    test('@import url() layer(test.me.nested)', () => {
      expect(getImportUrls(`@import url("test.css") layer(test.me.nested);`)).toEqual(['test.css']);
    });
  });

  describe('with supports()', () => {
    test('@import url("test.css") supports(display: grid);', () => {
      expect(getImportUrls(`@import url("test.css") supports(display: grid);`)).toEqual(['test.css']);
    });
  });

  describe('with @media', () => {
    test('@import url("test.css") (min-width: 1000px);', () => {
      expect(getImportUrls('@import url("test.css") (min-width: 1000px);')).toEqual(['test.css']);
    });
  });

  describe('kitchen sink', () => {
    const imports = [
      '@import "test.css" layer supports(display: grid) (min-width: 30em);',
      '@import "test.css" layer() supports(display: grid) (min-width: 30em);',
      '@import "test.css" layer(test) supports(display: grid) (min-width: 30em);',
      '@import "test.css" layer(test.nested.layers) supports(display: grid) (min-width: 30em);',
      '@import "test.css" screen and (orientation: landscape);',
      '@import "test.css" supports(display: grid) screen and (width <= 400px);',
      '@import "test.css" supports((not (display: grid)) and (display: flex)) screen and (width <= 400px);',
      '@import "test.css" supports((selector(h2 > p)) and (font-tech(color-COLRv1)));',
    ];
    for (const imprt of imports) {
      test(imprt, () => {
        expect(getImportUrls(imprt)).toEqual(['test.css']);
      });
    }
  });

  describe('invalid CSS cases that we do not care about', () => {
    test('@import declared after a ruleset', () => {
      const css = `
        * {
          margin: 0;
          padding: 0;
        }
        /* more styles */
        @import "my-imported-styles.css";
      `;
      expect(getImportUrls(css)).toEqual(['my-imported-styles.css']);
    });

    test('nested @import in a conditional at-rule', () => {
      const css = `
        @media (max-width: 0) {
          @import url('test1.css');
        }

        @supports (display: grid) {
          @import url('test2.css');
        }
      `;
      expect(getImportUrls(css)).toEqual(['test1.css', 'test2.css']);
    });
  });
});

describe('getCssFile', () => {
  globalThis.fetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const REQUEST_HEADERS = {
    Accept: 'text/css,*/*;q=0.1',
    'User-Agent': 'NL Design System CSS Scraper/1.0',
  };

  test('it fetches CSS content successfully', async () => {
    const mockResponse = 'body { margin: 0; }';
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => mockResponse,
    });

    const controller = new AbortController();
    const result = await getCssFile('http://example.com/style.css', controller.signal);
    expect(fetch).toHaveBeenCalledWith('http://example.com/style.css', {
      headers: REQUEST_HEADERS,
      signal: controller.signal,
    });
    expect(result).toEqual(mockResponse);
  });

  test('it returns an empty string when the request fails', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
    });

    const controller = new AbortController();
    const result = await getCssFile('http://example.com/style.css', controller.signal);
    expect(result).toEqual('');
  });

  test('it returns an empty string when the request is aborted', async () => {
    (fetch as Mock).mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));

    const controller = new AbortController();
    controller.abort();

    const result = await getCssFile('http://example.com/style.css', controller.signal);
    expect(result).toEqual('');
  });
});

describe('getDesignTokens', () => {
  test('formats css into design tokens', () => {
    const mockCss = `
      a {
        color: blue;
        font-size: 16px;
        font-family: Arial, system-ui, sans-serif;
      }
    `;
    const result = getDesignTokens(mockCss);
    expect(result).toEqual([
      {
        $extensions: {
          'nl.designsystem.theme-wizard.css-authored-as': 'blue',
          'nl.designsystem.theme-wizard.css-properties': ['color'],
          'nl.designsystem.theme-wizard.token-id': 'blue-edec3e9a',
          'nl.designsystem.theme-wizard.usage-count': 1,
        },
        $type: 'color',
        $value: {
          alpha: 1,
          colorSpace: 'srgb',
          components: [0, 0, 1],
        },
      },
      {
        $extensions: {
          'nl.designsystem.theme-wizard.css-authored-as': 'Arial, system-ui, sans-serif',
          'nl.designsystem.theme-wizard.css-properties': ['font-family'],
          'nl.designsystem.theme-wizard.token-id': 'fontFamily-4aaee372',
          'nl.designsystem.theme-wizard.usage-count': 1,
        },
        $type: 'fontFamily',
        $value: ['Arial', 'system-ui', 'sans-serif'],
      },
      {
        $extensions: {
          'nl.designsystem.theme-wizard.css-authored-as': '16px',
          'nl.designsystem.theme-wizard.css-properties': ['font-size'],
          'nl.designsystem.theme-wizard.token-id': 'fontSize-171eed',
          'nl.designsystem.theme-wizard.usage-count': 1,
        },
        $type: 'dimension',
        $value: {
          unit: 'px',
          value: 16,
        },
      },
    ]);
  });
});

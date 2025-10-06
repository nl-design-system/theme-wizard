import { test, expect, describe } from 'vitest';
import { getCssFromHtml, getImportUrls } from './get-css';

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

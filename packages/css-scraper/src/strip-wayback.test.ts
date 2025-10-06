import { test, expect, describe } from 'vitest';
import { isWaybackUrl, removeWaybackToolbar } from './strip-wayback';

describe('isWaybackUrl', () => {
  test('valid cases', () => {
    const urls = [
      'https://web.archive.org/web/20250311183954/x', // invalid URL but not our concern
      'https://web.archive.org/web/20250311183954/https://www.projectwallace.com/',
      'https://web.archive.org/web/20250322053451/https://www.projectwallace.com/design-tokens',
      new URL('https://web.archive.org/web/20250311183954/https://www.projectwallace.com/'),
    ];
    for (const url of urls) {
      expect(isWaybackUrl(url)).toBeTruthy();
    }
  });

  test('invalid cases', () => {
    const urls = [
      '',
      'https://example.com',
      'https://archive.org/web/20250322053451/https://www.projectwallace.com/', // missing web. subdomain
      'https://web.archive.org/20250322053451/https://www.projectwallace.com/', // missing /web pathname
      'https://web.archive.org/web/2025032205345/https://www.projectwallace.com/', // incomplete timestamp in pathname
      'https://web.archive.org/web/20250322053451/', // missing data after trailing /
    ];
    for (const url of urls) {
      expect(isWaybackUrl(url)).toBeFalsy();
    }
  });
});

describe(`removeWaybackInsertions`, () => {
  test('removes toolbar html', () => {
    const html = `
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
          <style>html color: green; }</style>

          <!-- END WAYBACK TOOLBAR INSERT -->
          <h1>Hello World</h1>
        </body>
      </html>
    `;
    expect(removeWaybackToolbar(html).trim()).toEqual(
      `
      <!doctype>
      <html>
        <head>
          <title>Hello World</title>
        </head>
        <body>
          <h1>Hello World</h1>
        </body>
      </html>
    `.trim(),
    );
  });

  describe('leaves everything else intact', () => {
    test('no toolbar present', () => {
      const html = `
      <!doctype>
      <html>
        <head>
          <title>Hello World</title>
        </head>
        <body>
          <h1>Hello World</h1>
        </body>
      </html>
    `;
      expect(removeWaybackToolbar(html)).toEqual(html);
    });

    test('does not remove just any comment', () => {
      const html = `
      <p>Hello</p>
      <!-- this is my comment -->
      <p>ByeM/p>
    `;
      expect(removeWaybackToolbar(html)).toEqual(html);
    });
  });
});

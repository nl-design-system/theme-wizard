import maTokens from '@nl-design-system-community/ma-design-tokens/dist/tokens.json' with { type: 'json' };
import { test, expect } from './fixtures/fixtures';

test.beforeEach(async ({ minifyTokensPage }) => {
  await minifyTokensPage.goto();
});

test('page has accessibility basics', async ({ page }) => {
  // Has <title>
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');

  // Has a <h1>
  await expect.soft(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test.describe('interactive', () => {
  test.describe('valid input', () => {
    test.beforeEach(async ({ minifyTokensPage }) => {
      // maTokens.basis.text contains $extensions and Style Dictionary metadata (filePath, isSource, original, ...)
      // on its tokens, which makes it a good fixture for verifying minification.
      await minifyTokensPage.selectFile(JSON.stringify(maTokens.basis.text));
      await minifyTokensPage.minify();
      await expect(minifyTokensPage.resultOutput).toBeVisible();
    });

    test('Removes $extensions from tokens', async ({ minifyTokensPage }) => {
      const json = await minifyTokensPage.resultOutput.inputValue();
      const parsed = JSON.parse(json);
      expect(parsed['font-family'].default).not.toHaveProperty('$extensions');
      expect(json).not.toContain('$extensions');
    });

    test('Removes non-token metadata properties', async ({ minifyTokensPage }) => {
      const json = await minifyTokensPage.resultOutput.inputValue();
      const parsed = JSON.parse(json);
      expect(parsed['font-family'].default).not.toHaveProperty('filePath');
      expect(parsed['font-family'].default).not.toHaveProperty('isSource');
      expect(parsed['font-family'].default).not.toHaveProperty('original');
      expect(parsed['font-family'].default).not.toHaveProperty('name');
      expect(parsed['font-family'].default).not.toHaveProperty('attributes');
      expect(parsed['font-family'].default).not.toHaveProperty('path');
    });

    test('Keeps token $type and $value', async ({ minifyTokensPage }) => {
      const json = await minifyTokensPage.resultOutput.inputValue();
      const parsed = JSON.parse(json);
      expect(parsed['font-family'].default).toEqual({
        $type: 'fontFamily',
        $value: "'Source Sans Pro', Helvetica, Arial, sans-serif",
      });
    });

    test('Shows download button', async ({ minifyTokensPage }) => {
      await expect(minifyTokensPage.downloadButton).toBeVisible();
    });
  });
});

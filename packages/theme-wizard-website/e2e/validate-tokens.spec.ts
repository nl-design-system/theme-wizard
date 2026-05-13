import maTokens from '@nl-design-system-community/ma-design-tokens/dist/tokens.json' with { type: 'json' };
import { test, expect } from './fixtures/fixtures';

test.beforeEach(async ({ validateTokensPage }) => {
  await validateTokensPage.goto();
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
  test('Marks valid files as valid', async ({ validateTokensPage }) => {
    // Only validate a small sub-portion of the full theme for testing purposes.
    // Validating the full theme is too slow for Playwright + CI and times out
    await validateTokensPage.selectFile(JSON.stringify(maTokens.basis.text));
    await validateTokensPage.validate();

    await expect(validateTokensPage.resultOutput).toBeVisible();
    await expect.soft(validateTokensPage.resultOutput).not.toHaveAttribute('aria-invalid', 'true');
    await expect.soft(validateTokensPage.resultOutput).toHaveAccessibleDescription(/geen fouten gevonden/i);
  });

  test('Marks invalid files invalid', async ({ validateTokensPage }) => {
    await validateTokensPage.selectFile(
      JSON.stringify({ basis: { color: { 'box-shadow': { $type: 'color', $value: '#000000' } } } }),
    );
    await validateTokensPage.validate();

    await expect(validateTokensPage.resultOutput).toBeVisible();
    await expect.soft(validateTokensPage.resultOutput).toHaveAttribute('aria-invalid', 'true');
    await expect.soft(validateTokensPage.resultOutput).toHaveAccessibleDescription(/1 fout gevonden/i);
  });
});

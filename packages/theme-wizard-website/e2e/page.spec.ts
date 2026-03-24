import { test, expect } from './fixtures/fixtures';

test('page has accessibility basics', async ({ basisTokensPage }) => {
  await basisTokensPage.goto();

  // Has <title>
  const title = await basisTokensPage.page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(basisTokensPage.page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

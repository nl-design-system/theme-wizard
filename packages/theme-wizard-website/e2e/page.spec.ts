import { test, expect } from './fixtures/fixtures';

test('page has accessibility basics', async ({ basisTokens }) => {
  await basisTokens.goto();

  // Has <title>
  const title = await basisTokens.page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(basisTokens.page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

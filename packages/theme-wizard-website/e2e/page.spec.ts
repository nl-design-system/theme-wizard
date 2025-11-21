import { test, expect } from './fixtures/fixtures';

test('page has accessibility basics', async ({ themeWizard }) => {
  // Has <title>
  const title = await themeWizard.page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(themeWizard.page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

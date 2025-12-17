import { test, expect } from './fixtures/fixtures';

test('page has accessibility basics', async ({ themeWizard }) => {
  // Has <title>
  const title = await themeWizard.page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(themeWizard.page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

test('debug speed issue', async ({ page }) => {
  await page.goto('https://www.veneman.dev');
  await expect(page.getByRole('heading', { name: 'Bart Veneman' })).toBeVisible();
});

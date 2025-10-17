import { test, expect } from '@playwright/test';

test('page has accessibility basics', async ({ page }) => {
  await page.goto('/');

  // Has <title>
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

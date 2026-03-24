import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/components/code-block');
});

test('page has accessibility basics', async ({ page }) => {
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

test('shows sidebar with all components', async ({ page }) => {
  await expect(page.locator('wizard-sidebar-link')).not.toHaveCount(0);
});

test('page has <h1>', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveCount(0);
});

test('shows preset options', async ({ page }) => {
  await expect(page.locator('wizard-token-preset')).not.toHaveCount(0);
});

test('has link to component tokens page', async ({ page }) => {
  await expect(page.getByRole('link', { name: /alle component tokens/i })).toBeVisible();
});

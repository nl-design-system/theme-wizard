import { test, expect } from '@playwright/test';

test('page has accessibility basics', async ({ page }) => {
  await page.goto('/');

  // Has <title>
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

test('can change heading font to Courier New', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('theme-wizard-app');

  const select = page.locator(`theme-wizard-sidebar font-select[name="heading-font"] select`);
  await select.selectOption({ label: 'Courier New' });

  const heading = page.locator('theme-wizard-preview h1');
  await expect(heading).toHaveCSS('font-family', /Courier New/);
});

test('can change body font to Arial', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('theme-wizard-app');

  const select = page.locator(`theme-wizard-sidebar font-select[name="body-font"] select`);
  await select.selectOption({ label: 'Arial' });

  const paragraph = page.locator('theme-wizard-preview p').first();
  await expect(paragraph).toHaveCSS('font-family', /Arial/);
});

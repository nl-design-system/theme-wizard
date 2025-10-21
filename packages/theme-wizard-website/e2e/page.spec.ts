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

  const preview = page.getByRole('main');
  const heading = preview.getByRole('heading', { level: 1 });

  await expect(heading).toBeVisible();
  await expect(heading).not.toHaveCSS('font-family', /Courier New/);

  const select = page.getByLabel('Koppen');
  await select.selectOption({ label: 'Courier New' });

  await expect(heading).toHaveCSS('font-family', /Courier New/);
});

test('can change body font to Arial', async ({ page }) => {
  await page.goto('/');

  const preview = page.getByRole('main');
  const paragraph = preview.getByRole('paragraph').first();

  await expect(paragraph).toBeVisible();
  await expect(paragraph).not.toHaveCSS('font-family', /Arial/);

  const select = page.getByLabel('Lopende tekst');
  await select.selectOption({ label: 'Arial' });

  await expect(paragraph).toHaveCSS('font-family', /Arial/);
});

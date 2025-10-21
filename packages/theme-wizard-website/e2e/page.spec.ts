import { test, expect, type Locator } from '@playwright/test';

test('page has accessibility basics', async ({ page }) => {
  await page.goto('/');

  // Has <title>
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

test.describe('Behavioural tests', () => {
  let preview: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Wait for the preview rendering to complete before doing assertions on it
    preview = page.getByTestId('preview');
    await expect(preview).toBeVisible();
  });

  test('can change heading font to Courier New', async ({ page }) => {
    const heading = preview.getByRole('heading', { level: 1 });
    await expect(heading).not.toHaveCSS('font-family', /Courier New/);

    const select = page.getByLabel('Koppen');
    await select.selectOption({ label: 'Courier New' });

    await expect(heading).toHaveCSS('font-family', /Courier New/);
  });

  test('can change body font to Arial', async ({ page }) => {
    const paragraph = preview.getByRole('paragraph').first();
    await expect(paragraph).not.toHaveCSS('font-family', /Arial/);

    const select = page.getByLabel('Lopende tekst');
    await select.selectOption({ label: 'Arial' });

    await expect(paragraph).toHaveCSS('font-family', /Arial/);
  });
});

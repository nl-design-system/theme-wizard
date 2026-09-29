import { test, expect } from './fixtures/fixtures';

test.beforeEach(async ({ starterPickerPage }) => {
  await starterPickerPage.goto();
});

test('Accessibility basics', async ({ page }) => {
  // Has <title>
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl-NL');

  // Page has an <h1>
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
});

test('choosing "Met de huisstijl van een website" redirects to the scraper page', async ({ page, scraperPage }) => {
  await page.getByRole('link', { name: "Navigeer naar 'Huisstijl ophalen'" }).click();
  await expect(page).toHaveURL(new RegExp(scraperPage.url));
});

test('choosing "Met het Start Thema" redirects to the wizard page', async ({ page, wizardIndexPage }) => {
  await page.getByRole('link', { name: "Navigeer naar 'Start'" }).click();
  await expect(page).toHaveURL(new RegExp(wizardIndexPage.url));
});

test('choosing "Met een eigen thema" redirects to the theme upload page', async ({ page, uploadTokensPage }) => {
  await page.getByRole('link', { name: "Navigeer naar 'Thema uploaden'" }).click();
  await expect(page).toHaveURL(new RegExp(uploadTokensPage.url));
});

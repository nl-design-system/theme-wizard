import { test, expect } from './fixtures/fixtures';

test.beforeEach(async ({ scraperPage }) => {
  await scraperPage.goto();
});

test('Accessibility basics', async ({ page }) => {
  // Has <title>
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');

  // Has a <h1>
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('Allows going to the wizard without scraping', async ({ page, wizardIndexPage }) => {
  const link = page.getByRole('link', { name: 'Doorgaan zonder huisstijl ophalen' });
  await expect.soft(link).toBeVisible();
  await expect(link).toHaveAttribute('href', wizardIndexPage.url);
});

test.describe('scraping css design tokens', () => {
  // Never let more than one test run an actual HTTP request to the server
  test.describe.configure({ mode: 'serial' });

  test('scrapes a valid, absolute URL', async ({ page, scraperPage, stagingTokensPage }) => {
    // This test waits for the loaders to disappear after scraping, which takes several seconds
    test.slow();
    await scraperPage.scrapeUrl('https://theme-wizard.nl-design-system-community.nl');
    await expect(page).toHaveURL(new RegExp(stagingTokensPage.url), { timeout: 30_000 });
  });

  test('scrapes a valid, non-absolute URL', async ({ page, scraperPage, stagingTokensPage }) => {
    // This test waits for the loaders to disappear after scraping, which takes several seconds
    test.slow();
    await scraperPage.scrapeUrl('theme-wizard.nl-design-system-community.nl');
    await expect(page).toHaveURL(new RegExp(stagingTokensPage.url), { timeout: 30_000 });
  });

  test('errors on an invalid URL', async ({ scraperPage }) => {
    await scraperPage.scrapeUrl('https://.com');
    await expect.soft(scraperPage.input).toHaveAttribute('aria-invalid', 'true');
    await expect(scraperPage.input).toHaveAccessibleErrorMessage('Deze website lijkt niet te bestaan.');
  });

  test('errors when no URL is entered', async ({ scraperPage }) => {
    await scraperPage.scrapeUrl('');
    await expect.soft(scraperPage.input).toHaveAttribute('aria-invalid', 'true');
    await expect(scraperPage.input).toHaveAccessibleErrorMessage('Vul een valide URL in');
  });
});

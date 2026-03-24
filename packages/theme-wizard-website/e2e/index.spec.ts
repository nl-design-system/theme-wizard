import { test, expect } from './fixtures/fixtures';

test.beforeEach(async ({ homePage }) => {
  await homePage.goto();
});

test('Accessibility basics', async ({ page }) => {
  // Has <title>
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');

  // Has 1 <h1>
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test.describe('scraping css design tokens', () => {
  test('scrapes a valid, absolute URL', async ({ homePage, page }) => {
    // This test waits for the loaders to disappear after scraping, which takes several seconds
    test.slow();
    const navigationPromise = page.waitForEvent('load');
    await homePage.scrapeUrl('https://theme-wizard.nl-design-system-community.nl/');
    await navigationPromise;
    expect(page.url()).toContain('/staging-tokens');
  });

  test('scrapes a valid, non-absolute URL', async ({ homePage, page }) => {
    // This test waits for the loaders to disappear after scraping, which takes several seconds
    test.slow();
    const navigationPromise = page.waitForEvent('load');
    await homePage.scrapeUrl('theme-wizard.nl-design-system-community.nl/');
    await navigationPromise;
    expect(page.url()).toContain('/staging-tokens');
  });

  test('errors on an invalid URL', async ({ homePage }) => {
    await homePage.scrapeUrl('https://.com');
    await expect.soft(homePage.input).toHaveAttribute('aria-invalid', 'true');
    await expect.soft(homePage.input).toHaveAccessibleErrorMessage('Kan "https://.com" niet analyseren.');
  });

  test('errors when no URL is entered', async ({ homePage }) => {
    await homePage.scrapeUrl('');
    await expect.soft(homePage.input).toHaveAttribute('aria-invalid', 'true');
    await expect.soft(homePage.input).toHaveAccessibleErrorMessage('Vul een valide URL in');
  });
});

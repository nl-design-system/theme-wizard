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
});

test('"url" option is preselected by default', async ({ page }) => {
  const urlOption = page.getByRole('radio', { name: 'Met de huisstijl van een bestaande website' });
  await expect(urlOption).toBeChecked();
});

test('submitting without changing the selection redirects to the scraper page', async ({
  page,
  scraperPage,
  starterPickerPage,
}) => {
  await starterPickerPage.submitButton.click();
  await expect(page).toHaveURL(new RegExp(scraperPage.url));
});

test('choosing "Met de huisstijl van een bestaande website" redirects to the scraper page', async ({
  page,
  scraperPage,
  starterPickerPage,
}) => {
  await starterPickerPage.choose('Met de huisstijl van een bestaande website');
  await expect(page).toHaveURL(new RegExp(scraperPage.url));
});

test('choosing "Met het Start Thema" redirects to the wizard', async ({ page, starterPickerPage, wizardIndexPage }) => {
  await starterPickerPage.choose('Met het Start Thema');
  await expect(page).toHaveURL(new RegExp(wizardIndexPage.url));
});

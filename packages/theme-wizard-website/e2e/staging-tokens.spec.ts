import { test, expect } from './fixtures/fixtures';
import { storageStatePath } from './project-setup';

test.describe('after scraping a website', () => {
  // Before each of these tests we need a storage state that contains the localStorage with
  // scraped tokens. Falls back to empty state when setup hasn't run yet (e.g. first UI mode load).
  test.use({ storageState: storageStatePath });

  test.beforeEach(async ({ stagingTokensPage }) => {
    await stagingTokensPage.goto();
  });

  test('page has accessibility basics', async ({ page }) => {
    // Has <title>
    const title = await page.title();
    expect.soft(title).toBeTruthy();

    // Has document language specified
    await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');

    // Has a <h1>
    await expect.soft(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('page allows to go back to start', async ({ baseURL, homePage, page }) => {
    const link = page.getByRole('link', { name: 'Vorige stap' });
    await expect(link).toBeVisible();
    await link.click();
    expect(page.url()).toBe(baseURL + homePage.url);
  });

  test('page allows to skip staging and go to basis tokens', async ({ baseURL, basisTokensPage, page }) => {
    const link = page.getByRole('link', { name: 'Huisstijl vastleggen' }).first(); // there are 2 identical buttons on this page
    await expect.soft(link).toBeVisible();
    await link.click();
    expect(page.url()).toBe(baseURL + basisTokensPage.url);
  });

  test.describe('Shows tables with tokens', () => {
    test('Shows the tables', async ({ page }) => {
      const tables = page.getByRole('table');
      const tableNames = ['Lettertypes', 'Lettergroottes', 'Blauw'];
      expect.soft(await tables.count()).toBeGreaterThanOrEqual(tableNames.length);

      for (let i = 0; i < tableNames.length; i += 1) {
        const table = tables.nth(i);
        const caption = table.getByRole('caption');
        await expect.soft(caption).toHaveText(tableNames[i], { ignoreCase: true });
      }
    });

    test('Each table has 4 columns of data', async ({ page }) => {
      const tables = page.getByRole('table');
      const expectedHeaders = ['Geselecteerd', 'Voorvertoning', 'Waarde', 'Aantal'];

      for (const table of await tables.all()) {
        const headers = table.getByRole('columnheader');
        await expect.soft(headers).toHaveCount(expectedHeaders.length);
        await expect.soft(headers).toHaveText(expectedHeaders);
      }
    });

    test('Each table has at least one row', async ({ page }) => {
      const tables = page.getByRole('table');

      for (const table of await tables.all()) {
        const rows = table.locator('tbody').getByRole('row');
        expect.soft(await rows.count()).toBeGreaterThanOrEqual(1);
      }
    });

    test('All tokens are selected by default', async ({ page }) => {
      // This would be the CORRECT test, but it is very slow

      //  const tables = page.getByRole('table');
      // for (const table of await tables.all()) {
      //   const rows = table.locator('tbody').getByRole('row');

      //   for (const row of await rows.all()) {
      //     expect.soft(row.getByRole('checkbox')).toBeChecked();
      //   }
      // }

      // So we do this instead:
      // Check that the amount of checkboxes on the page matches the amount of checked checkboxes
      expect(await page.getByRole('checkbox').count()).toEqual(await page.locator('input:checked').count());
      expect(await page.locator('input:not(:checked)').count()).toBe(0);
    });
  });

  test('Token selection is persistent after reload', async ({ page }) => {
    const table = page.getByRole('table', { name: 'Lettertypes' });
    const input = table.getByRole('checkbox').first();

    await expect(input).toBeChecked();
    await input.uncheck();
    await page.reload();
    await expect(input).not.toBeChecked();
  });
});

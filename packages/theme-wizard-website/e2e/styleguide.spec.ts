import { test, expect } from '@playwright/test';

test('page has accessibility basics', async ({ page }) => {
  await page.goto('/style-guide');

  // Has <title>
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

test('page uses values as stored by the configuration page', async ({ page }) => {
  // Set Accent 1 to a bright red
  await page.goto('/');
  const accent1Input = page.getByLabel('Accent 1');
  await accent1Input.fill('#ff0000');
  await accent1Input.blur();

  // Style guide page uses the same storage and theme, thus showing a red-ish initial for accent-1.border-default
  await page.goto('/style-guide', { waitUntil: 'load' });
  await expect(page.getByRole('button', { name: '#ff0000' })).toBeVisible();
});

test.describe('interaction tests', () => {
  test.beforeEach(async ({ context, page }) => {
    // Enable clipboard access to we can test working of copy-to-clipboard buttons
    await context.grantPermissions(['clipboard-write', 'clipboard-read']);
    await page.goto('/style-guide', { waitUntil: 'load' });
    // Make sure to wait for page to be fully rendered
    await expect(page.getByRole('heading', { name: 'Stijlgids' })).toBeVisible();
  });

  test.describe('colors', () => {
    test('Shows a colors section', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Kleuren', level: 2 });
      await expect(heading).toBeVisible();

      const table = page.getByRole('table', { name: 'Accent 1' });
      await expect(table).toBeVisible();

      const rows = table.getByRole('row');
      expect(await rows.all()).toHaveLength(15); // 14 colors + 1 table header row
    });

    test('Token name can be copied to clipboard', async ({ page }) => {
      const tokenName = 'basis.color.accent-1.bg-hover';
      await page.getByRole('table', { name: 'Accent 1' }).getByRole('button', { name: tokenName }).click();
      const clipboardText = await page.evaluate(async () => {
        return await navigator.clipboard.readText();
      });
      expect(clipboardText).toBe(tokenName);
    });

    test('Token value can be copied to clipboard', async ({ page }) => {
      const tokenValue = '#fbfcfd';
      await page.getByRole('table', { name: 'Accent 1' }).getByRole('button', { name: tokenValue }).click();
      const clipboardText = await page.evaluate(async () => {
        return await navigator.clipboard.readText();
      });
      expect(clipboardText).toBe(tokenValue);
    });
  });

  test.describe('Typography', () => {
    test('Shows a typography section', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Typografie', level: 2 });
      expect(heading).toBeVisible();
    });

    test.describe('font-size', () => {
      test('Token name can be copied to clipboard', async ({ page }) => {
        const tokenName = 'basis.text.font-size.4xl';
        await page.getByRole('table', { name: 'Lettergroottes' }).getByRole('button', { name: tokenName }).click();
        const clipboardText = await page.evaluate(async () => {
          return await navigator.clipboard.readText();
        });
        expect(clipboardText).toBe(tokenName);
      });

      test('Token value can be copied to clipboard', async ({ page }) => {
        const tokenValue = '3rem';
        await page.getByRole('table', { name: 'Lettergroottes' }).getByRole('button', { name: tokenValue }).click();
        const clipboardText = await page.evaluate(async () => {
          return await navigator.clipboard.readText();
        });
        expect(clipboardText).toBe(tokenValue);
      });
    });

    test('shows a headings section', async ({ page }) => {
      const table = page.getByRole('table', { name: 'Headings' });
      await expect(table).toBeVisible();
      const rows = table.getByRole('row');
      expect(await rows.all()).toHaveLength(7); // 6 heading rows + 1 table header row
    });
  });

  test.describe('Spacing', () => {
    test('Shows a spacing section', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Witruimte', level: 2 });
      expect(heading).toBeVisible();
    });

    test('Token name can be copied to clipboard', async ({ page }) => {
      const tokenName = 'basis.space.block.6xl';
      await page.getByRole('table', { name: 'Block' }).getByRole('button', { name: tokenName }).click();
      const clipboardText = await page.evaluate(async () => {
        return await navigator.clipboard.readText();
      });
      expect(clipboardText).toBe(tokenName);
    });

    test('Token value can be copied to clipboard', async ({ page }) => {
      const tokenValue = '64px';
      await page.getByRole('table', { name: 'Block' }).getByRole('button', { name: tokenValue }).click();
      const clipboardText = await page.evaluate(async () => {
        return await navigator.clipboard.readText();
      });
      expect(clipboardText).toBe(tokenValue);
    });
  });
});

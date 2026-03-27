import type { Locator } from '@playwright/test';
import { test, expect } from './fixtures/fixtures';
import { storageStatePath } from './project-setup';

test('page has accessibility basics', async ({ basisTokensPage }) => {
  await basisTokensPage.goto();

  // Has <title>
  const title = await basisTokensPage.page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(basisTokensPage.page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

test.describe('change fonts', () => {
  // Make sure we have access to scraped tokens
  test.use({ storageState: storageStatePath });

  test('Shows all options from staging tokens in font dropdown', async ({
    basisTokensPage,
    page,
    stagingTokensPage,
  }) => {
    await stagingTokensPage.goto();
    const tbody = page.getByRole('table', { name: 'Lettertypes' }).locator('tbody');
    const stagedFamilies = await tbody.getByRole('code').allTextContents();

    await basisTokensPage.goto();
    await page.getByRole('button', { name: 'Typografie' }).click();
    const options = await basisTokensPage.getInputOptions('Koppen');
    const optionFamilies = (await options.allTextContents()).map((s) => s.trim());

    expect(optionFamilies).toEqual(expect.arrayContaining(stagedFamilies));
  });

  test('Unstaged font family is not shown in font dropdown', async ({ basisTokensPage, page, stagingTokensPage }) => {
    await stagingTokensPage.goto();
    const tbody = page.getByRole('table', { name: 'Lettertypes' }).locator('tbody');

    await tbody.getByRole('row').first().getByRole('checkbox').uncheck();
    const unstagedFamily = await tbody.getByRole('row').first().getByRole('code').textContent();

    await basisTokensPage.goto();
    await page.getByRole('button', { name: 'Typografie' }).click();
    const options = await basisTokensPage.getInputOptions('Koppen');
    const optionFamilies = (await options.allTextContents()).map((s) => s.trim());

    expect(optionFamilies).not.toContain(unstagedFamily);
  });

  test.describe('wizard page only', () => {
    test.beforeEach(async ({ basisTokensPage }) => {
      await basisTokensPage.goto();
      await basisTokensPage.page.getByRole('button', { name: 'Typografie' }).click();
    });

    test('can change heading font to Courier New on preview', async ({ basisTokensPage }) => {
      const heading = basisTokensPage.getHeading(2);
      await expect(heading).not.toHaveFont('Courier New');
      await basisTokensPage.changeHeadingFont('Courier New');
      await expect(heading).toHaveFont('Courier New');
    });

    test('can change body font to Courier New', async ({ basisTokensPage }) => {
      const paragraph = basisTokensPage.getParagraph();
      await expect(paragraph).not.toHaveFont('Courier New');
      await basisTokensPage.changeBodyFont('Courier New');
      await expect(paragraph).toHaveFont('Courier New');
    });
  });
});

test.describe('Download tokens', () => {
  test.beforeEach(async ({ basisTokensPage }) => {
    await basisTokensPage.goto();
  });

  test.describe('Download JSON', () => {
    test('initial button state is correct', async ({ basisTokensPage }) => {
      await expect(basisTokensPage.downloadJsonButton).toBeVisible();
      await expect(basisTokensPage.downloadJsonButton).toBeDisabled();
    });

    // Skipped because we can't set individual colors for contrast errors
    // TODO: re-enable when tackling component-level contrast warnings (https://github.com/nl-design-system/theme-wizard/issues/331)
    test.skip('does not show confirmation modal when there are no validation errors', async ({
      basisTokensPage,
      page,
    }) => {
      await basisTokensPage.changeColor('Accent 1', '#00238b');
      await expect(basisTokensPage.downloadJsonButton).toBeEnabled();

      const downloadPromise = page.waitForEvent('download');
      await basisTokensPage.downloadJsonButton.click();

      // Confirmation dialog for errors should not appear.
      const dialog = basisTokensPage.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
      await expect(dialog).toHaveCount(0);

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('tokens.json');
    });

    test.describe('download confirmation modal', () => {
      test.beforeEach(async ({ basisTokensPage }) => {
        await basisTokensPage.page.getByRole('button', { name: 'Kleuren' }).click();
        await basisTokensPage.changeColor('Accent 1', '#3d87f5');
        await basisTokensPage.page.getByRole('button', { name: 'Terug naar overzicht' }).click();
        await expect(basisTokensPage.downloadJsonButton).toBeEnabled();
      });

      test('opens when downloading with validation errors', async ({ basisTokensPage }) => {
        await basisTokensPage.downloadJsonButton.click();

        const dialog = basisTokensPage.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
        await expect(dialog).toBeVisible();
      });

      test('can cancel download from the modal', async ({ basisTokensPage }) => {
        await basisTokensPage.downloadJsonButton.click();

        const dialog = basisTokensPage.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
        await expect(dialog).toBeVisible();

        await basisTokensPage.page.getByRole('button', { name: 'Annuleren' }).click();
        await expect(dialog).not.toBeVisible();
      });

      test('can confirm download from the modal', async ({ basisTokensPage, page }) => {
        await basisTokensPage.downloadJsonButton.click();

        const dialog = basisTokensPage.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
        await expect(dialog).toBeVisible();

        const downloadPromise = page.waitForEvent('download');
        await basisTokensPage.page.getByRole('button', { name: 'Toch downloaden' }).click();
        const download = await downloadPromise;

        expect(download.suggestedFilename()).toBe('tokens.json');
        await expect(dialog).not.toBeVisible();
      });
    });

    test.describe('after changing a token', () => {
      test.beforeEach(async ({ basisTokensPage }) => {
        await basisTokensPage.page.getByRole('button', { name: 'Typografie' }).click();
        await basisTokensPage.changeBodyFont('system-ui');
        await basisTokensPage.page.getByRole('button', { name: 'Terug naar overzicht' }).click();
      });

      test('Button becomes active after changes made', async ({ basisTokensPage }) => {
        await expect(basisTokensPage.downloadJsonButton).toBeEnabled();
      });

      test('Button downloads JSON file after click', async ({ basisTokensPage, page }) => {
        const downloadPromise = page.waitForEvent('download');
        await basisTokensPage.downloadJsonButton.click();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toBe('tokens.json');
      });

      test('Button becomes inactive after "Reset tokens" is clicked', async ({ basisTokensPage }) => {
        await basisTokensPage.reset();
        await expect(basisTokensPage.downloadJsonButton).toBeDisabled();
      });

      test('Button remains enabled when validation errors are found', async ({ basisTokensPage }) => {
        await basisTokensPage.page.getByRole('button', { name: 'Kleuren' }).click();

        // Trigger a contrast warning
        await basisTokensPage.changeColor('Accent 1', '#3d87f5');
        await basisTokensPage.page.getByRole('button', { name: 'Terug naar overzicht' }).click();

        // The button should stay enabled, but show a confirmation dialog on click.
        await expect(basisTokensPage.downloadJsonButton).toBeEnabled();
      });

      test('Button is enabled when user made changes in previous session', async ({ basisTokensPage, page }) => {
        await page.reload();
        await expect(basisTokensPage.downloadJsonButton).toBeEnabled();
      });
    });
  });

  test.describe('Download CSS', () => {
    test('Can download the CSS', async ({ basisTokensPage, page }) => {
      await expect(basisTokensPage.downloadCssButton).toBeVisible();
      await expect(basisTokensPage.downloadCssButton).toBeEnabled();

      const downloadPromise = page.waitForEvent('download');
      await basisTokensPage.downloadCssButton.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('theme-wizard-tokens.css');
    });
  });
});

test.describe('color contrast warnings', () => {
  test.beforeEach(async ({ basisTokensPage }) => {
    await basisTokensPage.goto();
    await basisTokensPage.page.getByRole('button', { name: 'Kleuren' }).click();
  });

  test('No errors shown before making changes', async ({ basisTokensPage }) => {
    const errorAlert = basisTokensPage.getErrorAlert();
    await expect(errorAlert).not.toBeVisible();

    const input = basisTokensPage.sidebar.getByLabel('Accent 1');
    await expect(input).not.toHaveAttribute('aria-invalid');
  });

  // TODO: un-skip these tests once we know how to render feedback on the basis-tokens page's sidebar

  test.skip('shows in-place error message with the input when contrast is insufficient', async ({
    basisTokensPage,
  }) => {
    await basisTokensPage.changeColor('bg-active', '#000000');

    // Input itself is marked as invalid
    const input = basisTokensPage.sidebar.getByLabel('bg-active').first();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleErrorMessage(/Onvoldoende contrast/);
  });

  test.skip('remove errors when contrast issues are fixed', async ({ basisTokensPage }) => {
    const input = basisTokensPage.sidebar.getByLabel('bg-active').first();

    // Set invalid state
    await basisTokensPage.changeColor('bg-active', '#000000');

    await expect(input).toHaveAttribute('aria-invalid', 'true');

    // Restore to valid state
    await basisTokensPage.changeColor('bg-active', '#ffffff');

    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(input).not.toHaveAccessibleErrorMessage(/Onvoldoende contrast/);
  });
});

test.describe('printing the webpage', () => {
  test.beforeEach(async ({ basisTokensPage, page }) => {
    await page.emulateMedia({ media: 'print' });
    await basisTokensPage.goto();
  });

  test('prints the preview area', async ({ basisTokensPage }) => {
    await expect(basisTokensPage.preview).toBeVisible();
  });

  test('does not print the header and sidebar', async ({ basisTokensPage, page }) => {
    await expect(basisTokensPage.sidebar).not.toBeVisible();
    await expect(page.locator('.wizard-app__logo')).not.toBeVisible();
    await expect(page.locator('.wizard-app__nav')).not.toBeVisible();
  });
});

test.describe('colorscale inputs', () => {
  // Make sure we have access to scraped tokens
  test.use({ storageState: storageStatePath });

  const INITIAL_COLOR = '#1b59a4';

  test.beforeEach(async ({ basisTokensPage }) => {
    await basisTokensPage.goto();
    await basisTokensPage.page.getByRole('button', { name: 'Kleuren' }).click();
  });

  // Initial value matches Start Thema
  test('Initial value matches Start Thema', async ({ basisTokensPage }) => {
    const input = basisTokensPage.page.getByLabel('Accent 1');
    await expect(input).toHaveValue(INITIAL_COLOR);
  });

  test('Color options are taken from scraper results', async ({ basisTokensPage }) => {
    const options = await basisTokensPage.getInputOptions('Accent 1');
    expect.soft(await options.count()).toBeGreaterThanOrEqual(1);

    // Stop after N colors to not make the test too slow
    const MAX_OPTIONS_TO_CHECK = 50;
    let count = 0;

    for (const option of await options.all()) {
      if (count > MAX_OPTIONS_TO_CHECK) break;
      count += 1;

      const text = (await option.textContent())?.trim();
      // like `red`, `#ff0000`, `rgb(0, 0, 0)
      expect(text).toMatch(/^\w+$|^#[a-f0-9]{3,8}$|^rgba?\(.*/);
    }
  });

  test('Changing a scale updates the preview', async ({ basisTokensPage }) => {
    // The 'Home' link in the the navigation of the preview
    const breadcrumbLink = basisTokensPage.preview.getByRole('navigation').getByRole('link').first();
    const beforeColor = await breadcrumbLink.evaluate((element) =>
      globalThis.getComputedStyle(element).getPropertyValue('color'),
    );
    await basisTokensPage.changeColor('Actie 2', '#ff0000');
    const afterColor = await breadcrumbLink.evaluate((element) =>
      globalThis.getComputedStyle(element).getPropertyValue('color'),
    );
    expect(beforeColor).not.toBe(afterColor);
  });

  test('Reset restores value to initial value', async ({ basisTokensPage }) => {
    const input = basisTokensPage.page.getByLabel('Accent 1');
    await basisTokensPage.changeColor('Accent 1', '#ff0000');
    await basisTokensPage.page.getByRole('button', { name: 'Terug naar overzicht' }).click();
    await basisTokensPage.reset();
    await basisTokensPage.page.getByRole('button', { name: 'Kleuren' }).click();
    await expect(input).toHaveValue(INITIAL_COLOR);
  });

  test('Uses value from storage after refresh', async ({ basisTokensPage }) => {
    await basisTokensPage.changeColor('Accent 1', '#ff0000');
    await basisTokensPage.page.reload();
    await basisTokensPage.page.getByRole('button', { name: 'Kleuren' }).click();
    const input = basisTokensPage.page.getByLabel('Accent 1');
    await expect(input).toHaveValue('#ff0000');
  });

  test('Changing an individual token updates the attached colorscale input', async ({ basisTokensPage }) => {
    const initialStopValues = await basisTokensPage.getColorStops('Accent 1');

    await basisTokensPage.changeColor('Accent 1', '#ff0000');
    const updatedStopValues = await basisTokensPage.getColorStops('Accent 1');

    expect(updatedStopValues).toHaveLength(initialStopValues.length);
    expect(updatedStopValues).not.toEqual(initialStopValues);
    for (const value of updatedStopValues) {
      expect(initialStopValues).not.toContain(value);
    }
  });

  test('Changing Accent 1 also updates Accent 2', async ({ basisTokensPage }) => {
    const accent1Input = basisTokensPage.page.getByLabel('Accent 1');
    const accent2Input = basisTokensPage.page.getByLabel('Accent 2');

    // Start off equally
    expect.soft(accent1Input.inputValue).toEqual(accent2Input.inputValue);

    // Update Accent 1 and Accent 2 should follow automatically
    await basisTokensPage.changeColor('Accent 1', '#ff0000');
    await expect.soft(accent1Input).toHaveValue('#ff0000');
    await expect.soft(accent2Input).toHaveValue('#ff0000');
    expect
      .soft(await basisTokensPage.getColorStops('Accent 1'))
      .toEqual(await basisTokensPage.getColorStops('Accent 2'));
  });

  test.describe('Updating Accent 2 decouples it from Accent 1', () => {
    let accent1Input: Locator;
    let accent2Input: Locator;

    test.beforeEach(async ({ basisTokensPage }) => {
      accent1Input = basisTokensPage.page.getByLabel('Accent 1');
      accent2Input = basisTokensPage.page.getByLabel('Accent 2');

      // Update Accent-2 and check that it no londer matches Accent-1
      await basisTokensPage.changeColor('Accent 2', '#ff0000');
    });

    test('Accent 2 updates independently', async ({ basisTokensPage }) => {
      // Accent 1 and 2 should no longer be the same
      await expect.soft(accent1Input).not.toHaveValue('#ff0000');
      await expect.soft(accent2Input).toHaveValue('#ff0000');
      expect
        .soft(await basisTokensPage.getColorStops('Accent 1'))
        .not.toEqual(await basisTokensPage.getColorStops('Accent 2'));
    });

    test('Updating Accent 1 after Accent 2 keeps value of Accent 2 intact', async ({ basisTokensPage }) => {
      await basisTokensPage.changeColor('Accent 1', '#00ff00');

      await expect.soft(accent1Input).toHaveValue('#00ff00');
      await expect.soft(accent2Input).toHaveValue('#ff0000');
      expect
        .soft(await basisTokensPage.getColorStops('Accent 1'))
        .not.toEqual(await basisTokensPage.getColorStops('Accent 2'));
    });
  });
});

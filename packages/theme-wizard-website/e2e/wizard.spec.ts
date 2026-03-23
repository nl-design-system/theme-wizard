import { test, expect } from './fixtures/fixtures';

// Scraping tests skipped until we've figured out the UX flow with the redesign
// Should be done before 24-03-2026
test.describe.skip('scraping css design tokens', () => {
  test('scrapes a valid, absolute URL', async ({ basisTokens }) => {
    await basisTokens.scrapeUrl('https://nldesignsystem.nl/');
    const input = basisTokens.page.getByLabel('Website URL');
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(basisTokens.page.getByRole('status')).toBeVisible();
  });

  test('scrapes a valid, non-absolute URL', async ({ basisTokens }) => {
    await basisTokens.scrapeUrl('nldesignsystem.nl/');
    const input = basisTokens.page.getByLabel('Website URL');
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(basisTokens.page.getByRole('status')).toBeVisible();
  });

  test('errors on an invalid URL', async ({ basisTokens }) => {
    await basisTokens.scrapeUrl('https://.com');
    const input = basisTokens.page.getByLabel('Website URL');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleErrorMessage('Kan "https://.com/" niet analyseren');
  });

  test('errors when no URL is entered', async ({ basisTokens }) => {
    await basisTokens.scrapeUrl('');
    const input = basisTokens.page.getByLabel('Website URL');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleErrorMessage('Vul een valide URL in');
  });
});

test.describe('change fonts', () => {
  test.beforeEach(async ({ basisTokens }) => {
    await basisTokens.goto();
    await basisTokens.page.getByRole('button', { name: 'Typografie' }).click();
  });

  test('can change heading font to Courier New on preview', async ({ basisTokens }) => {
    const heading = basisTokens.getHeading(2);
    await expect(heading).not.toHaveFont('Courier New');
    await basisTokens.changeHeadingFont('Courier New');
    await expect(heading).toHaveFont('Courier New');
  });

  test('can change body font to Courier New', async ({ basisTokens }) => {
    const paragraph = basisTokens.getParagraph();
    await expect(paragraph).not.toHaveFont('Courier New');
    await basisTokens.changeBodyFont('Courier New');
    await expect(paragraph).toHaveFont('Courier New');
  });
});

test.describe('Download tokens', () => {
  test.beforeEach(async ({ basisTokens }) => {
    await basisTokens.goto();
  });

  test.describe('Download JSON', () => {
    test('initial button state is correct', async ({ basisTokens }) => {
      await expect(basisTokens.downloadJsonButton).toBeVisible();
      await expect(basisTokens.downloadJsonButton).toBeDisabled();
    });

    // Skipped because we can't set individual colors for contrast errors
    // TODO: re-enable when tackling component-level contrast warnings (https://github.com/nl-design-system/theme-wizard/issues/331)
    test.skip('does not show confirmation modal when there are no validation errors', async ({ basisTokens, page }) => {
      await basisTokens.changeColor('Accent 1', '#00238b');
      await expect(basisTokens.downloadJsonButton).toBeEnabled();

      const downloadPromise = page.waitForEvent('download');
      await basisTokens.downloadJsonButton.click();

      // Confirmation dialog for errors should not appear.
      const dialog = basisTokens.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
      await expect(dialog).toHaveCount(0);

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('tokens.json');
    });

    test.describe('download confirmation modal', () => {
      test.beforeEach(async ({ basisTokens }) => {
        await basisTokens.page.getByRole('button', { name: 'Kleuren' }).click();
        await basisTokens.changeColor('Accent 1', '#3d87f5');
        await basisTokens.page.getByRole('button', { name: 'Terug naar overzicht' }).click();
        await expect(basisTokens.downloadJsonButton).toBeEnabled();
      });

      test('opens when downloading with validation errors', async ({ basisTokens }) => {
        await basisTokens.downloadJsonButton.click();

        const dialog = basisTokens.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
        await expect(dialog).toBeVisible();
      });

      test('can cancel download from the modal', async ({ basisTokens }) => {
        await basisTokens.downloadJsonButton.click();

        const dialog = basisTokens.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
        await expect(dialog).toBeVisible();

        await basisTokens.page.getByRole('button', { name: 'Annuleren' }).click();
        await expect(dialog).not.toBeVisible();
      });

      test('can confirm download from the modal', async ({ basisTokens, page }) => {
        await basisTokens.downloadJsonButton.click();

        const dialog = basisTokens.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
        await expect(dialog).toBeVisible();

        const downloadPromise = page.waitForEvent('download');
        await basisTokens.page.getByRole('button', { name: 'Toch downloaden' }).click();
        const download = await downloadPromise;

        expect(download.suggestedFilename()).toBe('tokens.json');
        await expect(dialog).not.toBeVisible();
      });
    });

    test.describe('after changing a token', () => {
      test.beforeEach(async ({ basisTokens }) => {
        await basisTokens.page.getByRole('button', { name: 'Typografie' }).click();
        await basisTokens.changeBodyFont('system-ui');
        await basisTokens.page.getByRole('button', { name: 'Terug naar overzicht' }).click();
      });

      test('Button becomes active after changes made', async ({ basisTokens }) => {
        await expect(basisTokens.downloadJsonButton).toBeEnabled();
      });

      test('Button downloads JSON file after click', async ({ basisTokens, page }) => {
        const downloadPromise = page.waitForEvent('download');
        await basisTokens.downloadJsonButton.click();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toBe('tokens.json');
      });

      test('Button becomes inactive after "Reset tokens" is clicked', async ({ basisTokens }) => {
        await basisTokens.reset();
        await expect(basisTokens.downloadJsonButton).toBeDisabled();
      });

      test('Button remains enabled when validation errors are found', async ({ basisTokens }) => {
        await basisTokens.page.getByRole('button', { name: 'Kleuren' }).click();

        // Trigger a contrast warning
        await basisTokens.changeColor('Accent 1', '#3d87f5');
        await basisTokens.page.getByRole('button', { name: 'Terug naar overzicht' }).click();

        // The button should stay enabled, but show a confirmation dialog on click.
        await expect(basisTokens.downloadJsonButton).toBeEnabled();
      });

      test('Button is enabled when user made changes in previous session', async ({ basisTokens, page }) => {
        await page.reload();
        await expect(basisTokens.downloadJsonButton).toBeEnabled();
      });
    });
  });

  test.describe('Download CSS', () => {
    test('Can download the CSS', async ({ basisTokens, page }) => {
      await expect(basisTokens.downloadCssButton).toBeVisible();
      await expect(basisTokens.downloadCssButton).toBeEnabled();

      const downloadPromise = page.waitForEvent('download');
      await basisTokens.downloadCssButton.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('theme-wizard-tokens.css');
    });
  });
});

test.describe('color contrast warnings', () => {
  test.beforeEach(async ({ basisTokens }) => {
    await basisTokens.goto();
    await basisTokens.page.getByRole('button', { name: 'Kleuren' }).click();
  });

  test('No errors shown before making changes', async ({ basisTokens }) => {
    const errorAlert = basisTokens.getErrorAlert();
    await expect(errorAlert).not.toBeVisible();

    const input = basisTokens.sidebar.getByLabel('Accent 1');
    await expect(input).not.toHaveAttribute('aria-invalid');
  });

  // TODO: un-skip these tests once we know how to render feedback on the basis-tokens page's sidebar

  test.skip('shows in-place error message with the input when contrast is insufficient', async ({ basisTokens }) => {
    await basisTokens.changeColor('bg-active', '#000000');

    // Input itself is marked as invalid
    const input = basisTokens.sidebar.getByLabel('bg-active').first();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleErrorMessage(/Onvoldoende contrast/);
  });

  test.skip('remove errors when contrast issues are fixed', async ({ basisTokens }) => {
    const input = basisTokens.sidebar.getByLabel('bg-active').first();

    // Set invalid state
    await basisTokens.changeColor('bg-active', '#000000');

    await expect(input).toHaveAttribute('aria-invalid', 'true');

    // Restore to valid state
    await basisTokens.changeColor('bg-active', '#ffffff');

    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(input).not.toHaveAccessibleErrorMessage(/Onvoldoende contrast/);
  });
});

test.describe('printing the webpage', () => {
  test.beforeEach(async ({ basisTokens, page }) => {
    await page.emulateMedia({ media: 'print' });
    await basisTokens.goto();
  });

  test('prints the preview area', async ({ basisTokens }) => {
    await expect(basisTokens.preview).toBeVisible();
  });

  test('does not print the header and sidebar', async ({ basisTokens, page }) => {
    await expect(basisTokens.sidebar).not.toBeVisible();
    await expect(page.locator('.wizard-app__logo')).not.toBeVisible();
    await expect(page.locator('.wizard-app__nav')).not.toBeVisible();
  });
});

test.describe('colorscale inputs', () => {
  const INITIAL_COLOR = '#1b59a4';

  test.beforeEach(async ({ basisTokens }) => {
    await basisTokens.goto();
    await basisTokens.page.getByRole('button', { name: 'Kleuren' }).click();
  });

  // Initial value matches Start Thema
  test('Initial value matches Start Thema', async ({ basisTokens }) => {
    const input = basisTokens.page.getByLabel('Accent 1');
    await expect(input).toHaveValue(INITIAL_COLOR);
  });

  test('Changing a scale updates the preview', async ({ basisTokens }) => {
    // The 'Home' link in the the breadcrumb of the preview
    const breadcrumbLink = basisTokens.preview.getByRole('navigation').getByRole('link').first();
    const beforeColor = await breadcrumbLink.evaluate((element) =>
      globalThis.getComputedStyle(element).getPropertyValue('color'),
    );
    await basisTokens.changeColor('Actie 2', '#ff0000');
    const afterColor = await breadcrumbLink.evaluate((element) =>
      globalThis.getComputedStyle(element).getPropertyValue('color'),
    );
    expect(beforeColor).not.toBe(afterColor);
  });

  test('Reset restores value to initial value', async ({ basisTokens }) => {
    const input = basisTokens.page.getByLabel('Accent 1');
    await basisTokens.changeColor('Accent 1', '#ff0000');
    await basisTokens.page.getByRole('button', { name: 'Terug naar overzicht' }).click();
    await basisTokens.reset();
    await basisTokens.page.getByRole('button', { name: 'Kleuren' }).click();
    await expect(input).toHaveValue(INITIAL_COLOR);
  });

  test('Uses value from storage after refresh', async ({ basisTokens }) => {
    const input = basisTokens.page.getByLabel('Accent 1');
    await basisTokens.changeColor('Accent 1', '#ff0000');
    await basisTokens.page.reload();
    await basisTokens.page.getByRole('button', { name: 'Kleuren' }).click();
    // This is the mid-range darker red that the input stores (it does not store the user's actual picked color)
    await expect(input).toHaveValue('#ff0000');
  });

  test('Changing value updates individual color inputs ("All tokens")', async ({ basisTokens }) => {
    const input = basisTokens.sidebar.getByLabel('Accent 1');
    await expect(input).toHaveValue(INITIAL_COLOR);
    await basisTokens.changeColor('Accent 1', '#ff0000');
    await expect(input).not.toHaveValue(INITIAL_COLOR);
  });

  // This does not work yet
  test.skip('Changing an individual token updates the attached colorscale input', () => {});
});

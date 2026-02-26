import { test, expect } from './fixtures/fixtures';

test.describe('scraping css design tokens', () => {
  test('scrapes a valid, absolute URL', async ({ themeWizard }) => {
    await themeWizard.scrapeUrl('https://nldesignsystem.nl/');
    const input = themeWizard.page.getByLabel('Website URL');
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(themeWizard.page.getByRole('status')).toBeVisible();
  });

  test('scrapes a valid, non-absolute URL', async ({ themeWizard }) => {
    await themeWizard.scrapeUrl('nldesignsystem.nl/');
    const input = themeWizard.page.getByLabel('Website URL');
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(themeWizard.page.getByRole('status')).toBeVisible();
  });

  test('errors on an invalid URL', async ({ themeWizard }) => {
    await themeWizard.scrapeUrl('https://.com');
    const input = themeWizard.page.getByLabel('Website URL');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleErrorMessage('Kan "https://.com/" niet analyseren');
  });

  test('errors when no URL is entered', async ({ themeWizard }) => {
    await themeWizard.scrapeUrl('');
    const input = themeWizard.page.getByLabel('Website URL');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleErrorMessage('Vul een valide URL in');
  });
});

test.describe('change fonts', () => {
  // TODO: remove .skip when https://github.com/nl-design-system/theme-wizard/pull/556 is merged
  test.skip('can change heading font to Courier New on preview', async ({ previewPage }) => {
    const heading = previewPage.getHeading(2);
    await expect(heading).not.toHaveFont('Courier New');
    await previewPage.changeHeadingFont('Courier New');
    await expect(heading).toHaveFont('Courier New');
  });

  test('can change body font to Arial', async ({ previewPage }) => {
    const paragraph = previewPage.getParagraph();
    await expect(paragraph).not.toHaveFont('Arial');
    await previewPage.changeBodyFont('Arial');
    await expect(paragraph).toHaveFont('Arial');
  });
});

test.describe('Download tokens as JSON', () => {
  test('initial button state is correct', async ({ themeWizard }) => {
    await expect(themeWizard.downloadButton).toBeVisible();
    await expect(themeWizard.downloadButton).toBeDisabled();
  });

  test('does not show confirmation modal when there are no validation errors', async ({ page, themeWizard }) => {
    await themeWizard.changeColor('Accent 1', '#00238b');
    await expect(themeWizard.downloadButton).toBeEnabled();

    const downloadPromise = page.waitForEvent('download');
    await themeWizard.downloadButton.click();

    // Confirmation dialog for errors should not appear.
    const dialog = themeWizard.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
    await expect(dialog).toHaveCount(0);

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('tokens.json');
  });

  test.describe('download confirmation modal', () => {
    test.beforeEach(async ({ themeWizard }) => {
      await themeWizard.changeColor('Accent 1', '#3d87f5');
      await expect(themeWizard.downloadButton).toBeEnabled();
    });

    test('opens when downloading with validation errors', async ({ themeWizard }) => {
      await themeWizard.downloadButton.click();

      const dialog = themeWizard.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
      await expect(dialog).toBeVisible();
    });

    test('can cancel download from the modal', async ({ themeWizard }) => {
      await themeWizard.downloadButton.click();

      const dialog = themeWizard.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
      await expect(dialog).toBeVisible();

      await themeWizard.page.getByRole('button', { name: 'Annuleren' }).click();
      await expect(dialog).not.toBeVisible();
    });

    test('can confirm download from the modal', async ({ page, themeWizard }) => {
      await themeWizard.downloadButton.click();

      const dialog = themeWizard.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
      await expect(dialog).toBeVisible();

      const downloadPromise = page.waitForEvent('download');
      await themeWizard.page.getByRole('button', { name: 'Toch downloaden' }).click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe('tokens.json');
      await expect(dialog).not.toBeVisible();
    });
  });

  test.describe('after changing a token', () => {
    test.beforeEach(async ({ themeWizard }) => {
      await themeWizard.changeBodyFont('system-ui');
    });

    test('Button becomes active after changes made', async ({ themeWizard }) => {
      await expect(themeWizard.downloadButton).toBeEnabled();
    });

    test('Button downloads JSON file after click', async ({ page, themeWizard }) => {
      const downloadPromise = page.waitForEvent('download');
      await themeWizard.downloadButton.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('tokens.json');
    });

    test('Button becomes inactive after "Reset tokens" is clicked', async ({ themeWizard }) => {
      await themeWizard.reset();
      await expect(themeWizard.downloadButton).toBeDisabled();
    });

    test('Button remains enabled when validation errors are found', async ({ themeWizard }) => {
      // Trigger a contrast warning
      await themeWizard.changeColor('Accent 1', '#3d87f5');

      // The button should stay enabled, but show a confirmation dialog on click.
      await expect(themeWizard.downloadButton).toBeEnabled();
    });

    test('Button is enabled when user made changes in previous session', async ({ page, themeWizard }) => {
      await page.reload();
      await expect(themeWizard.downloadButton).toBeEnabled();
    });
  });
});

test.describe('color contrast warnings', () => {
  test('No errors shown before making changes', async ({ themeWizard }) => {
    const errorAlert = themeWizard.getErrorAlert();
    await expect(errorAlert).not.toBeVisible();

    const input = themeWizard.sidebar.getByLabel('Accent 1');
    await expect(input).not.toHaveAttribute('aria-invalid');
  });

  // TODO: un-skip these tests once we know how to render feedback on the basis-tokens page's sidebar

  test.skip('shows in-place error message with the input when contrast is insufficient', async ({ themeWizard }) => {
    await themeWizard.changeColor('bg-active', '#000000');

    // Input itself is marked as invalid
    const input = themeWizard.sidebar.getByLabel('bg-active').first();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleErrorMessage(/Onvoldoende contrast/);
  });

  test.skip('remove errors when contrast issues are fixed', async ({ themeWizard }) => {
    const input = themeWizard.sidebar.getByLabel('bg-active').first();

    // Set invalid state
    await themeWizard.changeColor('bg-active', '#000000');

    await expect(input).toHaveAttribute('aria-invalid', 'true');

    // Restore to valid state
    await themeWizard.changeColor('bg-active', '#ffffff');

    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(input).not.toHaveAccessibleErrorMessage(/Onvoldoende contrast/);
  });
});

test.describe('printing the webpage', () => {
  test.beforeEach(({ page }) => {
    page.emulateMedia({ media: 'print' });
  });

  test('prints the preview area', async ({ themeWizard }) => {
    await expect(themeWizard.preview).toBeVisible();
  });

  test('does not print the header and sidebar', async ({ page, themeWizard }) => {
    await expect(themeWizard.sidebar).not.toBeVisible();
    await expect(page.locator('.wizard-app__logo')).not.toBeVisible();
    await expect(page.locator('.wizard-app__nav')).not.toBeVisible();
  });
});

test.describe('colorscale inputs', () => {
  const INITIAL_COLOR = '#1b59a4';

  // Initial value matches Start Thema
  test('Initial value matches Start Thema', async ({ themeWizard }) => {
    const input = themeWizard.page.getByLabel('Accent 1');
    await expect(input).toHaveValue(INITIAL_COLOR);
  });

  test('Changing a scale updates the preview', async ({ themeWizard }) => {
    // The 'Home' link in the the breadcrumb of the preview
    const breadcrumbLink = themeWizard.preview.getByRole('navigation').getByRole('link').first();
    const beforeColor = await breadcrumbLink.evaluate((element) =>
      globalThis.getComputedStyle(element).getPropertyValue('color'),
    );
    await themeWizard.changeColor('Actie 2', '#ff0000');
    const afterColor = await breadcrumbLink.evaluate((element) =>
      globalThis.getComputedStyle(element).getPropertyValue('color'),
    );
    expect(beforeColor).not.toBe(afterColor);
  });

  test('Reset restores value to initial value', async ({ themeWizard }) => {
    const input = themeWizard.page.getByLabel('Accent 1');
    await themeWizard.changeColor('Accent 1', '#ff0000');
    await themeWizard.reset();
    expect(input).toHaveValue(INITIAL_COLOR);
  });

  test('Uses value from storage after refresh', async ({ themeWizard }) => {
    const input = themeWizard.page.getByLabel('Accent 1');
    await themeWizard.changeColor('Accent 1', '#ff0000');
    await themeWizard.page.reload();
    // This is the mid-range darker red that the input stores (it does not store the user's actual picked color)
    await expect(input).toHaveValue('#8b0000');
  });

  test('Changing value updates individual color inputs ("All tokens")', async ({ themeWizard }) => {
    const input = themeWizard.sidebar.getByLabel('Accent 1');
    await expect(input).toHaveValue(INITIAL_COLOR);
    await themeWizard.changeColor('Accent 1', '#ff0000');
    await expect(input).not.toHaveValue(INITIAL_COLOR);
  });

  // This does not work yet
  test.skip('Changing an individual token updates the attached colorscale input', () => {});
});

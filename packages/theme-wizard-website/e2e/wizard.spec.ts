import { test, expect } from './fixtures/fixtures';

test('can change heading font to Courier New on preview', async ({ previewPage }) => {
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

test.describe('Download tokens as JSON', () => {
  test('initial button state is correct', async ({ themeWizard }) => {
    await expect(themeWizard.downloadButton).toBeVisible();
    await expect(themeWizard.downloadButton).toBeDisabled();
  });

  test.describe('after changing a token', () => {
    test.beforeEach(async ({ themeWizard }) => {
      await themeWizard.changeBodyFont('Arial');
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

    test('Button is disabled when validation errors are found', async ({ themeWizard }) => {
      // Make sure the color inputs are visible so we can interact with them
      await themeWizard.sidebar.locator('summary').click();
      // Trigger a contrast warning
      await themeWizard.changeColor('{basis.color.accent-1.bg-active}', '#000000');

      await expect(themeWizard.downloadButton).toBeDisabled();
    });

    test('Button is enabled when user made changes in previous session', async ({ page, themeWizard }) => {
      await page.reload();
      await expect(themeWizard.downloadButton).toBeEnabled();
    });
  });
});

test.describe('color contrast warnings', () => {
  test.beforeEach(async ({ themeWizard }) => {
    // Make sure the <details> containing all color inputs is shown (<wizard-token-field>)
    await themeWizard.sidebar.locator('summary').click();
  });

  test('No errors shown before making changes', async ({ themeWizard }) => {
    const errorAlert = themeWizard.getErrorAlert();
    await expect(errorAlert).not.toBeVisible();

    const input = themeWizard.sidebar.getByLabel('{basis.color.accent-1.bg-active}');
    await expect(input).not.toHaveAttribute('aria-invalid');
  });

  test('shows an error alert when contrast is insufficient', async ({ themeWizard }) => {
    await themeWizard.changeColor('{basis.color.accent-1.bg-active}', '#000000');

    const errorAlert = themeWizard.getErrorAlert();
    await expect(errorAlert).toBeVisible();

    // Make sure the actual errors are visible by opening the details
    await errorAlert.locator('summary').click();
    const errors = errorAlert.getByRole('listitem');
    await expect(errors).toHaveCount(2);
  });

  test('shows in-place error message with the input when contrast is insufficient', async ({ themeWizard }) => {
    await themeWizard.changeColor('{basis.color.accent-1.bg-active}', '#000000');

    // Input itself is marked as invalid
    const input = themeWizard.sidebar.getByLabel('{basis.color.accent-1.bg-active}');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleErrorMessage(/Onvoldoende contrast/);
  });

  test('remove errors when contrast issues are fixed', async ({ themeWizard }) => {
    const input = themeWizard.sidebar.getByLabel('{basis.color.accent-1.bg-active}');
    const errorAlert = themeWizard.getErrorAlert();

    // Set invalid state
    await themeWizard.changeColor('{basis.color.accent-1.bg-active}', '#000000');

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(errorAlert).toBeVisible();

    // Restore to valid state
    await themeWizard.changeColor('{basis.color.accent-1.bg-active}', '#ffffff');

    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(input).not.toHaveAccessibleErrorMessage(/Onvoldoende contrast/);
    await expect(errorAlert).not.toBeVisible();
  });
});

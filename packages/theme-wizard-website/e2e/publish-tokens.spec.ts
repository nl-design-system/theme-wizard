import type { WizardStepFormPage } from './pages/WizardStepFormPage';
import { test, expect } from './fixtures/fixtures';

// Only changes typography — never trips a validation error, so the confirmation modal stays out of these tests.
const BODY_FONT_STEP = '/wizard/basis-text-font-family-default';
// Changing this background color always produces contrast errors elsewhere in the theme.
const ACTION_1_BG_STEP = '/wizard/basis-color-action-1-inverse-bg-default';

/** Selects the last option on the current step-form page and saves it. */
async function selectLastOption(wizardStepFormPage: WizardStepFormPage) {
  const label = await wizardStepFormPage.getOptionLabel(wizardStepFormPage.options.last());
  await wizardStepFormPage.optionCard(label).click();
  await wizardStepFormPage.save();
}

test.describe('Download JSON', () => {
  test('initial button state is correct', async ({ publishPage }) => {
    await publishPage.goto();
    await expect(publishPage.downloadJsonButton).toBeVisible();
    await expect(publishPage.downloadJsonButton).toBeDisabled();
  });

  test('does not show confirmation modal when there are no validation errors', async ({
    page,
    publishPage,
    wizardStepFormPage,
  }) => {
    await wizardStepFormPage.goto(BODY_FONT_STEP);
    await selectLastOption(wizardStepFormPage);

    await publishPage.goto();
    await expect(publishPage.downloadJsonButton).toBeEnabled();

    const downloadPromise = page.waitForEvent('download');
    await publishPage.downloadJsonButton.click();

    // Confirmation dialog for errors should not appear.
    const dialog = publishPage.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
    await expect(dialog).toHaveCount(0);

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('tokens.json');
  });

  test.describe('download confirmation modal', () => {
    test.beforeEach(async ({ publishPage, wizardStepFormPage }) => {
      await wizardStepFormPage.goto(ACTION_1_BG_STEP);
      await selectLastOption(wizardStepFormPage);

      await publishPage.goto();
      await expect(publishPage.downloadJsonButton).toBeEnabled();
    });

    test('opens when downloading with validation errors', async ({ publishPage }) => {
      await publishPage.downloadJsonButton.click();

      const dialog = publishPage.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
      await expect(dialog).toBeVisible();
    });

    test('can cancel download from the modal', async ({ publishPage }) => {
      await publishPage.downloadJsonButton.click();

      const dialog = publishPage.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
      await expect(dialog).toBeVisible();

      await publishPage.page.getByRole('button', { name: 'Annuleren' }).click();
      await expect(dialog).not.toBeVisible();
    });

    test('can confirm download from the modal', async ({ page, publishPage }) => {
      await publishPage.downloadJsonButton.click();

      const dialog = publishPage.page.getByRole('dialog', { name: 'Thema bevat nog fouten' });
      await expect(dialog).toBeVisible();

      const downloadPromise = page.waitForEvent('download');
      await publishPage.page.getByRole('button', { name: 'Toch downloaden' }).click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe('tokens.json');
      await expect(dialog).not.toBeVisible();
    });
  });

  test.describe('after changing a token', () => {
    test.beforeEach(async ({ wizardStepFormPage }) => {
      await wizardStepFormPage.goto(BODY_FONT_STEP);
      await selectLastOption(wizardStepFormPage);
    });

    test('Button becomes active after changes made', async ({ publishPage }) => {
      await publishPage.goto();
      await expect(publishPage.downloadJsonButton).toBeEnabled();
    });

    test('Button downloads JSON file after click', async ({ page, publishPage }) => {
      await publishPage.goto();
      const downloadPromise = page.waitForEvent('download');
      await publishPage.downloadJsonButton.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('tokens.json');
    });

    test('Button becomes inactive after "Reset tokens" is clicked', async ({ publishPage }) => {
      await publishPage.goto();
      await publishPage.reset();
      await expect(publishPage.downloadJsonButton).toBeDisabled();
    });

    test('Button remains enabled when validation errors are found', async ({ publishPage, wizardStepFormPage }) => {
      // Trigger a contrast warning
      await wizardStepFormPage.goto(ACTION_1_BG_STEP);
      await selectLastOption(wizardStepFormPage);

      // The button should stay enabled, but show a confirmation dialog on click.
      await publishPage.goto();
      await expect(publishPage.downloadJsonButton).toBeEnabled();
    });

    test('Button is enabled when user made changes in previous session', async ({ page, publishPage }) => {
      await publishPage.goto();
      await page.reload();
      await expect(publishPage.downloadJsonButton).toBeEnabled();
    });
  });
});

test.describe('Download CSS', () => {
  test('Can download the CSS', async ({ page, publishPage }) => {
    await publishPage.goto();
    await expect(publishPage.downloadCssButton).toBeVisible();
    await expect(publishPage.downloadCssButton).toBeEnabled();

    const downloadPromise = page.waitForEvent('download');
    await publishPage.downloadCssButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('theme-wizard-tokens.css');
  });
});

import { test, expect } from './fixtures/fixtures';
import { storageStatePath } from './project-setup';

test.describe('basis text font family (theme values)', () => {
  test('shows suggested theme values', async ({ wizardStepFormPage }) => {
    await wizardStepFormPage.goto();

    // This legend text is only shown when using theme fallback values
    await expect(wizardStepFormPage.legend).toHaveText('Voorgestelde waardes');
    await expect(wizardStepFormPage.options).toHaveCount(2);
    await expect(
      wizardStepFormPage.page.getByRole('radio', { name: '"IBM Plex Sans",sans-serif', exact: true }),
    ).toBeChecked();
  });

  test('can select an option, save it, and keep the selection after reload', async ({ wizardStepFormPage }) => {
    await wizardStepFormPage.goto();

    const lastLabel = await wizardStepFormPage.getOptionLabel(wizardStepFormPage.options.last());
    await wizardStepFormPage.optionCard(lastLabel).click();

    await wizardStepFormPage.save();
    await wizardStepFormPage.goto();

    // Using `exact:true` just in case we have options like `Arial, sans-serif` and `sans-serif`
    await expect(wizardStepFormPage.page.getByRole('radio', { name: lastLabel, exact: true })).toBeChecked();
  });
});

test.describe('basis text font family (scraped values)', () => {
  // Make sure we have access to scraped tokens
  test.use({ storageState: storageStatePath });

  test('shows multiple options based on scraped tokens', async ({ wizardStepFormPage }) => {
    await wizardStepFormPage.goto();

    await expect(wizardStepFormPage.legend).toHaveText('Gevonden waardes op website');
    await expect(wizardStepFormPage.options).toHaveCount(6);
  });

  test('can select a scraped option, save it, and keep the selection after reload', async ({ wizardStepFormPage }) => {
    await wizardStepFormPage.goto();

    const firstLabel = await wizardStepFormPage.getOptionLabel(wizardStepFormPage.options.first());
    await wizardStepFormPage.optionCard(firstLabel).click();

    await wizardStepFormPage.save();
    await wizardStepFormPage.goto();

    // Using `exact:true` just in case we have options like `Arial, sans-serif` and `sans-serif`
    await expect(wizardStepFormPage.page.getByRole('radio', { name: firstLabel, exact: true })).toBeChecked();
  });
});

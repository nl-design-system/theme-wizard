import { test, expect } from './fixtures/fixtures';

test('preview template shows correct content and structure', async ({ previewPage }) => {
  const previewChild = previewPage.getPreviewChild();

  await expect(previewPage.preview).toContainText('Mijn omgeving');
  await expect(previewChild).not.toHaveAttribute('data-test-id', 'theme-wizard-collage');
  await expect(previewPage.getCollageComponents()).not.toBeVisible();
});

test('collage template shows correct content and structure', async ({ collagePage }) => {
  const previewChild = collagePage.getPreviewChild();

  await expect(collagePage.preview).toContainText(
    "Breadcrumb navigation wordt gebruikt om naar andere pagina's in een gebruikersinterface te navigeren.",
  );
  await expect(previewChild).toHaveAttribute('data-test-id', 'theme-wizard-collage');
  await expect(collagePage.getCollageComponents()).toHaveCount(6);
});

test('can select different templates from the selector', async ({ themeWizard }) => {
  await themeWizard.selectTemplate('Overzichtspagina');
  await themeWizard.page.waitForLoadState('domcontentloaded');

  // Verify the select element is visible
  const templateSelect = themeWizard.page.getByLabel('Weergave');
  await expect(templateSelect).toBeVisible();

  // Get initial option count
  const optionCount = await templateSelect.locator('option').count();
  expect(optionCount).toBeGreaterThan(1); // Should have multiple templates

  const oldValue = await templateSelect.inputValue();

  // Select a different option and verify the change
  await templateSelect.selectOption({ index: 1 });

  // Verify the value changed
  const newValue = await templateSelect.inputValue();
  expect(newValue).not.toBe(oldValue);

  await expect(themeWizard.preview).toBeVisible();
});

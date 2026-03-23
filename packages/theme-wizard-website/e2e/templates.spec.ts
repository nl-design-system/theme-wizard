import { test, expect } from './fixtures/fixtures';

test.beforeEach(async ({ basisTokens }) => {
  await basisTokens.goto();
  await basisTokens.selectTemplate('Overzichtspagina');
});

test('preview template shows correct content and structure', async ({ basisTokens }) => {
  const previewChild = basisTokens.getPreviewChild();

  await expect(basisTokens.preview).toContainText('Mijn omgeving');
  await expect(previewChild).not.toHaveAttribute('data-test-id', 'theme-wizard-collage');
  await expect(basisTokens.getCollageComponents()).not.toBeVisible();
});

test('collage template shows correct content and structure', async ({ basisTokens }) => {
  await basisTokens.selectTemplate('Collage 1');
  const previewChild = basisTokens.getPreviewChild();

  await expect(basisTokens.preview).toContainText(
    "Breadcrumb navigation wordt gebruikt om naar andere pagina's in een gebruikersinterface te navigeren.",
  );
  await expect(previewChild).toHaveAttribute('data-test-id', 'theme-wizard-collage');
  await expect(basisTokens.getCollageComponents()).toHaveCount(6);
});

test('can select different templates from the selector', async ({ basisTokens }) => {
  // Verify the select element is visible
  const templateSelect = basisTokens.page.getByLabel('Weergave');
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

  await expect(basisTokens.preview).toBeVisible();
});

import { test, expect } from './fixtures/fixtures';

test('page has accessibility basics', async ({ themeWizard }) => {
  // Has <title>
  const title = await themeWizard.page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(themeWizard.page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

test.describe('Behavioural tests', () => {
  test('preview template shows correct content and structure', async ({ previewPage }) => {
    const previewChild = previewPage.getPreviewChild();

    await expect(previewPage.preview).toContainText('Mijn omgeving');
    await expect(previewChild).not.toHaveClass('theme-wizard-collage-component');
    await expect(previewPage.getCollageComponents()).not.toBeVisible();
  });

  test('collage template shows correct content and structure', async ({ collagePage }) => {
    const previewChild = collagePage.getPreviewChild();

    await expect(collagePage.preview).toContainText(
      "Breadcrumb navigation wordt gebruikt om naar andere pagina's in een gebruikersinterface te navigeren.",
    );
    await expect(previewChild).toHaveClass('theme-wizard-collage-component');
    await expect(collagePage.getCollageComponents()).toHaveCount(6);
  });

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

  test('can select different templates from the selector', async ({ themeWizard }) => {
    await themeWizard.selectTemplate('Overzichtspagina');

    // Verify the select element is visible
    const templateSelect = themeWizard.page.getByLabel('Voorvertoning');
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

  test.describe('color contrast warnings', () => {
    // start off without errors
    // shows error at origin AND linked color
    // Fixing the contrast makes the error go away
    test.beforeEach(async ({ themeWizard }) => {
      await themeWizard.sidebar.locator('summary').click();
    });

    test('No errors shown before making changes', async ({ themeWizard }) => {
      const errorAlert = themeWizard.getErrorAlert();
      await expect(errorAlert).not.toBeVisible();

      const input = themeWizard.sidebar.getByLabel('{basis.color.accent-1.bg-active}');
      await expect(input).toHaveAttribute('aria-invalid', 'false');
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
      await expect(input).toHaveAccessibleErrorMessage(/Not enough contrast/);
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

      await expect(input).toHaveAttribute('aria-invalid', 'false');
      await expect(input).not.toHaveAccessibleErrorMessage(/Not enough contrast/);
      await expect(errorAlert).not.toBeVisible();
    });
  });
});

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

  test('can change heading font to Verdana on collage', async ({ collagePage }) => {
    const heading = collagePage.getHeading(2);

    await expect(heading).not.toHaveFont('Verdana');
    await collagePage.changeHeadingFont('Verdana');
    await expect(heading).toHaveFont('Verdana');
  });

  test('can change body font to Georgia on collage', async ({ collagePage }) => {
    const paragraph = collagePage.getParagraph();

    await expect(paragraph).not.toHaveFont('Georgia');
    await collagePage.changeBodyFont('Georgia');
    await expect(paragraph).toHaveFont('Georgia');
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
});

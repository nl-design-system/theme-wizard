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

    await expect(previewPage.preview).toContainText('Graffiti laten verwijderen van uw pand');
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
    const heading = previewPage.getHeading(1);

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

  test('can switch between template and component views', async ({ page }) => {
    await expect(page.getByRole('combobox', { name: 'Voorvertoning Templates' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Voorvertoning Templates' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Voorvertoning losse componenten' })).toBeVisible();

    // Switch to component view
    await page.getByRole('button', { name: 'Voorvertoning losse componenten' }).click();

    await expect(page.getByRole('combobox', { name: 'Voorvertoning losse componenten' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Voorvertoning Templates' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Voorvertoning losse componenten' })).not.toBeVisible();
  });
});

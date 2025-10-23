import { test, expect } from '@playwright/test';
import { ThemeWizardPage } from './pages/ThemeWizardPage';

test('page has accessibility basics', async ({ page }) => {
  const { pageInstance } = await ThemeWizardPage.create(page);
  // Has <title>
  const title = await pageInstance.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(pageInstance.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

test.describe('Behavioural tests', () => {
  let themeWizardPage: ThemeWizardPage;

  test.beforeEach(async ({ page }) => {
    themeWizardPage = await ThemeWizardPage.create(page);
  });

  test('can switch between template and component views', async () => {
    const previewChild = themeWizardPage.getPreviewChild();

    // Test Preview template
    await themeWizardPage.switchToTemplateAndVerify('Preview', 'Graffiti laten verwijderen van uw pand');
    await expect(previewChild).not.toHaveClass('theme-wizard-collage-component');
    await expect(themeWizardPage.getCollageComponents()).not.toBeVisible();

    // Test Collage template
    await themeWizardPage.switchToTemplateAndVerify(
      'Collage (Component Variaties)',
      "Breadcrumb navigation wordt gebruikt om naar andere pagina's in een gebruikersinterface te navigeren.",
    );
    await expect(previewChild).toHaveClass('theme-wizard-collage-component');
    await expect(themeWizardPage.getCollageComponents()).toHaveCount(6);
  });

  test('can change heading font to Courier New on preview', async () => {
    const heading = themeWizardPage.getHeading(1);

    await themeWizardPage.selectTemplate('Preview');
    await themeWizardPage.verifyFontChange(heading, /Courier New/);

    await themeWizardPage.changeHeadingFont('Courier New');
    await themeWizardPage.verifyFontApplied(heading, /Courier New/);
  });

  test('can change body font to Arial', async () => {
    const paragraph = themeWizardPage.getParagraphs();

    await themeWizardPage.selectTemplate('Preview');
    await themeWizardPage.verifyFontChange(paragraph, /Arial/);

    await themeWizardPage.changeBodyFont('Arial');
    await themeWizardPage.verifyFontApplied(paragraph, /Arial/);
  });

  test('can change heading font to Verdana on collage', async () => {
    const heading = themeWizardPage.getHeading(2);

    await themeWizardPage.selectTemplate('Collage (Component Variaties)');
    await themeWizardPage.verifyFontChange(heading, /Verdana/);

    await themeWizardPage.changeHeadingFont('Verdana');
    await themeWizardPage.verifyFontApplied(heading, /Verdana/);
  });

  test('can change body font to Georgia on collage', async () => {
    const paragraph = themeWizardPage.getParagraphs();

    await themeWizardPage.selectTemplate('Collage (Component Variaties)');
    await themeWizardPage.verifyFontChange(paragraph, /Georgia/);

    await themeWizardPage.changeBodyFont('Georgia');
    await themeWizardPage.verifyFontApplied(paragraph, /Georgia/);
  });
});

import { test, expect } from '@playwright/test';
import { ThemeWizardPage } from './pages/ThemeWizardPage';

test('page has accessibility basics', async ({ page }) => {
  const themeWizard = new ThemeWizardPage(page);
  await themeWizard.goto();

  // Has <title>
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

test.describe('Behavioural tests', () => {
  let themeWizard: ThemeWizardPage;

  test.beforeEach(async ({ page }) => {
    themeWizard = new ThemeWizardPage(page);
    await themeWizard.goto();
  });

  test('can switch between template and component views', async () => {
    const previewChild = themeWizard.getPreviewChild();

    // Test Preview template
    await themeWizard.switchToTemplateAndVerify('Preview', 'Graffiti laten verwijderen van uw pand');
    await expect(previewChild).not.toHaveClass('theme-wizard-collage-component');
    await expect(themeWizard.getCollageComponents()).not.toBeVisible();

    // Test Collage template
    await themeWizard.switchToTemplateAndVerify(
      'Collage (Component Variaties)',
      "Breadcrumb navigation wordt gebruikt om naar andere pagina's in een gebruikersinterface te navigeren.",
    );
    await expect(previewChild).toHaveClass('theme-wizard-collage-component');
    await expect(themeWizard.getCollageComponents()).toHaveCount(6);
  });

  test('can change heading font to Courier New on preview', async () => {
    const heading = themeWizard.getHeading(1);

    await themeWizard.selectTemplate('Preview');
    await themeWizard.verifyFontChange(heading, /Courier New/);

    await themeWizard.changeHeadingFont('Courier New');
    await themeWizard.verifyFontApplied(heading, /Courier New/);
  });

  test('can change body font to Arial', async () => {
    const paragraph = themeWizard.getParagraphs();

    await themeWizard.selectTemplate('Preview');
    await themeWizard.verifyFontChange(paragraph, /Arial/);

    await themeWizard.changeBodyFont('Arial');
    await themeWizard.verifyFontApplied(paragraph, /Arial/);
  });

  test('can change heading font to Verdana on collage', async () => {
    const heading = themeWizard.getHeading(2);

    await themeWizard.selectTemplate('Collage (Component Variaties)');
    await themeWizard.verifyFontChange(heading, /Verdana/);

    await themeWizard.changeHeadingFont('Verdana');
    await themeWizard.verifyFontApplied(heading, /Verdana/);
  });

  test('can change body font to Georgia on collage', async () => {
    const paragraph = themeWizard.getParagraphs();

    await themeWizard.selectTemplate('Collage (Component Variaties)');
    await themeWizard.verifyFontChange(paragraph, /Georgia/);

    await themeWizard.changeBodyFont('Georgia');
    await themeWizard.verifyFontApplied(paragraph, /Georgia/);
  });
});

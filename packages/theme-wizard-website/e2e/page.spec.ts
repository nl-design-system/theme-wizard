import { test as base, expect } from '@playwright/test';
import { ThemeWizardPage } from './pages/ThemeWizardPage';

type ThemeWizardFixture = {
  themeWizard: ThemeWizardPage;
  previewPage: ThemeWizardPage;
  collagePage: ThemeWizardPage;
};

export const test = base.extend<ThemeWizardFixture>({
  collagePage: async ({ themeWizard }, use) => {
    await themeWizard.page.reload();
    await themeWizard.selectTemplate('Collage (Component Variaties)');
    await use(themeWizard);
  },
  previewPage: async ({ themeWizard }, use) => {
    await themeWizard.page.reload();
    await themeWizard.selectTemplate('Preview');
    await use(themeWizard);
  },
  themeWizard: async ({ page }, use) => {
    const themeWizard = new ThemeWizardPage(page);
    await themeWizard.goto();
    await use(themeWizard);
  },
});

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

    await previewPage.verifyFontChange(heading, /Courier New/);
    await previewPage.changeHeadingFont('Courier New');
    await previewPage.verifyFontApplied(heading, /Courier New/);
  });

  test('can change body font to Arial', async ({ previewPage }) => {
    const paragraph = previewPage.getParagraphs();

    await previewPage.verifyFontChange(paragraph, /Arial/);
    await previewPage.changeBodyFont('Arial');
    await previewPage.verifyFontApplied(paragraph, /Arial/);
  });

  test('can change heading font to Verdana on collage', async ({ collagePage }) => {
    const heading = collagePage.getHeading(2);

    await collagePage.verifyFontChange(heading, /Verdana/);
    await collagePage.changeHeadingFont('Verdana');
    await collagePage.verifyFontApplied(heading, /Verdana/);
  });

  test('can change body font to Georgia on collage', async ({ collagePage }) => {
    const paragraph = collagePage.getParagraphs();

    await collagePage.verifyFontChange(paragraph, /Georgia/);
    await collagePage.changeBodyFont('Georgia');
    await collagePage.verifyFontApplied(paragraph, /Georgia/);
  });
});

import { test, expect, type Locator, type Page } from '@playwright/test';

test('page has accessibility basics', async ({ page }) => {
  await page.goto('/');

  // Has <title>
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

test.describe('Behavioural tests', () => {
  let preview: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Wait for the preview rendering to complete before doing assertions on it
    preview = page.getByTestId('preview');
    await expect(preview).toBeVisible();
  });

  const selectTemplate = async (page: Page, templateName: string) => {
    const select = page.getByLabel('Kies een template');
    await select.selectOption({ label: templateName });
  };

  const changeFont = async (page: Page, fontType: string, fontName: string) => {
    const selectFont = page.getByLabel(fontType);
    await selectFont.selectOption({ label: fontName });
  };

  test('can switch between template and component views', async ({ page }) => {
    const previewChild = preview.locator(':first-child').first();

    // Test Preview template)
    await selectTemplate(page, 'Preview');

    await expect(preview).toContainText('Graffiti laten verwijderen van uw pand');
    await expect(previewChild).not.toHaveClass('theme-wizard-collage-component');
    await expect(preview.locator('.theme-wizard-collage-component')).not.toBeVisible();

    // Test Collage template
    await selectTemplate(page, 'Collage (Component Variaties)');

    await expect(preview).toContainText(
      "Breadcrumb navigation wordt gebruikt om naar andere pagina's in een gebruikersinterface te navigeren.",
    );
    await expect(previewChild).toHaveClass('theme-wizard-collage-component');
    await expect(preview.locator('.theme-wizard-collage-component')).toHaveCount(6);
  });

  const expectFontChange = async (
    page: Page,
    templateName: string,
    elementSelector: Locator,
    fontType: string,
    fontName: string,
    fontFamily: RegExp,
  ) => {
    await selectTemplate(page, templateName);

    const element = elementSelector;
    await expect(element).not.toHaveCSS('font-family', fontFamily);

    await changeFont(page, fontType, fontName);

    await expect(element).toHaveCSS('font-family', fontFamily);
  };

  test('can change heading font to Courier New on preview', async ({ page }) => {
    const heading = preview.getByRole('heading', { level: 1 });
    await expectFontChange(page, 'Preview', heading, 'Koppen', 'Courier New', /Courier New/);
  });

  test('can change body font to Arial', async ({ page }) => {
    const paragraph = preview.getByRole('paragraph').first();
    await expectFontChange(page, 'Preview', paragraph, 'Lopende tekst', 'Arial', /Arial/);
  });

  test('can change heading font to Verdana on collage', async ({ page }) => {
    const heading = preview.getByRole('heading', { level: 2 }).first();
    await expectFontChange(page, 'Collage (Component Variaties)', heading, 'Koppen', 'Verdana', /Verdana/);
  });

  test('can change body font to Georgia on collage', async ({ page }) => {
    const paragraph = preview.getByRole('paragraph').first();
    await expectFontChange(page, 'Collage (Component Variaties)', paragraph, 'Lopende tekst', 'Georgia', /Georgia/);
  });
});

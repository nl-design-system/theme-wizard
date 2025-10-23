import { test, expect, type Locator } from '@playwright/test';

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

  test('can switch between template and component views', async ({ page }) => {
    const select = page.getByLabel('Kies een template');
    const previewChild = preview.locator(':first-child').first();

    // Test Preview template)
    await select.selectOption({ label: 'Preview' });

    await expect(preview).toContainText('Graffiti laten verwijderen van uw pand');
    await expect(previewChild).not.toHaveClass('theme-wizard-collage-component');
    await expect(preview.locator('.theme-wizard-collage-component')).not.toBeVisible();

    // Test Collage template
    await select.selectOption({ label: 'Collage (Component Variaties)' });

    await expect(preview).toContainText(
      "Breadcrumb navigation wordt gebruikt om naar andere pagina's in een gebruikersinterface te navigeren.",
    );
    await expect(previewChild).toHaveClass('theme-wizard-collage-component');
    await expect(preview.locator('.theme-wizard-collage-component')).toHaveCount(6);
  });

  test('can change heading font to Courier New on preview', async ({ page }) => {
    const select = page.getByLabel('Kies een template');
    await select.selectOption({ label: 'Preview' });

    const heading = preview.getByRole('heading', { level: 1 });
    await expect(heading).not.toHaveCSS('font-family', /Courier New/);

    const selectFont = page.getByLabel('Koppen');
    await selectFont.selectOption({ label: 'Courier New' });

    await expect(heading).toHaveCSS('font-family', /Courier New/);
  });

  test('can change body font to Arial', async ({ page }) => {
    const select = page.getByLabel('Kies een template');
    await select.selectOption({ label: 'Preview' });

    const paragraph = preview.getByRole('paragraph').first();
    await expect(paragraph).not.toHaveCSS('font-family', /Arial/);

    const selectFont = page.getByLabel('Lopende tekst');
    await selectFont.selectOption({ label: 'Arial' });

    await expect(paragraph).toHaveCSS('font-family', /Arial/);
  });

  test('can change heading font to Courier New on collage', async ({ page }) => {
    const select = page.getByLabel('Kies een template');
    await select.selectOption({ label: 'Collage (Component Variaties)' });

    const heading = preview.getByRole('heading', { level: 2 }).first();
    await expect(heading).not.toHaveCSS('font-family', /Courier New/);

    const selectFont = page.getByLabel('Koppen');
    await selectFont.selectOption({ label: 'Courier New' });

    await expect(heading).toHaveCSS('font-family', /Courier New/);
  });

  test('can change body font to Arial on collage', async ({ page }) => {
    const select = page.getByLabel('Kies een template');
    await select.selectOption({ label: 'Collage (Component Variaties)' });

    const paragraph = preview.getByRole('paragraph').first();
    await expect(paragraph).not.toHaveCSS('font-family', /Arial/);

    const selectFont = page.getByLabel('Lopende tekst');
    await selectFont.selectOption({ label: 'Arial' });

    await expect(paragraph).toHaveCSS('font-family', /Arial/);
  });
});

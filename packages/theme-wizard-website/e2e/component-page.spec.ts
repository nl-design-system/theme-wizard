import { test, expect } from './fixtures/fixtures';

test.beforeEach(async ({ componentPage }) => {
  await componentPage.goto();
});

test('page has accessibility basics', async ({ page }) => {
  // Has <title>
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');

  // Has a title
  await expect.soft(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('shows sidebar with all components', async ({ page }) => {
  await expect(page.locator('wizard-sidebar-link')).not.toHaveCount(0);
});

test('page shows an on-page navigation with links to each of the pages sections', async ({ page }) => {
  await expect(page.locator('.wizard-anchor-nav').getByRole('link')).not.toHaveCount(0);
});

test.describe('stories', () => {
  test('shows 1 or more story sections', async ({ page }) => {
    expect(await page.locator('section:has(wizard-story-preview)').count()).toBeGreaterThanOrEqual(1);
  });

  test('most stories show input for design tokens', async ({ page }) => {
    const story = page.locator('section#DesignCodeBlockColor');
    const inputs = story.locator('wizard-token-field');
    expect(inputs).toHaveCount(2);
  });

  test.describe('inputs show only relevant tokens', () => {
    test('background-color inputs only show background colors', async ({ componentPage }) => {
      const options = await componentPage.getInputOptions('nl.code-block.background-color');

      expect.soft(await options.count()).toBeGreaterThanOrEqual(1);
      for (const option of await options.all()) {
        const text = (await option.textContent())?.trim();
        // like `basis.color.default.bg-default` or `basis.focus.background-color`
        expect.soft(text).toMatch(/\.bg-\w+$|\.background-color$/);
      }
    });

    test('text color inputs only show text colors', async ({ componentPage }) => {
      const options = await componentPage.getInputOptions('nl.code-block.color');

      expect.soft(await options.count()).toBeGreaterThanOrEqual(1);
      for (const option of await options.all()) {
        const text = (await option.textContent())?.trim();
        // like `basis.color.default.color-default` or `basis.focus.color`
        expect.soft(text).toMatch(/\.color-\w+$|\.color$/);
      }
    });

    test('line-height inputs only show line-heights', async ({ componentPage }) => {
      const options = await componentPage.getInputOptions('nl.code-block.line-height');

      expect.soft(await options.count()).toBeGreaterThanOrEqual(1);
      for (const option of await options.all()) {
        const text = (await option.textContent())?.trim();
        // like `basis.line-height.sm` or `basis.form-control.line-height`
        expect.soft(text).toMatch(/\.line-height\.\w+$|\.line-height$/);
      }
    });

    test('font-size inputs only show font-sizes', async ({ componentPage }) => {
      const options = await componentPage.getInputOptions('nl.code-block.font-size');

      expect.soft(await options.count()).toBeGreaterThanOrEqual(1);
      for (const option of await options.all()) {
        const text = (await option.textContent())?.trim();
        // like `basis.text.font-size.sm` or `basis.form-control.font-size`
        expect.soft(text).toMatch(/\.font-size\.\w+$|\.font-size$/);
      }
    });
  });

  test.describe('validations', () => {
    test('shows validation warning when bg+color tokens have insufficient contrast', async ({ page }) => {
      const color = page.getByLabel('nl.code-block.color');
      const ERROR_MESSAGE = 'Onvoldoende contrast met nl.code-block.background-color';
      const OPTION = 'basis.color.accent-1-inverse.color-default';

      // Make sure there's not already a validation message there
      await expect(color).not.toHaveAccessibleErrorMessage(ERROR_MESSAGE);

      // First fill in a color name to get <wizard-token-combobox> to show options
      // Otherwise the next step fails because it wouldn't show any options
      await color.fill(OPTION);
      // Then click the option that is shown
      await page.getByRole('option', { name: OPTION }).click();
      await expect(color).toHaveAccessibleErrorMessage(ERROR_MESSAGE);
    });

    // Entering custom dimensions does not work yet
    test('shows min-font-size validation', async ({ page }) => {
      const input = page.getByLabel('nl.code-block.font-size');
      await input.fill('12px');
    });

    // Entering custom dimensions/numbers does not work yet
    test.skip('shows min-line-height validation', async ({ page }) => {
      const input = page.getByLabel('nl.code-block.line-height');
      await input.fill('0.5');
    });
  });
});

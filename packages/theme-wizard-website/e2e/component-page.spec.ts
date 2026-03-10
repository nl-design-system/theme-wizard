import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/components/code-block');
});

test('page has accessibility basics', async ({ page }) => {
  // Has <title>
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  // Has document language specified
  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');
});

test('shows sidebar with all components', async ({ page }) => {
  await expect(page.locator('wizard-sidebar-link')).not.toHaveCount(0);
});
test('page shows an on-page navigation with links to each of the pages sections', async ({ page }) => {
  await expect(page.locator('.wizard-anchor-nav').getByRole('link')).not.toHaveCount(0);
});

test('page has <h1>', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveCount(0);
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

  test('shows validation warning when tokens have insufficient contrast', async ({ page }) => {
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
});

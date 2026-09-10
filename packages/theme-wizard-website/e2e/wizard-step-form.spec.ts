import { TOKENS as COLOR_SCALE_SLOTS } from '@nl-design-system-community/color-scale-generator';
import { test, expect } from './fixtures/fixtures';
import { diffDesignTokenPaths, localeCompare } from './lib/design-token-diff';
import { storageStatePath } from './project-setup';

test.describe('basis text font family (theme values)', () => {
  test('shows suggested theme values', async ({ wizardStepFormPage }) => {
    await wizardStepFormPage.goto();

    // This legend text is only shown when using theme fallback values
    await expect(wizardStepFormPage.legend).toHaveText('Voorgestelde waardes');
    await expect(wizardStepFormPage.options).toHaveCount(2);
    await expect(
      wizardStepFormPage.page.getByRole('radio', { name: '"IBM Plex Sans",sans-serif', exact: true }),
    ).toBeChecked();
  });

  test('can select an option, save it, and keep the selection after reload', async ({ wizardStepFormPage }) => {
    await wizardStepFormPage.goto();

    const lastLabel = await wizardStepFormPage.getOptionLabel(wizardStepFormPage.options.last());
    await wizardStepFormPage.optionCard(lastLabel).click();

    await wizardStepFormPage.save();
    await wizardStepFormPage.goto();

    // Using `exact:true` just in case we have options like `Arial, sans-serif` and `sans-serif`
    await expect(wizardStepFormPage.page.getByRole('radio', { name: lastLabel, exact: true })).toBeChecked();
  });
});

test.describe('basis text font family (scraped values)', () => {
  // Make sure we have access to scraped tokens
  test.use({ storageState: storageStatePath });

  test('shows multiple options based on scraped tokens', async ({ wizardStepFormPage }) => {
    await wizardStepFormPage.goto();

    await expect(wizardStepFormPage.legend).toHaveText('Gevonden waardes op website');
    await expect(wizardStepFormPage.options).toHaveCount(6);
  });

  test('can select a scraped option, save it, and keep the selection after reload', async ({ wizardStepFormPage }) => {
    await wizardStepFormPage.goto();

    const firstLabel = await wizardStepFormPage.getOptionLabel(wizardStepFormPage.options.first());
    await wizardStepFormPage.optionCard(firstLabel).click();

    await wizardStepFormPage.save();
    await wizardStepFormPage.goto();

    // Using `exact:true` just in case we have options like `Arial, sans-serif` and `sans-serif`
    await expect(wizardStepFormPage.page.getByRole('radio', { name: firstLabel, exact: true })).toBeChecked();
  });
});

test.describe('basis color', () => {
  test.use({ storageState: storageStatePath });

  test('Setting a color for color.default.color-document creates a color scale for all of color.default and color.default-inverse', async ({
    wizardStepFormPage,
  }) => {
    const path = '/wizard/basis-color-default-color-document';
    await wizardStepFormPage.goto(path);
    const before = await wizardStepFormPage.getTokenTree();

    const lastLabel = await wizardStepFormPage.getOptionLabel(wizardStepFormPage.options.last());
    await wizardStepFormPage.optionCard(lastLabel).click();
    await wizardStepFormPage.save();

    await wizardStepFormPage.goto(path);
    const after = await wizardStepFormPage.getTokenTree();

    const changedPaths = diffDesignTokenPaths(before, after);
    const generatedGroupPaths = new Set(
      COLOR_SCALE_SLOTS.flatMap((slot) => [`basis.color.default.${slot}`, `basis.color.default-inverse.${slot}`]),
    );

    // Nothing outside the generated group changed.
    expect(changedPaths.every((path) => generatedGroupPaths.has(path))).toBe(true);
    // Inverse `color-*` tokens sit at max lightness (chroma always clamps to 0), so they can
    // coincidentally land back on the same white — only the regular side is asserted in full.
    const expectedRegularPaths = COLOR_SCALE_SLOTS.map((slot) => `basis.color.default.${slot}`).sort(localeCompare);
    expect(changedPaths).toEqual(expect.arrayContaining(expectedRegularPaths));
  });

  test('Setting a color for color.action-1 marks the used option as checked when re-entering the page', async ({
    wizardStepFormPage,
  }) => {
    const path = '/wizard/basis-color-action-1-inverse-bg-default';
    await wizardStepFormPage.goto(path);

    const lastLabel = await wizardStepFormPage.getOptionLabel(wizardStepFormPage.options.last());
    await wizardStepFormPage.optionCard(lastLabel).click();
    await wizardStepFormPage.save();

    await wizardStepFormPage.goto(path);

    await expect(wizardStepFormPage.options.last()).toBeChecked();
  });

  test('basis heading color: picking a color only changes basis.heading.color', async ({ wizardStepFormPage }) => {
    const path = '/wizard/basis-heading-color';
    await wizardStepFormPage.goto(path);
    const before = await wizardStepFormPage.getTokenTree();

    const lastLabel = await wizardStepFormPage.getOptionLabel(wizardStepFormPage.options.last());
    await wizardStepFormPage.optionCard(lastLabel).click();
    await wizardStepFormPage.save();

    await wizardStepFormPage.goto(path);
    const after = await wizardStepFormPage.getTokenTree();

    expect(diffDesignTokenPaths(before, after)).toEqual(['basis.heading.color']);
  });
});

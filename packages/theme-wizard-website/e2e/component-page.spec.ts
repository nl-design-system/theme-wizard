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
    const story = page.locator('section#AdvancedFocusButton');
    const inputs = story.locator('wizard-token-field');
    expect(inputs).toHaveCount(4);
  });

  test.describe('inputs show only relevant tokens', () => {
    test('background-color inputs only show background colors', async ({ componentPage }) => {
      const options = await componentPage.getInputOptions(
        'nl.button.focus.background-color',
        '',
        'AdvancedFocusButton',
      );

      expect.soft(await options.count()).toBeGreaterThanOrEqual(1);
      for (const option of await options.all()) {
        const text = (await option.textContent())?.trim();
        // like `basis.color.default.bg-default` or `basis.focus.background-color`
        expect.soft(text).toMatch(/\.bg-\w+$|\.background-color$/);
      }
    });

    test('text color inputs only show text colors', async ({ componentPage }) => {
      const options = await componentPage.getInputOptions('nl.button.focus.color', '', 'AdvancedFocusButton');

      expect.soft(await options.count()).toBeGreaterThanOrEqual(1);
      for (const option of await options.all()) {
        const text = (await option.textContent())?.trim();
        // like `basis.color.default.color-default` or `basis.focus.color`
        expect.soft(text).toMatch(/\.color-\w+$|\.color$/);
      }
    });

    test('line-height inputs only show line-heights', async ({ componentPage }) => {
      const options = await componentPage.getInputOptions('nl.button.default.line-height');

      expect.soft(await options.count()).toBeGreaterThanOrEqual(1);
      for (const option of await options.all()) {
        const text = (await option.textContent())?.trim();
        // like `basis.line-height.sm` or `basis.form-control.line-height`
        expect.soft(text).toMatch(/\.line-height\.\w+$|\.line-height$/);
      }
    });

    test('font-size inputs only show font-sizes', async ({ componentPage }) => {
      const options = await componentPage.getInputOptions('nl.button.default.font-size');

      expect.soft(await options.count()).toBeGreaterThanOrEqual(1);
      for (const option of await options.all()) {
        const text = (await option.textContent())?.trim();
        // like `basis.text.font-size.sm` or `basis.form-control.font-size`
        expect.soft(text).toMatch(/\.font-size\.\w+$|\.font-size$/);
      }
    });
  });

  test.describe('inputs allow manual input', () => {
    test.describe('color', () => {
      test('updates input value', async ({ page }) => {
        const input = page.getByLabel('nl.button.focus.color');
        expect(await input.inputValue()).not.toBe('#ff0000');
        await input.fill('#ff0000');
        await input.press('Enter');
        expect(await input.inputValue()).toBe('#ff0000');
      });

      test('updates input preview', async ({ componentPage, page }) => {
        const label = 'nl.button.focus.color';
        const preview = componentPage.getComboboxPreviewElement(label);
        const computedBgColor = await componentPage.getComputedProperty(preview, 'color');
        expect(computedBgColor).not.toBe('#ff0000');
        await page.getByLabel(label).fill('#ff0000');
        await page.keyboard.press('Tab');
        const updatedBgColor = await componentPage.getComputedProperty(preview, 'color');
        // Computed colors are returned in rgb()
        expect(updatedBgColor).toBe('rgb(255, 0, 0)');
      });
    });

    test.describe('dimension (font-size)', () => {
      test('updates input value', async ({ componentPage }) => {
        const input = componentPage.getScopedInput('nl.button.default.font-size');
        expect(await input.inputValue()).not.toBe('24px');
        await input.fill('24px');
        await input.blur();
        expect(await input.inputValue()).toBe('24px');
      });

      test('updates input preview', async ({ componentPage }) => {
        const label = 'nl.button.default.font-size';
        const preview = componentPage.getComboboxPreviewElement(label, 'AdvancedButtonTypography');
        const computedFontSize = await componentPage.getComputedProperty(preview, 'font-size');
        expect(computedFontSize).not.toBe('24px');
        await componentPage.getScopedInput(label).fill('24px');
        await componentPage.page.keyboard.press('Tab');
        const updatedFontSize = await componentPage.getComputedProperty(preview, 'font-size');
        expect(updatedFontSize).toBe('24px');
      });
    });

    test.describe('line-height', () => {
      test('updates input value (dimension)', async ({ componentPage }) => {
        const input = componentPage.getScopedInput('nl.button.default.line-height');
        expect(await input.inputValue()).not.toBe('24px');
        await input.fill('24px');
        await input.blur();
        expect(await input.inputValue()).toBe('24px');
      });

      test('updates input value (number)', async ({ componentPage }) => {
        const input = componentPage.getScopedInput('nl.button.default.line-height');
        expect(await input.inputValue()).not.toBe('1.2');
        await input.fill('1.2');
        await input.blur();
        expect(await input.inputValue()).toBe('1.2');
      });
    });
  });

  test.describe('validations', () => {
    test.describe('color contrast', () => {
      const ERROR_MESSAGE = 'Onvoldoende contrast met nl.button.focus.background-color';

      test('shows validation warning when bg+color tokens have insufficient contrast - basis tokens', async ({
        page,
      }) => {
        const input = page.getByLabel('nl.button.focus.color');
        const OPTION = 'basis.color.accent-1-inverse.color-default';
        await expect(input).not.toHaveAccessibleErrorMessage(ERROR_MESSAGE);

        // First fill in a color name to get <wizard-token-combobox> to show options
        // Otherwise the next step fails because it wouldn't show any options
        await input.fill(OPTION);
        // Then click the option that is shown
        await page.getByRole('option', { name: OPTION }).click();
        await expect(input).toHaveAccessibleErrorMessage(ERROR_MESSAGE);
      });

      test('shows validation warning when bg+color tokens have insufficient contrast - absolute value', async ({
        page,
      }) => {
        const input = page.getByLabel('nl.button.focus.color');
        await expect(input).not.toHaveAccessibleErrorMessage(ERROR_MESSAGE);

        await input.fill('#fff');
        await input.blur();

        await expect(input).toHaveAccessibleErrorMessage(ERROR_MESSAGE);
      });

      test('contrast warning goes away after setting valid values', async ({ page }) => {
        const input = page.getByLabel('nl.button.focus.color');
        await input.fill('#fff');
        await input.blur();
        await expect(input).toHaveAccessibleErrorMessage(ERROR_MESSAGE);

        await input.fill('#000');
        await input.blur();
        await expect(input).not.toHaveAccessibleErrorMessage(ERROR_MESSAGE);
      });
    });

    test.describe('font-size', () => {
      const ERROR_MESSAGE =
        'Lettergrootte is te klein. Bekijk richtlijnen. Lettergrootte: 12px. Minimaal vereist: 14px / 0.875rem';

      test('shows min-font-size validation', async ({ componentPage }) => {
        const input = componentPage.getScopedInput('nl.button.default.font-size');
        // Make sure there's not already a validation message there
        await expect(input).not.toHaveAccessibleErrorMessage(ERROR_MESSAGE);

        await input.fill('12px');
        await input.blur();
        await expect(input).toHaveAccessibleErrorMessage(ERROR_MESSAGE);
      });

      test('error message is gone after fixing', async ({ componentPage }) => {
        const input = componentPage.getScopedInput('nl.button.default.font-size');
        await input.fill('12px');
        await input.blur();
        await expect(input).toHaveAccessibleErrorMessage(ERROR_MESSAGE);

        await input.fill('16px');
        await input.blur();
        await expect(input).not.toHaveAccessibleErrorMessage(ERROR_MESSAGE);
      });
    });

    test.describe('line-height', () => {
      test('shows min-line-height validation', async ({ componentPage }) => {
        const ERROR_MESSAGE = 'Regelafstand is te klein. Bekijk richtlijnen. Regelafstand: 1.01. Minimaal vereist: 1.1';
        const input = componentPage.getScopedInput('nl.button.default.line-height');
        await expect(input).not.toHaveAccessibleErrorMessage(ERROR_MESSAGE);

        await input.fill('1.01');
        await input.blur();
        await expect(input).toHaveAccessibleErrorMessage(ERROR_MESSAGE);
      });

      for (const size of ['20px', '120%']) {
        test(`shows unitless-line-height validation (${size})`, async ({ componentPage }) => {
          const ERROR_MESSAGE = 'Onverwachte eenheid. Gebruik alleen nummers.';
          const input = componentPage.getScopedInput('nl.button.default.line-height');
          await expect(input).not.toHaveAccessibleErrorMessage(ERROR_MESSAGE);

          await input.fill(size);
          await input.blur();
          await expect(input).toHaveAccessibleErrorMessage(ERROR_MESSAGE);
        });
      }
    });
  });
});

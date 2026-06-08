import maTokens from '@nl-design-system-community/ma-design-tokens/dist/tokens.json' with { type: 'json' };
import { test, expect } from './fixtures/fixtures';

// basis.space.block.xs.$value = "2px" in maTokens.
// utrecht.button.padding-block with the same literal value will match after preprocessing:
// both get subtype "space-block" and value { unit: 'px', value: 2 }.
const BASIS_TOKEN_PATH = 'basis.space.block.xs';
const COMPONENT_TOKEN_PATH = 'utrecht.button.padding-block';
const SHARED_VALUE = '2px';

const tokensWithSuggestion = {
  basis: structuredClone(maTokens.basis),
  utrecht: {
    button: {
      'padding-block': { $type: 'dimension', $value: SHARED_VALUE },
    },
  },
};
// Hardcode the basis token value so a maTokens update can't silently break the match
tokensWithSuggestion.basis.space.block.xs.$value = SHARED_VALUE;

test.beforeEach(async ({ reuseTokensPage }) => {
  await reuseTokensPage.goto();
});

test('page has accessibility basics', async ({ page }) => {
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');

  await expect.soft(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test.describe('interactive', () => {
  test.describe('valid input', () => {
    test.beforeEach(async ({ reuseTokensPage }) => {
      await reuseTokensPage.selectFile(JSON.stringify(tokensWithSuggestion));
      await reuseTokensPage.findReusableTokens();
      await expect(reuseTokensPage.suggestionRows.first()).toBeVisible();
    });

    test('Shows suggestion in table', async ({ reuseTokensPage }) => {
      await expect(reuseTokensPage.suggestionRows).toHaveCount(1);
      await expect(reuseTokensPage.suggestionRows).toContainText(COMPONENT_TOKEN_PATH);
      await expect(reuseTokensPage.suggestionRows).toContainText(BASIS_TOKEN_PATH);
    });

    test('Suggestion checkbox is checked by default', async ({ reuseTokensPage }) => {
      await expect(reuseTokensPage.page.getByRole('checkbox', { name: COMPONENT_TOKEN_PATH })).toBeChecked();
    });

    test('Shows download button after applying suggestions', async ({ reuseTokensPage }) => {
      await reuseTokensPage.applySuggestions();
      await reuseTokensPage.downloadButton.scrollIntoViewIfNeeded();
      await expect(reuseTokensPage.downloadButton).toBeVisible();
    });

    test('Shows updated JSON after applying suggestions', async ({ reuseTokensPage }) => {
      await reuseTokensPage.applySuggestions();
      const json = await reuseTokensPage.resultOutput.inputValue();
      const parsed = JSON.parse(json);
      expect(parsed.utrecht.button['padding-block'].$value).toBe(`{${BASIS_TOKEN_PATH}}`);
    });

    test('Does not apply suggestion when checkbox is unchecked', async ({ reuseTokensPage }) => {
      await reuseTokensPage.page.getByRole('checkbox', { name: COMPONENT_TOKEN_PATH }).uncheck();
      await reuseTokensPage.applySuggestions();
      const json = await reuseTokensPage.resultOutput.inputValue();
      const parsed = JSON.parse(json);
      expect(parsed.utrecht.button['padding-block'].$value).not.toBe(`{${BASIS_TOKEN_PATH}}`);
    });
  });

  test('shows empty state when no suggestions found', async ({ reuseTokensPage }) => {
    // maTokens.basis.text has no `basis` key after JSON.stringify, so
    // collectBasisTokens returns [] and findReusableTokens returns no candidates.
    await reuseTokensPage.selectFile(JSON.stringify(maTokens.basis.text));
    await reuseTokensPage.findReusableTokens();

    await expect(reuseTokensPage.applySuggestionsButton).not.toBeVisible();
    await expect(reuseTokensPage.suggestionRows).not.toBeVisible();
  });

  test.describe('invalid input', () => {
    test.beforeEach(async ({ reuseTokensPage }) => {
      const tokens = { basis: structuredClone(maTokens.basis) };
      // @ts-expect-error We're doing something illegal here, so an error is expected
      tokens.basis.color['box-shadow'] = { $type: 'color', $value: '#000000' };
      await reuseTokensPage.selectFile(JSON.stringify(tokens));
      await reuseTokensPage.findReusableTokens();
      await expect(reuseTokensPage.fileInputError).toBeVisible();
    });

    test('Shows file input error', async ({ reuseTokensPage }) => {
      await expect(reuseTokensPage.fileInputError).toBeVisible();
    });

    test('Does not show apply suggestions button', async ({ reuseTokensPage }) => {
      await expect(reuseTokensPage.applySuggestionsButton).not.toBeVisible();
    });
  });
});

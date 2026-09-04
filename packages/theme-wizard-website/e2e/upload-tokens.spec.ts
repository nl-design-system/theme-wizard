import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json' with { type: 'json' };
import { dset } from 'dset';
import { test, expect } from './fixtures/fixtures';

test.beforeEach(async ({ uploadTokensPage }) => {
  await uploadTokensPage.goto();
});

test('page has accessibility basics', async ({ page }) => {
  const title = await page.title();
  expect.soft(title).toBeTruthy();

  await expect.soft(page.locator('html')).toHaveAttribute('lang', 'nl-NL');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test.describe('uploading the full Start-thema', () => {
  test.beforeEach(async ({ uploadTokensPage }) => {
    await uploadTokensPage.selectFile(JSON.stringify(startTokens));
    await uploadTokensPage.upload();
    await expect(uploadTokensPage.uploadedTokensSummary).toBeVisible();
  });

  test('is accepted without warnings or filled-in tokens', async ({ uploadTokensPage }) => {
    await expect.soft(uploadTokensPage.fileInputError).not.toBeVisible();
    await expect.soft(uploadTokensPage.filledFromDefaultsDetails).not.toBeVisible();
    await expect.soft(uploadTokensPage.softIssuesDetails).not.toBeVisible();
  });

  test('continuing moves to the basis-tokens page', async ({ basisTokensPage, page, uploadTokensPage }) => {
    await uploadTokensPage.confirm();

    await expect(page).toHaveURL(new RegExp(basisTokensPage.url));
  });
});

test.describe('uploading an incomplete theme', () => {
  test.beforeEach(async ({ uploadTokensPage }) => {
    // Only upload a small sub-portion of the full theme, the rest should be filled in from the Start-thema
    await uploadTokensPage.selectFile(JSON.stringify({ basis: { text: startTokens.basis.text } }));
    await uploadTokensPage.upload();
    await expect(uploadTokensPage.uploadedTokensSummary).toBeVisible();
  });

  test('lists the tokens that were filled in from the Start-thema', async ({ uploadTokensPage }) => {
    await expect(uploadTokensPage.filledFromDefaultsDetails).toBeVisible();
  });

  test('continuing moves to the basis-tokens page', async ({ basisTokensPage, page, uploadTokensPage }) => {
    await uploadTokensPage.confirm();

    await expect(page).toHaveURL(new RegExp(basisTokensPage.url));
  });
});

test.describe('uploading a Start-thema with a contrast issue', () => {
  test.beforeEach(async ({ uploadTokensPage }) => {
    const tokens = structuredClone(startTokens);
    dset(tokens, 'basis.color.default.color-document.$value', '#ffffff');

    await uploadTokensPage.selectFile(JSON.stringify(tokens));
    await uploadTokensPage.upload();
    await expect(uploadTokensPage.uploadedTokensSummary).toBeVisible();
  });

  test('is not blocked, but shows a quality warning', async ({ uploadTokensPage }) => {
    await expect.soft(uploadTokensPage.fileInputError).not.toBeVisible();
    await expect.soft(uploadTokensPage.softIssuesDetails).toBeVisible();
    await expect.soft(uploadTokensPage.confirmButton).toBeVisible();
  });

  test('the warning mentions the affected token', async ({ uploadTokensPage }) => {
    await uploadTokensPage.softIssuesDetails.click();

    await expect(uploadTokensPage.page.getByText(/basis\.color\.default\.color-document/).first()).toBeVisible();
  });

  test('continuing still moves to the basis-tokens page, keeping the overridden color', async ({
    basisTokensPage,
    page,
    uploadTokensPage,
  }) => {
    await uploadTokensPage.confirm();

    await expect(page).toHaveURL(new RegExp(basisTokensPage.url));
    await expect(basisTokensPage.preview).toBeVisible();

    const tokenTree = (await basisTokensPage.getTokenTree()) as {
      basis: { color: { default: { 'color-document': { $value: { components: number[] } } } } };
    };
    expect(tokenTree.basis.color.default['color-document'].$value.components).toEqual([1, 1, 1]);
  });
});

test.describe('uploading a structurally invalid theme', () => {
  test.beforeEach(async ({ uploadTokensPage }) => {
    const tokens = {
      basis: { 'border-radius': { md: { $value: '{basis.border-radius.does-not-exist}' } } },
    };
    await uploadTokensPage.selectFile(JSON.stringify(tokens));
    await uploadTokensPage.upload();
  });

  test('is blocked with an error, and does not show a summary', async ({ uploadTokensPage }) => {
    await expect.soft(uploadTokensPage.fileInputError).toBeVisible();
    await expect.soft(uploadTokensPage.uploadedTokensSummary).not.toBeVisible();
    await expect.soft(uploadTokensPage.confirmButton).not.toBeVisible();
  });
});

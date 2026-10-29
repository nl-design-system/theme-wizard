import { expect, test } from './fixtures/fixtures';

const CASES: { segments: string[]; title: string }[] = [
  { segments: ['ams', 'page-header'], title: 'Page-header' },
  { segments: ['ams', 'page-header', 'background-color'], title: 'Background-color' },
];

CASES.forEach(({ segments, title }) => {
  test.describe(`/design-tokens/community/${segments.join('/')}`, () => {
    test.beforeEach(async ({ communityTokenPage }) => {
      await communityTokenPage.goto(segments);
    });

    test('shows a page title', async ({ communityTokenPage }) => {
      await expect(communityTokenPage.headingWithText(title)).toBeVisible();
    });

    test('shows a breadcrumb matching the URL', async ({ communityTokenPage }) => {
      const expectedCrumbs = ['Huisstijl', 'Community components', ...segments.slice(0, -1)];

      await expect(communityTokenPage.breadcrumbLinks).toHaveText(expectedCrumbs);
      await expect(communityTokenPage.currentBreadcrumbLink).toHaveText(title, { ignoreCase: true });
    });
  });
});

test('token field uses the organisation-prefixed token path', async ({ communityTokenPage, page }) => {
  await communityTokenPage.goto(['ams', 'page-header', 'background-color']);
  await expect(page.locator('wizard-token-field[path="ams.page-header.background-color"]')).toHaveCount(1);
});

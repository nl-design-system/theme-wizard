import { expect, test } from './fixtures/fixtures';

const CASES: { segments: string[]; title: string }[] = [
  { segments: ['data-badge'], title: 'Data-badge' },
  { segments: ['data-badge', 'background-color'], title: 'Background-color' },
  { segments: ['heading', 'level-1'], title: 'Level-1' },
  { segments: ['heading', 'level-1', 'color'], title: 'Color' },
];

CASES.forEach(({ segments, title }) => {
  test.describe(`/design-tokens/nl/${segments.join('/')}`, () => {
    test.beforeEach(async ({ nlTokenPage }) => {
      await nlTokenPage.goto(segments);
    });

    test('has the correct URL', async ({ nlTokenPage, page }) => {
      expect(new URL(page.url()).pathname).toBe(nlTokenPage.urlFor(segments));
    });

    test('shows a page title', async ({ nlTokenPage, page }) => {
      expect(await page.title()).toBeTruthy();
      await expect(nlTokenPage.headingWithText(title)).toBeVisible();
    });

    test('shows a breadcrumb matching the URL', async ({ nlTokenPage }) => {
      const expectedCrumbs = ['Design tokens', 'nl', ...segments];

      await expect(nlTokenPage.breadcrumbLinks).toHaveText(expectedCrumbs);
      await expect(nlTokenPage.currentBreadcrumbLink).toHaveText(title, { ignoreCase: true });
    });

    test('sidebar has the matching link selected', async ({ nlTokenPage }) => {
      await expect(nlTokenPage.selectedSidebarLink).toBeVisible();
      await expect(nlTokenPage.selectedSidebarLink).toHaveText(title, { ignoreCase: true });
    });
  });
});

test.describe('sidebar navigation collapse state', () => {
  test('only expands the branch containing the current page', async ({ nlTokenPage }) => {
    await nlTokenPage.goto(['heading', 'level-1', 'color']);

    // The whole ancestor chain down to the current leaf is expanded and visible.
    await expect(nlTokenPage.sidebarLink('heading')).toBeVisible();
    await expect(nlTokenPage.sidebarLink('level-1')).toBeVisible();
    await expect(nlTokenPage.sidebarLink('color')).toBeVisible();

    // An unrelated top-level component stays visible itself...
    await expect(nlTokenPage.sidebarLink('data-badge')).toBeVisible();
    // ...but its children are not rendered, since that branch is collapsed.
    await expect(nlTokenPage.sidebar.getByRole('link', { name: 'background-color', exact: true })).toHaveCount(0);
  });

  test('expands a branch page to show its own children', async ({ nlTokenPage }) => {
    await nlTokenPage.goto(['data-badge']);

    await expect(nlTokenPage.sidebarLink('background-color')).toBeVisible();
  });
});

test.describe('shared /design-tokens sidebar', () => {
  test('groups basis and nl tokens under their own parent on a basis page', async ({ basisTokenPage }) => {
    await basisTokenPage.goto(['color']);

    await expect(basisTokenPage.sidebarLink('Basis tokens')).toBeVisible();
    await expect(basisTokenPage.sidebarLink('Candidate components')).toBeVisible();
  });

  test('groups basis and nl tokens under their own parent on an nl page', async ({ nlTokenPage }) => {
    await nlTokenPage.goto(['data-badge']);

    await expect(nlTokenPage.sidebarLink('Basis tokens')).toBeVisible();
    await expect(nlTokenPage.sidebarLink('Candidate components')).toBeVisible();
  });
});

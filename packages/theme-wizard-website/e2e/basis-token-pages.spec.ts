import { expect, test } from './fixtures/fixtures';

const CASES: { segments: string[]; title: string }[] = [
  { segments: ['color'], title: 'color' },
  { segments: ['color', 'default'], title: 'default' },
  { segments: ['color', 'default', 'bg-default'], title: 'bg-default' },
  { segments: ['size', 'md'], title: 'md' },
  { segments: ['text', 'font-family', 'default'], title: 'default' },
];

CASES.forEach(({ segments, title }) => {
  test.describe(`/basis-tokens/${segments.join('/')}`, () => {
    test.beforeEach(async ({ basisTokenPage }) => {
      await basisTokenPage.goto(segments);
    });

    test('has the correct URL', async ({ basisTokenPage, page }) => {
      expect(new URL(page.url()).pathname).toBe(basisTokenPage.urlFor(segments));
    });

    test('shows a page title', async ({ basisTokenPage, page }) => {
      expect(await page.title()).toBeTruthy();
      await expect(basisTokenPage.headingWithText(title)).toBeVisible();
    });

    test('shows a breadcrumb matching the URL', async ({ basisTokenPage }) => {
      const expectedCrumbs = ['basis', ...segments];

      await expect(basisTokenPage.breadcrumbLinks).toHaveText(expectedCrumbs);
      await expect(basisTokenPage.currentBreadcrumbLink).toHaveText(title);
    });

    test('sidebar has the matching link selected', async ({ basisTokenPage }) => {
      await expect(basisTokenPage.selectedSidebarLink).toBeVisible();
      await expect(basisTokenPage.selectedSidebarLink).toHaveText(title);
    });
  });
});

test.describe('sidebar navigation collapse state', () => {
  test('only expands the branch containing the current page', async ({ basisTokenPage }) => {
    await basisTokenPage.goto(['color', 'default', 'bg-default']);

    // The whole ancestor chain down to the current leaf is expanded and visible.
    await expect(basisTokenPage.sidebarLink('color')).toBeVisible();
    await expect(basisTokenPage.sidebarLink('default')).toBeVisible();
    await expect(basisTokenPage.sidebarLink('bg-default')).toBeVisible();

    // An unrelated top-level group stays visible itself...
    await expect(basisTokenPage.sidebarLink('size')).toBeVisible();
    // ...but its children are not rendered, since that branch is collapsed.
    await expect(basisTokenPage.sidebar.getByRole('link', { name: 'md', exact: true })).toHaveCount(0);
  });

  test('expands a branch page to show its own children', async ({ basisTokenPage }) => {
    await basisTokenPage.goto(['color']);

    await expect(basisTokenPage.sidebarLink('default')).toBeVisible();
  });
});

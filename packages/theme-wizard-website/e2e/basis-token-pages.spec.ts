import { expect, test } from './fixtures/fixtures';

const CASES: { segments: string[]; breadcrumbSegments: string[]; title: string }[] = [
  { breadcrumbSegments: ['kleur'], segments: ['color'], title: 'Kleur' },
  { breadcrumbSegments: ['kleur', 'standaard', 'default'], segments: ['color', 'default'], title: 'Default' },
  {
    breadcrumbSegments: ['kleur', 'standaard', 'default', 'Bg-default'],
    segments: ['color', 'default', 'bg-default'],
    title: 'Bg-default',
  },
  { breadcrumbSegments: ['grootte', 'md'], segments: ['size', 'md'], title: 'Md' },
  {
    breadcrumbSegments: ['typografie', 'font-family', 'default'],
    segments: ['text', 'font-family', 'default'],
    title: 'Default',
  },
];

CASES.forEach(({ breadcrumbSegments, segments, title }) => {
  test.describe(`/design-tokens/basis/${segments.join('/')}`, () => {
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
      const expectedCrumbs = ['Huisstijl', 'Basis tokens', ...breadcrumbSegments.slice(0, -1)];

      await expect(basisTokenPage.breadcrumbLinks).toHaveText(expectedCrumbs, { ignoreCase: true });
      await expect(basisTokenPage.currentBreadcrumbLink).toHaveText(title, { ignoreCase: true });
    });

    test('sidebar has the matching link selected', async ({ basisTokenPage }) => {
      await expect(basisTokenPage.selectedSidebarLink).toBeVisible();
      await expect(basisTokenPage.selectedSidebarLink).toHaveText(title, { ignoreCase: true });
    });
  });
});

test.describe('sidebar navigation collapse state', () => {
  test('only expands the branch containing the current page', async ({ basisTokenPage }) => {
    await basisTokenPage.goto(['color', 'default', 'bg-default']);

    // The whole ancestor chain down to the current leaf is expanded and visible.
    await expect(basisTokenPage.sidebarLink('Kleur')).toBeVisible();
    await expect(basisTokenPage.sidebarLink('Standaard')).toBeVisible();
    await expect(basisTokenPage.sidebarLink('Default')).toBeVisible();
    await expect(basisTokenPage.sidebarLink('Bg-default')).toBeVisible();

    // An unrelated top-level group stays visible itself...
    await expect(basisTokenPage.sidebarLink('Grootte')).toBeVisible();
    // ...but its children are not rendered, since that branch is collapsed.
    await expect(basisTokenPage.sidebar.getByRole('link', { name: 'Md', exact: true })).toHaveCount(0);
  });

  test('expands a branch page to show its own children', async ({ basisTokenPage }) => {
    await basisTokenPage.goto(['color']);

    await expect(basisTokenPage.sidebarLink('Standaard')).toBeVisible();
  });
});

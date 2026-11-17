import { componentsNavigationItems } from '@/lib/components';
import { test, expect } from './fixtures/fixtures';

const COMPONENT_URL = '/components/community/ams-page-header';

test.beforeEach(async ({ page }) => {
  await page.goto(COMPONENT_URL);
});

test('renders a story preview', async ({ page }) => {
  const preview = page.locator('clippy-story-preview').first();
  await expect(preview.locator('clippy-react-element').first()).toBeVisible();
});

test('does not link to nldesignsystem.nl docs', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'nldesignsystem.nl' })).toHaveCount(0);
});

test.describe('shows sidebar with all community components', () => {
  const communityItems = componentsNavigationItems.find((group) => group.href === '/components/community')?.items ?? [];

  communityItems.forEach((item) => {
    test(item.href, async ({ componentPage }) => {
      await expect(componentPage.sidebarLink(item.label)).toBeVisible();
    });
  });
});

test.describe('component group pages', () => {
  ['candidate', 'community'].forEach((group) => {
    test(`/components/${group} lists its components`, async ({ page }) => {
      await page.goto(`/components/${group}`);
      const items = componentsNavigationItems.find((item) => item.href === `/components/${group}`)?.items ?? [];
      for (const item of items) {
        await expect(
          page.locator('clippy-story-preview').getByRole('link', { name: item.label, exact: true }),
        ).toBeVisible();
      }
    });
  });
});

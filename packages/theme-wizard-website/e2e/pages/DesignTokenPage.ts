import { type Locator, type Page } from '@playwright/test';

// Shared behaviour for both /design-tokens/basis/* and /design-tokens/nl/* pages —
// they use the same sidebar, breadcrumb, and page structure, just a different base path.
export class DesignTokenPage {
  constructor(
    public readonly page: Page,
    private readonly namespace: 'basis' | 'nl',
  ) {}

  urlFor(segments: string[]) {
    return `/design-tokens/${this.namespace}/${segments.join('/')}`;
  }

  async goto(segments: string[]) {
    await this.page.goto(this.urlFor(segments));
  }

  headingWithText(text: string): Locator {
    return this.page.getByRole('heading', { name: text, exact: true, level: 1 });
  }

  get breadcrumb(): Locator {
    return this.page.locator('utrecht-breadcrumb-nav');
  }

  get breadcrumbLinks(): Locator {
    return this.breadcrumb.getByRole('link');
  }

  // getByRole has no option for matching aria-current, so an attribute selector is required.
  get currentBreadcrumbLink(): Locator {
    return this.breadcrumb.locator('a[aria-current="location"]');
  }

  get sidebar(): Locator {
    return this.page.locator('clippy-side-navigation[label="Design tokens"]');
  }

  sidebarLink(label: string): Locator {
    return this.sidebar.getByRole('link', { name: label, exact: true });
  }

  get selectedSidebarLink(): Locator {
    return this.sidebar.locator('a[aria-current="page"]');
  }
}

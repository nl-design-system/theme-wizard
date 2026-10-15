import { type Page } from '@playwright/test';

// Shared behaviour for the /design-tokens/basis and /design-tokens/nl landing pages.
export class DesignTokensIndexPage {
  constructor(
    public readonly page: Page,
    private readonly namespace: 'basis' | 'nl',
  ) {}

  get url() {
    return `/design-tokens/${this.namespace}`;
  }

  async goto() {
    await this.page.goto(this.url);
  }
}

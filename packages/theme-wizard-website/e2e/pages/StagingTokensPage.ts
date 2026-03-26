import { type Page } from '@playwright/test';

export class StagingTokensPage {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto(this.url);
  }

  get url() {
    return '/staging-tokens';
  }
}

import { type Page } from '@playwright/test';

export class BasisTokensPage {
  constructor(public readonly page: Page) {}

  get url() {
    return '/basis-tokens';
  }

  async goto() {
    await this.page.goto(this.url);
  }
}

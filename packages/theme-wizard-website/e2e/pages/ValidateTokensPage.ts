import { type Locator, type Page } from '@playwright/test';

export class ValidateTokensPage {
  constructor(public readonly page: Page) {}

  get url() {
    return '/validate-tokens';
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async selectFile(contents: string) {}
}

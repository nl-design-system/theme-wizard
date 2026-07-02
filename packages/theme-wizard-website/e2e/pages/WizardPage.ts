import { type Page } from '@playwright/test';

export class WizardPage {
  constructor(public readonly page: Page) {}

  get url() {
    return '/wizard';
  }

  async goto() {
    await this.page.goto(this.url);
  }
}

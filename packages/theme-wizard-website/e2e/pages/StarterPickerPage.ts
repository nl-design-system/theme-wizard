import { type Page } from '@playwright/test';

export class StarterPickerPage {
  constructor(public readonly page: Page) {}

  get url() {
    return '/';
  }

  async goto() {
    await this.page.goto(this.url);
  }
}

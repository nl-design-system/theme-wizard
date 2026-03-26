import { type Page } from '@playwright/test';

export class ComponentPage {
  constructor(public readonly page: Page) {}

  get url() {
    return '/components/code-block/tokens';
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async getInputOptions(label: string, value = '') {
    const input = this.page.getByLabel(label);
    await input.fill(value); // trigger the dropdown with options
    return this.page.getByRole('option');
  }
}

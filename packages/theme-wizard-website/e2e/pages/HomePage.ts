import { type Page, type Locator } from '@playwright/test';

export class HomePage {
  public readonly input: Locator;

  constructor(public readonly page: Page) {
    this.input = page.getByLabel('Website URL');
  }

  async goto() {
    await this.page.goto('/');
  }

  async scrapeUrl(url: string) {
    await this.input.fill(url);
    await this.page.getByRole('button', { name: 'Huisstijl ophalen' }).click();
  }
}

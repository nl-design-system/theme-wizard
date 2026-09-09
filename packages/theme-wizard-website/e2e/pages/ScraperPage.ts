import { type Page, type Locator } from '@playwright/test';

export class ScraperPage {
  public readonly input: Locator;

  constructor(public readonly page: Page) {
    this.input = page.getByLabel('Website URL');
  }

  get url() {
    return '/scrape-tokens';
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async scrapeUrl(url: string) {
    await this.input.fill(url);
    await this.page.getByRole('button', { name: 'Huisstijl ophalen' }).click();
  }
}

import { type Page, type Locator, expect } from '@playwright/test';

export class PublishPage {
  readonly downloadJsonButton: Locator;
  readonly downloadCssButton: Locator;

  constructor(public readonly page: Page) {
    this.downloadJsonButton = this.page.getByRole('button', { name: 'Thema downloaden (JSON)' });
    this.downloadCssButton = this.page.getByRole('link', { name: 'Thema downloaden (CSS)' });
  }

  get url() {
    return '/publish-tokens';
  }

  async goto() {
    await this.page.goto(this.url);
    await expect(this.downloadCssButton).toBeVisible();
  }

  async reset() {
    await this.page.getByRole('button', { name: 'Begin opnieuw' }).click();
    await this.page.getByRole('dialog').getByRole('button', { name: 'Opnieuw beginnen' }).click();
    await expect(this.downloadJsonButton).toBeDisabled();
  }
}

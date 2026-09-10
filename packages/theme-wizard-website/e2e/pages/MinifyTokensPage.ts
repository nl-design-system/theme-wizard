import { type Locator, type Page } from '@playwright/test';

export class MinifyTokensPage {
  constructor(public readonly page: Page) {}

  get url() {
    return '/minify-tokens';
  }

  async goto() {
    await this.page.goto(this.url);
  }

  get fileInput(): Locator {
    return this.page.locator('input[type=file]');
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Verklein thema' });
  }

  get resultOutput(): Locator {
    return this.page.getByLabel('Validatieresultaat');
  }

  get downloadButton(): Locator {
    return this.page.getByRole('link', { name: 'Download thema (JSON)' });
  }

  async selectFile(contents: string) {
    await this.fileInput.setInputFiles({
      name: 'tokens.json',
      buffer: Buffer.from(contents),
      mimeType: 'application/json',
    });
  }

  async minify() {
    await this.submitButton.click();
  }
}

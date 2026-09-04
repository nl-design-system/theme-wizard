import { type Locator, type Page } from '@playwright/test';

export class UploadTokensPage {
  constructor(public readonly page: Page) {}

  get url() {
    return '/upload-tokens';
  }

  async goto() {
    await this.page.goto(this.url);
  }

  get fileInput(): Locator {
    return this.page.locator('input[type=file]');
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Thema gebruiken' });
  }

  get confirmButton(): Locator {
    return this.page.getByRole('button', { name: 'Doorgaan met dit thema' });
  }

  get fileInputError(): Locator {
    return this.page.locator('#input-file-error');
  }

  get uploadedTokensSummary(): Locator {
    return this.page.getByText(/\d+ tokens? gevonden in je bestand/);
  }

  get filledFromDefaultsDetails(): Locator {
    return this.page.getByText(/\d+ tokens? (is|zijn) aangevuld vanuit het Start-thema/);
  }

  get softIssuesDetails(): Locator {
    return this.page.getByText(/\d+ kwaliteitswaarschuwing(en)? gevonden/);
  }

  async selectFile(contents: string) {
    await this.fileInput.setInputFiles({
      name: 'tokens.json',
      buffer: Buffer.from(contents),
      mimeType: 'application/json',
    });
  }

  async upload() {
    await this.submitButton.click();
  }

  async confirm() {
    await this.confirmButton.click();
  }
}

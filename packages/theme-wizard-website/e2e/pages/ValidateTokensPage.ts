import { type Locator, type Page } from '@playwright/test';

export class ValidateTokensPage {
  constructor(public readonly page: Page) {}

  get url() {
    return '/validate-tokens';
  }

  async goto() {
    await this.page.goto(this.url);
  }

  get fileInput(): Locator {
    return this.page.locator('input[type=file]');
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Valideer thema' });
  }

  get resultDescription(): Locator {
    return this.page.locator('#validation-error-msg');
  }

  get resultOutput(): Locator {
    return this.page.getByLabel('Validatieresultaat');
  }

  async selectFile(contents: string) {
    await this.fileInput.setInputFiles({
      name: 'tokens.json',
      buffer: Buffer.from(contents),
      mimeType: 'application/json',
    });
  }

  async validate() {
    await this.submitButton.click();
  }
}

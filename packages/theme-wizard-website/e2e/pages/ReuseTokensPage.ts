import { type Locator, type Page } from '@playwright/test';

export class ReuseTokensPage {
  constructor(public readonly page: Page) {}

  get url() {
    return '/reuse-tokens';
  }

  async goto() {
    await this.page.goto(this.url);
  }

  get fileInput(): Locator {
    return this.page.locator('input[type=file]');
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Herbruikbare tokens zoeken' });
  }

  get applySuggestionsButton(): Locator {
    return this.page.getByRole('button', { name: 'Suggesties toepassen' });
  }

  get downloadButton(): Locator {
    return this.page.getByRole('button', { name: 'Download thema (JSON)' });
  }

  get suggestionRows(): Locator {
    return this.page.locator('.utrecht-table__body .utrecht-table__row');
  }

  get resultOutput(): Locator {
    return this.page.getByLabel('Validatieresultaat');
  }

  get fileInputError(): Locator {
    return this.page.locator('#input-file-error');
  }

  async selectFile(contents: string) {
    await this.fileInput.setInputFiles({
      name: 'tokens.json',
      buffer: Buffer.from(contents),
      mimeType: 'application/json',
    });
  }

  async findReusableTokens() {
    await this.submitButton.click();
  }

  async applySuggestions() {
    await this.applySuggestionsButton.click();
  }
}

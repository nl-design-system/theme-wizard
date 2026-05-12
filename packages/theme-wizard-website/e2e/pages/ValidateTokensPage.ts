import { type Locator, type Page } from '@playwright/test';

export class ValidateTokensPage {
  constructor(public readonly page: Page) {}

  get url() {
    return '/validate-tokens';
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async selectFile(contents: string) {}
}

// Create a new `wizard-file-input` component, take along all the styles from packages/theme-wizard-app/src/components/wizard-token-validation-form/styles.ts. Must be form associated

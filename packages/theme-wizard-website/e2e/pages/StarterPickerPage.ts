import { type Locator, type Page } from '@playwright/test';

export class StarterPickerPage {
  readonly submitButton: Locator;

  constructor(public readonly page: Page) {
    this.submitButton = this.page.getByRole('button', { name: 'Volgende stap' });
  }

  get url() {
    return '/';
  }

  async goto() {
    await this.page.goto(this.url);
  }

  option(label: string): Locator {
    return this.page.getByRole('radio', { name: label });
  }

  async choose(label: string) {
    await this.option(label).click();
    await this.submitButton.click();
  }
}

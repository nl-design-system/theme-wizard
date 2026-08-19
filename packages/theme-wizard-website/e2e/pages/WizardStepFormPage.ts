import { type Locator, type Page } from '@playwright/test';

export class WizardStepFormPage {
  readonly legend: Locator;
  readonly options: Locator;
  readonly saveButton: Locator;
  readonly cancelLink: Locator;

  constructor(public readonly page: Page) {
    this.legend = this.page.locator('legend');
    this.options = this.page.getByRole('radio');
    this.saveButton = this.page.getByRole('button', { name: 'Opslaan' });
    this.cancelLink = this.page.getByRole('link', { name: 'Annuleren' });
  }

  get url() {
    return '/wizard/basis-text-font-family-default';
  }

  async goto(path: string = this.url) {
    await this.page.goto(path);
  }

  optionCard(label: string): Locator {
    return this.page.locator('clippy-card-radio-option').filter({ hasText: label });
  }

  /** Reads the option's accessible name straight from the accessibility tree. */
  async getOptionLabel(radio: Locator): Promise<string> {
    // Snapshot for a single radio is `- radio "<label>"`, or `- radio "<label>" [checked]` when
    // selected. The quoted part is a JSON string literal, so JSON.parse handles the escaping.
    const snapshot = (await radio.ariaSnapshot()).trim();
    const start = snapshot.indexOf('"');
    const end = snapshot.lastIndexOf('"') + 1;
    return JSON.parse(snapshot.slice(start, end));
  }

  /** Clicking 'Save' navigates back to the index page, so callers need to re-navigate to see the saved state. */
  async save() {
    await this.saveButton.click();
    await this.page.waitForURL('**/wizard/');
  }
}

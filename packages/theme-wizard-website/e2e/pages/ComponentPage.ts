import { type Locator, type Page } from '@playwright/test';

export class ComponentPage {
  constructor(public readonly page: Page) {}

  get url() {
    return '/components/code-block/tokens';
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async getInputOptions(label: string, value = '') {
    const input = this.page.getByLabel(label);
    await input.fill(value); // trigger the dropdown with options
    return this.page.getByRole('option');
  }

  getComputedProperty(element: Locator, property: string) {
    return element.evaluate((el, prop) => getComputedStyle(el).getPropertyValue(prop), property);
  }

  getComboboxPreviewElement(label: string): Locator {
    const combobox = this.page.locator(`wizard-token-combobox[name="${label}"]`);
    return combobox.locator('.clippy-combobox__current-option .wizard-token-combobox__preview');
  }
}

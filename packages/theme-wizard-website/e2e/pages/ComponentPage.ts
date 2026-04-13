import { type Locator, type Page } from '@playwright/test';

export class ComponentPage {
  constructor(public readonly page: Page) {}

  get url() {
    return '/components/button/tokens';
  }

  async goto() {
    await this.page.goto(this.url);
  }

  getScopedInput(label: string, sectionId = 'AdvancedButtonTypography') {
    return this.page.locator(`section#${sectionId}`).getByLabel(label);
  }

  async getInputOptions(label: string, value = '', sectionId = 'AdvancedButtonTypography') {
    const input = this.getScopedInput(label, sectionId);
    await input.fill(value); // trigger the dropdown with options
    return this.page.getByRole('option');
  }

  getComputedProperty(element: Locator, property: string) {
    return element.evaluate((el: Element, prop: string) => getComputedStyle(el).getPropertyValue(prop), property);
  }

  getComboboxPreviewElement(label: string, sectionId = 'AdvancedFocusButton'): Locator {
    const combobox = this.page.locator(`section#${sectionId}`).locator(`wizard-token-combobox[name="${label}"]`);
    return combobox.locator('.clippy-combobox__current-option .wizard-token-combobox__preview');
  }
}

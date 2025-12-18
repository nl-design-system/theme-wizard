import { type Page, type Locator, expect } from '@playwright/test';

export class ThemeWizardPage {
  readonly preview: Locator;
  readonly sidebar: Locator;
  readonly templateSelect: Locator;
  readonly downloadButton: Locator;

  constructor(public readonly page: Page) {
    this.preview = this.page.getByTestId('preview');
    this.sidebar = this.page.locator('.wizard-app__sidebar');
    this.templateSelect = this.page.getByLabel('Weergave');
    this.downloadButton = this.page.getByRole('button', { name: 'Download tokens als JSON' });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.preview).toBeVisible();
  }

  async scrapeUrl(url: string) {
    const input = this.sidebar.getByLabel('Website URL');
    await input.fill(url);
    await this.sidebar.getByRole('button', { name: 'Analyseer' }).click();
    await expect(input).not.toHaveAttribute('data-state', 'pending');
  }

  async selectTemplate(templateName: string) {
    await this.templateSelect.selectOption({ label: templateName });
  }

  /** @param colorHexValue A 6-digit hex value */
  async changeColor(label: string, colorHexValue: string) {
    const input = this.page.getByLabel(label).first();
    await input.fill(colorHexValue);
    // Need to trigger blur so that the color input fires a change event
    await input.blur();
  }

  async changeHeadingFont(fontName: string) {
    const input = this.page.getByLabel('Koppen');
    await input.fill(fontName);
    await input.blur();
  }

  async changeBodyFont(fontName: string) {
    const input = this.page.getByLabel('Lopende tekst');
    await input.fill(fontName);
    await input.blur();
  }

  getPreviewChild(): Locator {
    return this.preview.locator(':first-child').first();
  }

  getCollageComponents(): Locator {
    return this.preview.locator('.theme-wizard-collage-component');
  }

  getHeading(level: number): Locator {
    return this.preview.getByRole('heading', { level }).first();
  }

  getParagraph(): Locator {
    return this.preview.getByRole('paragraph').first();
  }

  getErrorAlert(): Locator {
    return this.page.getByTestId('validation-errors-alert');
  }

  async reset() {
    await this.page.getByRole('button', { name: 'Reset tokens' }).click();
  }
}

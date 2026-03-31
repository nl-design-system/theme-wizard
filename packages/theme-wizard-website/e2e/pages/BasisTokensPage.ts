import { type Page, type Locator, expect } from '@playwright/test';

export class BasisTokensPage {
  readonly preview: Locator;
  readonly sidebar: Locator;
  readonly templateSelect: Locator;
  readonly downloadJsonButton: Locator;
  readonly downloadCssButton: Locator;

  constructor(public readonly page: Page) {
    this.preview = this.page.getByTestId('preview');
    this.sidebar = this.page.locator('.wizard-theme-sidebar');
    this.templateSelect = this.page.getByLabel('Weergave');
    this.downloadJsonButton = this.page.getByRole('button', { name: 'Thema downloaden (JSON)' });
    this.downloadCssButton = this.page.getByRole('link', { name: 'Thema downloaden (CSS)' });
  }

  get url() {
    return '/basis-tokens';
  }

  async goto() {
    await this.page.goto(this.url);
    await expect(this.preview).toBeVisible();
  }

  async selectTemplate(templateName: string) {
    await this.templateSelect.selectOption({ label: templateName });
  }

  /** @param colorHexValue A 6-digit hex value */
  async changeColor(label: string, colorHexValue: string) {
    const input = this.page.getByLabel(label).first();
    await input.fill(colorHexValue);
    await input.press('Enter');
  }

  async changeHeadingFont(fontName: string) {
    const input = this.page.getByLabel('Koppen');
    await input.fill(fontName);
    await input.press('Enter');
  }

  async changeBodyFont(fontName: string) {
    const input = this.page.getByLabel('Lopende tekst');
    await input.fill(fontName);
    await input.press('Enter');
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

  async getColorStops(label: string): Promise<(string | null)[]> {
    const input = this.page.locator(`wizard-colorscale-input[label="${label}"]`);
    const stops = await input.getByTestId('color-scale-stop').all();
    return Promise.all(stops.map((stop) => stop.getAttribute('data-value')));
  }

  async getInputOptions(label: string, value = '') {
    const input = this.page.getByLabel(label);
    await input.fill(value); // trigger the dropdown with options
    return this.page.getByRole('option');
  }

  getErrorAlert(): Locator {
    return this.page.getByTestId('validation-errors-alert');
  }

  async reset() {
    await this.page.getByRole('button', { name: 'Begin opnieuw' }).click();
    await this.page.getByRole('dialog').getByRole('button', { name: 'Opnieuw beginnen' }).click();
  }
}

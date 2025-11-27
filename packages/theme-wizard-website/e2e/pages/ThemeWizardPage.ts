import { type Page, type Locator, expect } from '@playwright/test';

export class ThemeWizardPage {
  readonly preview: Locator;
  readonly sidebar: Locator;
  readonly templateSelect: Locator;
  readonly downloadButton: Locator;
  readonly scrapedTokensContainer: Locator;

  constructor(public readonly page: Page) {
    this.preview = this.page.getByTestId('preview');
    this.sidebar = this.page.locator('theme-wizard-sidebar');
    this.scrapedTokensContainer = this.page.getByRole('group', { name: 'Basiskleuren' });
    this.templateSelect = this.page.getByLabel('Voorvertoning');
    this.downloadButton = this.page.getByRole('button', { name: 'Download tokens als JSON' });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.preview).toBeVisible();
  }

  async scrapeUrl(url: string) {
    await this.sidebar.getByLabel('Website URL').fill(url);
    await this.sidebar.getByRole('button', { name: 'Analyseer' }).click();
    // TODO: implement a more user-friendly way to determine if the form is idle, pending or ready
    // By lack of a visual/accessible indicator that the form is done working, we check that the first input appears
    const firstColor = this.scrapedTokensContainer.locator('input').first();
    await firstColor.waitFor({ state: 'attached' });
  }

  async selectTemplate(templateName: string) {
    await this.templateSelect.selectOption({ label: templateName });
  }

  async changeHeadingFont(fontName: string) {
    await this.page.getByLabel('Koppen').selectOption({ label: fontName });
  }

  async changeBodyFont(fontName: string) {
    await this.page.getByLabel('Lopende tekst').selectOption({ label: fontName });
  }

  /** @param colorHexValue A 6-digit hex value */
  async changeColor(label: string, colorHexValue: string) {
    const input = this.page.getByLabel(label);
    await input.fill(colorHexValue);
    // Need to trigger blur so that the color input fires a change event
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

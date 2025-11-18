import { type Page, type Locator, expect } from '@playwright/test';

export class ThemeWizardPage {
  readonly preview: Locator;
  readonly sidebar: Locator;
  private readonly templateSelect: Locator;
  private readonly previewButton: Locator;

  constructor(public readonly page: Page) {
    this.preview = this.page.getByTestId('preview');
    this.sidebar = this.page.locator('theme-wizard-sidebar');
    this.templateSelect = this.page.getByLabel('Voorvertoning');
    this.previewButton = this.page.getByRole('button', { name: 'Voorvertonen' });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.preview).toBeVisible();
  }

  async selectTemplate(templateName: string) {
    await this.templateSelect.selectOption({ label: templateName });
    await this.previewButton.click();
  }

  async changeHeadingFont(fontName: string) {
    await this.page.getByLabel('Koppen').selectOption({ label: fontName });
  }

  async changeBodyFont(fontName: string) {
    await this.page.getByLabel('Lopende tekst').selectOption({ label: fontName });
  }

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
}

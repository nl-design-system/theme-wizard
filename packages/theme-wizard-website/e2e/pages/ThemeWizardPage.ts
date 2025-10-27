import { type Page, type Locator, expect } from '@playwright/test';

export class ThemeWizardPage {
  readonly preview: Locator;
  private readonly templateSelect: Locator;

  constructor(public readonly page: Page) {
    this.preview = this.page.getByTestId('preview');
    this.templateSelect = this.page.getByLabel('Voorvertoning');
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.preview).toBeVisible();
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
}

import { type Page, type Locator, expect } from '@playwright/test';

export class ThemeWizardPage {
  private readonly preview: Locator;
  private readonly templateSelect: Locator;

  constructor(public readonly page: Page) {
    this.preview = this.page.getByTestId('preview');
    this.templateSelect = this.page.getByLabel('Kies een template');
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

  async verifyFontChange(element: Locator, fontFamily: RegExp) {
    await expect(element).not.toHaveCSS('font-family', fontFamily);
  }

  async verifyFontApplied(element: Locator, fontFamily: RegExp) {
    await expect(element).toHaveCSS('font-family', fontFamily);
  }

  async switchToTemplateAndVerify(templateName: string, expectedText: string) {
    await this.selectTemplate(templateName);
    await expect(this.preview).toContainText(expectedText);
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

  getParagraphs(): Locator {
    return this.preview.getByRole('paragraph').first();
  }
}

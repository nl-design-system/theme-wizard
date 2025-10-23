import { type Page, type Locator, expect } from '@playwright/test';

export class ThemeWizardPage {
  constructor(private page: Page) {}

  static async create(page: Page): Promise<ThemeWizardPage> {
    const themeWizard = new ThemeWizardPage(page);
    await themeWizard.pageInstance.goto('/');
    await expect(themeWizard.pageInstance.getByTestId('preview')).toBeVisible();

    return themeWizard;
  }

  get pageInstance() {
    return this.page;
  }

  get preview(): Locator {
    return this.page.getByTestId('preview');
  }

  async selectTemplate(templateName: string) {
    const templateSelect = this.page.getByLabel('Kies een template');
    await templateSelect.selectOption({ label: templateName });
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

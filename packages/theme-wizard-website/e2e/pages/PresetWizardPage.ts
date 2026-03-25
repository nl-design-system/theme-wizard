import { type Page, type Locator, expect } from '@playwright/test';

export class PresetWizardPage {
  readonly presets: Locator;
  readonly themeApp: Locator;

  constructor(
    public readonly page: Page,
    public readonly componentSlug: string,
  ) {
    this.presets = this.page.locator('wizard-token-preset');
    this.themeApp = this.page.locator('theme-wizard-app');
  }

  async goto() {
    await this.page.goto(`/components/${this.componentSlug}`);
  }

  /** All `<legend>` elements inside wizard-token-preset components. */
  get legends(): Locator {
    return this.presets.locator('legend');
  }

  /** Locate a single preset by its group-label attribute. */
  preset(groupLabel: string): Locator {
    return this.page.locator(`wizard-token-preset[group-label="${groupLabel}"]`);
  }

  /** Wait until a preset's options are loaded, then return the option count. */
  async waitForOptions(groupLabel: string): Promise<number> {
    const preset = this.preset(groupLabel);

    await expect
      .poll(() =>
        preset.evaluate((el) => (el as HTMLElement & { options: unknown[] }).options?.length > 0),
      )
      .toBe(true);

    return preset.evaluate((el) => (el as HTMLElement & { options: unknown[] }).options?.length ?? 0);
  }

  /** Select a preset option by index. */
  async selectOption(groupLabel: string, index: number) {
    const preset = this.preset(groupLabel);
    await this.waitForOptions(groupLabel);

    await preset.evaluate((element, selectedIndex) => {
      (element as HTMLElement & { selectIndex: (index: number) => void }).selectIndex(selectedIndex);
    }, index);
  }

  /** Read a single design token value from the theme. */
  async readTokenValue(tokenPath: string): Promise<string | null> {
    return this.themeApp.evaluate((element, path) => {
      const themeHost = element as HTMLElement & {
        theme?: {
          at: (path: string) => { $value?: unknown } | undefined;
        };
      };

      return (themeHost.theme?.at(path)?.$value as string) ?? null;
    }, tokenPath);
  }

  /** Read the resolved value text (e.g. "0.875rem") from the selected option's shadow DOM. */
  async readSelectedResolvedValue(groupLabel: string): Promise<string | null> {
    return this.preset(groupLabel).evaluate((el) => {
      const resolved = el.shadowRoot?.querySelector('.wizard-token-preset__option-value-resolved');
      return resolved?.textContent?.trim() ?? null;
    });
  }

  /** Read the token reference text (e.g. "basis.text.font-size.sm") from the selected option's shadow DOM. */
  async readSelectedTokenReference(groupLabel: string): Promise<string | null> {
    return this.preset(groupLabel).evaluate((el) => {
      const token = el.shadowRoot?.querySelector('.wizard-token-preset__option-value-token');
      return token?.textContent?.trim() ?? null;
    });
  }
}

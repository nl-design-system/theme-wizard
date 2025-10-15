import type { SidebarConfig } from '../utils/types';
import { ThemeModel } from '../models';
/**
 * ThemeController - Orchestrator for managing theme state and coordinating components
 *
 * This controller acts as a central orchestrator that:
 * - Manages the Theme model
 * - Coordinates state changes and exposes data to the host
 * - Provides high-level methods for theme operations
 */
export class ThemeController {
  /** Theme model containing configuration and generation logic */
  public themeModel: ThemeModel;
  readonly #stylesheet: CSSStyleSheet = new CSSStyleSheet();

  constructor() {
    this.themeModel = new ThemeModel();
    this.updateStylesheet();
  }

  get stylesheet(): CSSStyleSheet {
    return this.#stylesheet;
  }

  applyPartial(partial: Partial<SidebarConfig>): void {
    this.themeModel.updateConfig(partial);
    this.updateStylesheet();
  }

  resetToDefaults(): void {
    this.themeModel.reset();
    this.updateStylesheet();
  }

  getConfig(): SidebarConfig {
    return this.themeModel.getConfig();
  }

  private updateStylesheet(): void {
    const { bodyFont, headingFont } = this.themeModel.getConfig();

    const css = `:host {
      /* Design tokens based on theme configuration */
      --basis-text-font-family-default: ${bodyFont || '"Comic Sans"'};
      --basis-text-font-family-monospace: 'Change me';
      --basis-text-font-weight-default: 400;
      --basis-text-font-weight-bold: 700;
      --basis-heading-font-family: ${headingFont || '"Comic Sans"'};
      --basis-heading-font-bold: 700;
    }`;

    this.#stylesheet.replaceSync(css);
  }
}

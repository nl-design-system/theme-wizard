import type { SidebarConfig } from '../utils/types';
import { ThemeModel } from '../models';
import { generateThemeCSS } from '../utils/css-generator';

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

  hostConnected(): void {}

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

  /**
   * Updates the adopted stylesheet with generated CSS from the current theme config
   * All theme-related CSS generation is delegated to the css-generator utility
   */
  private updateStylesheet(): void {
    const config = this.themeModel.getConfig();
    const css = generateThemeCSS(config);
    this.#stylesheet.replaceSync(css);
  }
}

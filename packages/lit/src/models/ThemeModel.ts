/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import type { SidebarConfig } from '../utils/types';
import { DEFAULT_CONFIG } from '../constants/default';

/**
 * Theme Model - Represents the current theme state and provides conversion methods
 *
 * This model:
 * - Stores theme configuration
 * - Generates CSS from configuration
 */
export class ThemeModel {
  private config: SidebarConfig;
  private readonly stylesheet: CSSStyleSheet = new CSSStyleSheet();

  constructor(config: Partial<SidebarConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.updateStylesheet();
  }

  getConfig(): SidebarConfig {
    return { ...this.config };
  }

  updateConfig(partial: Partial<SidebarConfig>): void {
    this.config = this.#mergeConfig(partial);
    this.updateStylesheet();
  }

  #mergeConfig(partial: Partial<SidebarConfig>): SidebarConfig {
    return { ...this.config, ...partial };
  }

  reset(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.updateStylesheet();
  }

  getStylesheet(): CSSStyleSheet {
    return this.stylesheet;
  }

  private updateStylesheet(): void {
    const { bodyFont, headingFont } = this.config;

    const css = `:host {
      /* Design tokens based on theme configuration */
      --basis-text-font-family-default: ${bodyFont || '"Comic Sans"'};
      --basis-text-font-family-monospace: 'Change me';
      --basis-text-font-weight-default: 400;
      --basis-text-font-weight-bold: 700;
      --basis-heading-font-family: ${headingFont || '"Comic Sans"'};
      --basis-heading-font-bold: 700;
    }`;

    this.stylesheet.replaceSync(css);
  }
}

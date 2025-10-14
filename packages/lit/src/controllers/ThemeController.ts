import type { ReactiveController, ReactiveControllerHost } from 'lit';
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
export class ThemeController implements ReactiveController {
  private readonly host: ReactiveControllerHost;

  /** Theme model containing configuration and generation logic */
  public themeModel: ThemeModel;

  #scrapedTokens: Record<string, unknown> = {};

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    this.themeModel = new ThemeModel();
    host.addController(this);
  }

  hostConnected(): void {
    /** */
  }

  hostDisconnected(): void {
    /** */
  }

  /**
   * Check if the source URL is new
   * @param partial - Partial<SidebarConfig>
   * @returns boolean
   */
  #isNewSourceUrl(partial: Partial<SidebarConfig>): boolean {
    const current = this.themeModel.getConfig().sourceUrl;
    return Boolean(partial.sourceUrl && partial.sourceUrl !== current);
  }

  /**
   * Apply partial configuration
   * @param partial - Partial<SidebarConfig>
   */
  #applyPartial(partial: Partial<SidebarConfig>): void {
    this.themeModel.updateConfig(partial);
  }

  /**
   * Set source URL with reset
   * @param sourceUrl - string
   */
  #setSourceUrlWithReset(sourceUrl: string): void {
    this.themeModel.reset();
    this.themeModel.updateConfig({ sourceUrl });
  }

  updateTheme(partial: Partial<SidebarConfig>): void {
    if (this.#isNewSourceUrl(partial)) {
      this.#setSourceUrlWithReset(partial.sourceUrl!);
    } else {
      this.#applyPartial(partial);
    }

    this.host.requestUpdate();
  }

  resetToDefaults(): void {
    this.themeModel.reset();
    this.host.requestUpdate();
  }

  getConfig(): SidebarConfig {
    return this.themeModel.getConfig();
  }

  getStylesheet(): CSSStyleSheet {
    return this.themeModel.getStylesheet();
  }

  set scrapedTokens(tokens: Record<string, unknown>) {
    this.#scrapedTokens = tokens;
    this.host.requestUpdate();
  }

  get scrapedTokens() {
    return this.#scrapedTokens;
  }
}

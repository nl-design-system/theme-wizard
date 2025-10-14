/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { SidebarConfig } from '../utils/types';
import { DEFAULT_CONFIG } from '../constants/default';
import Scraper from '../lib/Scraper';
import { ThemeModel } from '../models';
import { loadUrlParams, updateURLParameters } from '../utils';

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

  readonly #scraper: Scraper;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    this.themeModel = new ThemeModel(this.loadInitialConfig());
    const scraperURL = document.querySelector('meta[name=scraper-api]')?.getAttribute('content') || '';
    this.#scraper = new Scraper(scraperURL);
    host.addController(this);
  }

  hostConnected(): void {
    /** */
  }

  hostDisconnected(): void {
    /** */
  }

  /**
   * Load initial configuration from URL parameters
   * @returns Partial<SidebarConfig>
   */
  private loadInitialConfig(): Partial<SidebarConfig> {
    const params = loadUrlParams(['sourceUrl', 'headingFont', 'bodyFont']);

    const config: Partial<SidebarConfig> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        config[key as keyof SidebarConfig] = value;
      }
    });

    return config;
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

  #finalizeUpdate(): void {
    this.#syncToUrl();
    this.host.requestUpdate();
  }

  updateTheme(partial: Partial<SidebarConfig>): void {
    if (this.#isNewSourceUrl(partial)) {
      this.#setSourceUrlWithReset(partial.sourceUrl!);
    } else {
      this.#applyPartial(partial);
    }
    this.#finalizeUpdate();
  }

  /**
   * Sync current configuration to URL parameters
   */
  #syncToUrl(): void {
    updateURLParameters(this.themeModel.getConfig(), DEFAULT_CONFIG);
  }

  resetToDefaults(): void {
    this.themeModel.reset();
    this.#syncToUrl();
    this.host.requestUpdate();
  }

  getConfig(): SidebarConfig {
    return this.themeModel.getConfig();
  }

  getStylesheet(): CSSStyleSheet {
    return this.themeModel.getStylesheet();
  }

  analyzeSourceUrl = async (sourceUrl: string): Promise<void> => {
    try {
      this.#scrapedTokens = await this.#scraper.getTokens(new URL(sourceUrl));
      this.updateTheme({ sourceUrl });
    } catch {
      console.error('Failed to analyze website');
    }
  };

  getScrapedTokens(): Record<string, unknown> {
    return this.#scrapedTokens;
  }
}

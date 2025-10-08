/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Prop, State, h } from '@stencil/core';
import type { SidebarConfig } from '../../utils/types';
import { DEFAULT_CONFIG } from '../../constants/default';
import { loadUrlParams, updateURLParameters } from '../../utils';

@Component({
  shadow: true,
  styleUrl: 'wrapper.css',
  tag: 'theme-wizard-wrapper',
})
export class AppWrapper {
  @Prop() pageTitle: string = 'Live Voorbeeld';
  @Prop() pageDescription: string =
    'Hieronder zie je een live voorbeeld van de opgegeven website met de geselecteerde huisstijl.';

  @State() private config: SidebarConfig = this.getInitialConfig();

  componentWillLoad() {
    // Initialize config from URL params
    this.config = this.getInitialConfig();
  }

  private readonly handleConfigChange = (event: CustomEvent<Partial<SidebarConfig>>) => {
    const config = event.detail || {};

    // Determine update strategy when source URL changes - should reset all styling to defaults
    const isNewSourceUrl = config.sourceUrl && config.sourceUrl !== this.config.sourceUrl;
    if (isNewSourceUrl) {
      this.resetStylingForNewSource(config.sourceUrl!);
      this.syncConfigChanges();
      return;
    }

    this.mergeConfigUpdate(config);
    this.syncConfigChanges();
  };

  private getInitialConfig(): SidebarConfig {
    const params = loadUrlParams(['sourceUrl', 'headingFont', 'bodyFont', 'themeClass', 'customCss']);

    // Only override defaults with non-empty values from URL
    const config = { ...DEFAULT_CONFIG };
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        config[key as keyof SidebarConfig] = value;
      }
    });

    return config;
  }

  /**
   * Reset all styling when analyzing a new source URL
   */
  private resetStylingForNewSource(newSourceUrl: string) {
    this.config = {
      ...DEFAULT_CONFIG,
      sourceUrl: newSourceUrl,
    };
  }

  /**
   * Merge partial config update into existing config
   */
  private mergeConfigUpdate(partial: Partial<SidebarConfig>) {
    this.config = {
      ...this.config,
      ...partial,
    };
  }

  /**
   * Sync config changes to URL parameters
   */
  private syncConfigChanges() {
    updateURLParameters(this.config, DEFAULT_CONFIG);
  }

  render() {
    return (
      <div class="theme-app">
        <theme-wizard-sidebar
          sourceUrl={this.config.sourceUrl}
          headingFont={this.config.headingFont}
          bodyFont={this.config.bodyFont}
          themeClass={this.config.themeClass}
          customCss={this.config.customCss}
          onConfigChange={(e) => this.handleConfigChange(e)}
        ></theme-wizard-sidebar>

        <main class="theme-preview-main" id="main-content" role="main">
          <h2 class="theme-preview-main__title">{this.pageTitle}</h2>
          <p class="theme-preview-main__description">{this.pageDescription}</p>

          <section class="theme-preview" aria-label="Live voorbeeld van toegepaste huisstijl">
            <theme-wizard-preview
              url={this.config.sourceUrl}
              headingFontFamily={this.config.headingFont}
              bodyFontFamily={this.config.bodyFont}
              themeClass={this.config.themeClass}
              customCss={this.config.customCss}
            ></theme-wizard-preview>
          </section>
        </main>
      </div>
    );
  }
}

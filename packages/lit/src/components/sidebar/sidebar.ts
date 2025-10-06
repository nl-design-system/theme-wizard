/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { SidebarConfig } from './types.js';
import { processCustomCss, loadUrlParams, updateUrlParams } from '../../helpers';
import sidebarStyles from './sidebar.css.js';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: SidebarConfig = {
  bodyFont: 'system-ui, sans-serif',
  customCss: '',
  headingFont: 'system-ui, sans-serif',
  sourceUrl:
    'https://documentatie-git-feat-2654-html-stappen-f9d4f8-nl-design-system.vercel.app/examples/zonder-front-end-framework.html#',
  themeClass: 'voorbeeld-theme',
};

@customElement('lit-theme-sidebar')
export class LitThemeSidebar extends LitElement {
  @property({ type: String, reflect: true })
  sourceUrl = DEFAULT_CONFIG.sourceUrl || '';

  @property({ type: String, reflect: true })
  headingFont = DEFAULT_CONFIG.headingFont || '';

  @property({ type: String, reflect: true })
  bodyFont = DEFAULT_CONFIG.bodyFont || '';

  @property({ type: String, reflect: true })
  themeClass = DEFAULT_CONFIG.themeClass || '';

  @property({ type: String, reflect: true })
  customCss = DEFAULT_CONFIG.customCss || '';

  static readonly styles = [sidebarStyles, buttonStyles, inputStyles];

  connectedCallback() {
    super.connectedCallback();
    this.loadFromUrlParams();
    // Listen for typography changes to update URL parameters
    document.addEventListener('typographyChanged', this.handleTypographyChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('typographyChanged', this.handleTypographyChange);
  }

  private readonly handleTypographyChange = (event: Event) => {
    const customEvent = event as CustomEvent;
    const config = customEvent.detail;

    // Update typography properties if changed
    if (config.headingFont && config.headingFont !== this.headingFont) {
      this.headingFont = config.headingFont;
    }
    if (config.bodyFont && config.bodyFont !== this.bodyFont) {
      this.bodyFont = config.bodyFont;
    }

    // Update URL parameters with all current settings
    const currentConfig = this.getCurrentConfig();
    updateUrlParams(
      {
        url: currentConfig.sourceUrl,
        headingFont: currentConfig.headingFont,
        bodyFont: currentConfig.bodyFont,
        themeClass: currentConfig.themeClass,
        customCss: currentConfig.customCss,
      },
      true,
    );
  };

  private loadFromUrlParams() {
    const params = loadUrlParams(['url', 'headingFont', 'bodyFont', 'themeClass', 'customCss']);

    // Apply loaded parameters to component properties
    if (params.url) this.sourceUrl = params.url;
    if (params.headingFont) this.headingFont = params.headingFont;
    if (params.bodyFont) this.bodyFont = params.bodyFont;
    if (params.themeClass) this.themeClass = params.themeClass;
    if (params.customCss) this.customCss = params.customCss;
  }

  private getCurrentConfig(): SidebarConfig {
    const config = {
      sourceUrl: this.sourceUrl || DEFAULT_CONFIG.sourceUrl,
      headingFont: this.headingFont || DEFAULT_CONFIG.headingFont,
      bodyFont: this.bodyFont || DEFAULT_CONFIG.bodyFont,
      themeClass: this.themeClass || DEFAULT_CONFIG.themeClass,
      customCss: this.customCss || DEFAULT_CONFIG.customCss,
    };

    return config;
  }

  private notifyConfigChanged() {
    const config = this.getCurrentConfig();

    // Process custom CSS if provided
    if (config.customCss && config.sourceUrl) {
      config.customCss = processCustomCss(config.customCss, config.sourceUrl);
    }

    const event = new CustomEvent('configChanged', {
      detail: config,
      bubbles: true,
      composed: true,
    });

    // Dispatch on document level so other components can listen
    document.dispatchEvent(event);
  }

  private readonly handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const field = target.name as keyof SidebarConfig;

    // Update the property directly but don't notify yet
    (this as any)[field] = target.value;
  };

  private exportDesignTokens() {
    const config = this.getCurrentConfig();
    const designTokens = {
      colors: {
        primary: config.sourceUrl,
        secondary: config.themeClass,
      },
      typography: {
        headingFont: config.headingFont,
        bodyFont: config.bodyFont,
      },
      customCss: config.customCss,
    };

    const blob = new Blob([JSON.stringify(designTokens, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-tokens.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private shareTheme() {
    const config = this.getCurrentConfig();

    // Update URL parameters using the utility function
    console.log('🚀 Sidebar calling updateUrlParams with config:', config);
    updateUrlParams({
      url: config.sourceUrl,
      headingFont: config.headingFont,
      bodyFont: config.bodyFont,
      themeClass: config.themeClass,
      customCss: config.customCss,
    });

    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: 'Theme Wizard - Gedeeld Thema',
        url: shareUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Thema URL gekopieerd naar clipboard!');
      });
    }
  }

  private resetToDefaults() {
    this.sourceUrl = DEFAULT_CONFIG.sourceUrl || '';
    this.headingFont = DEFAULT_CONFIG.headingFont || '';
    this.bodyFont = DEFAULT_CONFIG.bodyFont || '';
    this.themeClass = DEFAULT_CONFIG.themeClass || '';
    this.customCss = DEFAULT_CONFIG.customCss || '';

    this.notifyConfigChanged();
  }

  /**
   * Validation methods
   * @private
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Handle form submission and update configuration
   * @param event - Form submit event
   * @private
   */
  private readonly handleAnalyzeClick = (): void => {
    // Validate URL if provided
    if (this.sourceUrl?.trim() && !this.isValidUrl(this.sourceUrl)) {
      return;
    }

    // Update URL parameters with current settings
    const config = this.getCurrentConfig();
    updateUrlParams(
      {
        url: config.sourceUrl,
        headingFont: config.headingFont,
        bodyFont: config.bodyFont,
        themeClass: config.themeClass,
        customCss: config.customCss,
      },
      true,
    );

    this.notifyConfigChanged();
  };
  render() {
    return html`
      <div class="theme-sidebar">
        <h1 class="theme-sidebar__title">Theme Wizard</h1>
        <p class="theme-sidebar__subtitle">Lit</p>

        <div class="theme-sidebar__form">
          <section class="theme-sidebar__section">
            <h2 class="theme-sidebar__heading">Huisstijl URL</h2>
            <div class="theme-form-field">
              <label class="theme-form-field__label" for="source-url">Website URL</label>
              <input
                id="source-url"
                name="sourceUrl"
                class="theme-form-field__input"
                type="url"
                .value=${this.getCurrentConfig().sourceUrl || ''}
                @input=${this.handleInputChange}
                placeholder="https://example.com"
              />

              <button class="theme-button theme-button--primary" type="button" @click=${this.handleAnalyzeClick}>
                Analyseer
              </button>
            </div>
          </section>

          <section class="theme-sidebar__section" aria-labelledby="css-heading">
            <h2 class="theme-sidebar__heading" id="css-heading">Design System CSS</h2>
            <div class="theme-form-field">
              <label class="theme-sidebar__label" for="theme-class">CSS klasse naam</label>
              <input
                id="theme-class"
                name="themeClass"
                class="theme-form-field__input"
                type="text"
                .value=${this.getCurrentConfig().themeClass || ''}
                @input=${this.handleInputChange}
                placeholder="bijv. voorbeeld-theme"
              />
              <small class="theme-form-field__help">bijv. utrecht-theme of voorbeeld-theme</small>
            </div>

            <div class="theme-form-field">
              <label class="theme-sidebar__label" for="custom-css">Extra CSS regels</label>
              <textarea
                id="custom-css"
                name="customCss"
                rows="6"
                class="theme-form-field__input theme-css-input"
                .value=${this.getCurrentConfig().customCss || ''}
                @input=${this.handleInputChange}
                placeholder="Plak hier de gescrapede CSS..."
              ></textarea>
            </div>
            <button
              class="theme-button theme-button--primary theme-button--full"
              type="button"
              @click=${this.handleAnalyzeClick}
            >
              CSS Toepassen
            </button>
          </section>
        </div>

        <lit-theme-typography
          heading-font=${this.getCurrentConfig().headingFont}
          body-font=${this.getCurrentConfig().bodyFont}
        ></lit-theme-typography>

        <!-- Action Buttons -->
        <section class="theme-sidebar__section" aria-labelledby="actions-heading">
          <h2 class="theme-sidebar__heading" id="actions-heading">Acties</h2>
          <div class="theme-sidebar__actions">
            <button
              class="theme-button theme-button--primary theme-button--full"
              @click=${this.exportDesignTokens}
              type="button"
            >
              Exporteer Design Tokens
            </button>
            <button
              class="theme-button theme-button--primary theme-button--full"
              @click=${this.shareTheme}
              type="button"
            >
              Deel Thema
            </button>
            <button
              class="theme-button theme-button--primary theme-button--full"
              @click=${this.resetToDefaults}
              type="button"
            >
              Reset naar Standaard
            </button>
          </div>
        </section>
      </div>
    `;
  }
}

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'lit-theme-sidebar': LitThemeSidebar;
  }
}

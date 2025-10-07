/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { LitElement, html } from 'lit';
import { customElement, eventOptions, property, state } from 'lit/decorators.js';
import type { SidebarConfig } from './types';
import { loadUrlParams, updateURLParameters } from '../../helpers';
import { buttonStyles } from '../../styles/button/index.css';
import sidebarStyles from './sidebar.css';

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

@customElement('theme-wizard-sidebar')
export class LitThemeSidebar extends LitElement {
  @property({ attribute: 'source-url', reflect: true, type: String })
  sourceUrl = DEFAULT_CONFIG.sourceUrl || '';

  @property({ attribute: 'heading-font', reflect: true, type: String })
  headingFont = DEFAULT_CONFIG.headingFont || '';

  @property({ attribute: 'body-font', reflect: true, type: String })
  bodyFont = DEFAULT_CONFIG.bodyFont || '';

  @property({ attribute: 'theme-class', reflect: true, type: String })
  themeClass = DEFAULT_CONFIG.themeClass || '';

  @property({ attribute: 'custom-css', reflect: true, type: String })
  customCss = DEFAULT_CONFIG.customCss || '';

  @state()
  currentConfig: SidebarConfig = { ...DEFAULT_CONFIG };

  // Typed setters map for concise, type-safe updates from inputs
  private readonly setters: Record<keyof SidebarConfig, (v: string) => void> = {
    bodyFont: (v) => (this.bodyFont = v),
    customCss: (v) => (this.customCss = v),
    headingFont: (v) => (this.headingFont = v),
    sourceUrl: (v) => (this.sourceUrl = v),
    themeClass: (v) => (this.themeClass = v),
  };

  static override readonly styles = [sidebarStyles, buttonStyles];

  override connectedCallback() {
    super.connectedCallback();
    this.loadFromUrlParams();
    // Listen for typography changes to update URL parameters
    // document.addEventListener('typographyChanged', this.onTypographyChanged as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // document.removeEventListener('typographyChanged', this.onTypographyChanged as EventListener);
  }

  // // Wrap event to satisfy addEventListener typing
  // private readonly onTypographyChanged = (e: Event) =>
  //   this.handleTypographyChange(e as CustomEvent<{ headingFont?: string; bodyFont?: string }>);

  // private readonly handleTypographyChange = (event: CustomEvent<{ headingFont?: string; bodyFont?: string }>) => {
  //   const config = event.detail || {};

  //   // Update typography properties if changed
  //   if (config.headingFont && config.headingFont !== this.headingFont) {
  //     this.headingFont = config.headingFont;
  //   }
  //   if (config.bodyFont && config.bodyFont !== this.bodyFont) {
  //     this.bodyFont = config.bodyFont;
  //   }

  //   // Update URL parameters (preserve existing params, canonicalize url)
  //   this.updateConfiguration();
  // };

  private readonly loadFromUrlParams = () => {
    const params = loadUrlParams(['sourceUrl', 'headingFont', 'bodyFont', 'themeClass', 'customCss']);
    this.sourceUrl = params.sourceUrl || '';
    this.headingFont = params.headingFont || '';
    this.bodyFont = params.bodyFont || '';
    this.themeClass = params.themeClass || '';
    this.customCss = params.customCss || '';
  };

  private readonly getCurrentConfig = (): SidebarConfig => {
    const config = {
      bodyFont: this.bodyFont || DEFAULT_CONFIG.bodyFont,
      customCss: this.customCss || DEFAULT_CONFIG.customCss,
      headingFont: this.headingFont || DEFAULT_CONFIG.headingFont,
      sourceUrl: this.sourceUrl || DEFAULT_CONFIG.sourceUrl,
      themeClass: this.themeClass || DEFAULT_CONFIG.themeClass,
    };

    return config;
  };

  private notifyConfigChanged() {
    const config = this.getCurrentConfig();

    const event = new CustomEvent('configChanged', {
      bubbles: true,
      composed: true,
      detail: config,
    });

    // Dispatch on document level so other components can listen
    document.dispatchEvent(event);
  }

  @eventOptions({ passive: true })
  private handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const field = target.name as keyof SidebarConfig;
    this.setters[field]?.(target.value);
  }

  private exportDesignTokens() {
    const config = this.getCurrentConfig();
    const designTokens = {
      colors: {
        primary: config.sourceUrl,
        secondary: config.themeClass,
      },
      typography: {
        bodyFont: config.bodyFont,
        headingFont: config.headingFont,
      },
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
    // Preserve other params and canonicalize url
    this.updateConfiguration({});

    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: 'Theme Wizard - Gedeeld Thema',
        url: shareUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        // eslint-disable-next-line no-alert
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

  private readonly handleFormSubmit = (event: Event): void => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const sourceUrl = formData.get('sourceUrl') as string;
    // Validate URL if provided
    if (sourceUrl?.trim() && !this.isValidUrl(sourceUrl)) {
      console.log('sourceUrl is not a valid URL');
      return;
    }

    this.updateConfiguration({ sourceUrl });
  };

  private updateConfiguration(config: Partial<SidebarConfig>) {
    try {
      updateURLParameters(
        {
          bodyFont: config.bodyFont || this.bodyFont,
          customCss: config.customCss || this.customCss,
          headingFont: config.headingFont || this.headingFont,
          sourceUrl: config.sourceUrl || this.sourceUrl,
          themeClass: config.themeClass || this.themeClass,
        },
        DEFAULT_CONFIG,
      );
      this.notifyConfigChanged();
    } catch (error) {
      console.error('Failed to update configuration:', error);
    }
  }

  override render() {
    return html`
      <div class="theme-sidebar">
        <h1 class="theme-sidebar__title">Theme Wizard</h1>
        <p class="theme-sidebar__subtitle">Lit</p>

        <form class="theme-sidebar__form" @submit=${this.handleFormSubmit}>
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

              <button class="theme-button theme-button--primary" type="submit">Analyseer</button>
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
            <button class="theme-button theme-button--primary theme-button--full" type="submit">CSS Toepassen</button>
          </section>
        </form>

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
    'theme-wizard-sidebar': LitThemeSidebar;
  }
}

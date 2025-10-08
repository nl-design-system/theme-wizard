/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { LitElement, html } from 'lit';
import { customElement, eventOptions, state } from 'lit/decorators.js';
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
export class LitSidebar extends LitElement {
  @state()
  private config: SidebarConfig = { ...DEFAULT_CONFIG };

  static override readonly styles = [sidebarStyles, buttonStyles];

  override connectedCallback() {
    super.connectedCallback();
    this.loadFromUrlParams();
    document.addEventListener('configChanged', this.onConfigChanged as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('configChanged', this.onConfigChanged as EventListener);
  }

  private readonly onConfigChanged = (e: Event) => {
    const event = e as CustomEvent<Partial<SidebarConfig>>;
    const detail = event.detail || {};

    if (Object.keys(detail).length === 0) return;

    this.config = { ...this.config, ...detail };
    updateURLParameters(this.config as Record<string, string>, DEFAULT_CONFIG);
  };

  /**
   * Load configuration from URL parameters
   * @private
   */
  private readonly loadFromUrlParams = () => {
    const params = loadUrlParams(['sourceUrl', 'headingFont', 'bodyFont', 'themeClass', 'customCss']);
    this.config = {
      ...DEFAULT_CONFIG,
      ...params,
    };
  };

  private notifyConfigChanged() {
    const event = new CustomEvent('configChanged', {
      bubbles: true,
      composed: true,
      detail: this.config,
    });

    // Dispatch on document level so other components can listen
    document.dispatchEvent(event);
  }

  @eventOptions({ passive: true })
  private handleInputChange(event: Event) {
    const { name, value } = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.config = { ...this.config, [name]: value };
  }

  private exportDesignTokens() {
    const designTokens = {
      colors: {
        primary: this.config.sourceUrl,
        secondary: this.config.themeClass,
      },
      typography: {
        bodyFont: this.config.bodyFont,
        headingFont: this.config.headingFont,
      },
    };

    const blob = new Blob([JSON.stringify(designTokens, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'design-tokens.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  private shareTheme() {
    // Preserve other params and canonicalize url
    this.updateConfig({});

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
    this.config = { ...DEFAULT_CONFIG };
    updateURLParameters(this.config as Record<string, string>, DEFAULT_CONFIG);
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
    const headingFont = formData.get('headingFont') as string;
    const bodyFont = formData.get('bodyFont') as string;
    const customCss = formData.get('customCss') as string;

    if (sourceUrl?.trim() && !this.isValidUrl(sourceUrl)) {
      console.log('sourceUrl is not a valid URL');
      return;
    }

    this.updateConfig({ bodyFont, customCss, headingFont, sourceUrl });
  };

  private readonly updateConfig = (partial: Partial<SidebarConfig>) => {
    const sourceChanged = partial.sourceUrl && partial.sourceUrl !== this.config.sourceUrl;

    this.config = {
      ...this.config,
      ...partial,
      ...(sourceChanged
        ? {
            bodyFont: DEFAULT_CONFIG.bodyFont,
            customCss: DEFAULT_CONFIG.customCss,
            headingFont: DEFAULT_CONFIG.headingFont,
          }
        : {}),
    };

    updateURLParameters(this.config as Record<string, string>, DEFAULT_CONFIG);
    this.notifyConfigChanged();
  };

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
                .value=${this.config.sourceUrl || ''}
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
                .value=${this.config.themeClass || ''}
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
                .value=${this.config.customCss || ''}
                @input=${this.handleInputChange}
                placeholder="Plak hier de gescrapede CSS..."
              ></textarea>
            </div>
            <button class="theme-button theme-button--primary theme-button--full" type="submit">CSS Toepassen</button>
          </section>
        </form>

        <theme-wizard-typography
          heading-font=${this.config.headingFont}
          body-font=${this.config.bodyFont}
        ></theme-wizard-typography>

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
    'theme-wizard-sidebar': LitSidebar;
  }
}

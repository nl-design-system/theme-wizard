/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EVENT_NAMES } from '../../constants';
import { DEFAULT_CONFIG } from '../../constants/default';
import { exportDesignTokens, isValidUrl, shareTheme } from '../../utils';
import sidebarStyles from './sidebar.css';

@customElement('theme-wizard-sidebar')
export class LitSidebar extends LitElement {
  @property() sourceUrl = DEFAULT_CONFIG.sourceUrl;
  @property() headingFont = DEFAULT_CONFIG.headingFont;
  @property() bodyFont = DEFAULT_CONFIG.bodyFont;

  static override readonly styles = [sidebarStyles];

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener(EVENT_NAMES.TYPOGRAPHY_CHANGE, this.handleTypographyChange as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(EVENT_NAMES.TYPOGRAPHY_CHANGE, this.handleTypographyChange as EventListener);
  }

  private readonly handleTypographyChange = (e: Event) => {
    const detail = (e as CustomEvent).detail || {};
    this.notifyConfigChange(detail);
  };

  private notifyConfigChange(config: Partial<typeof DEFAULT_CONFIG>) {
    const event = new CustomEvent(EVENT_NAMES.CONFIG_CHANGE, {
      bubbles: true,
      composed: true,
      detail: config,
    });
    this.dispatchEvent(event);
  }

  private readonly resetToDefaults = () => {
    this.notifyConfigChange(DEFAULT_CONFIG);
  };

  private readonly handleFormSubmit = (event: Event): void => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const sourceUrl = formData.get('sourceUrl') as string;
    const headingFont = formData.get('headingFont') as string;
    const bodyFont = formData.get('bodyFont') as string;
    const customCss = formData.get('customCss') as string;
    const themeClass = formData.get('themeClass') as string;

    if (sourceUrl?.trim() && !isValidUrl(sourceUrl)) {
      console.log('sourceUrl is not a valid URL');
      return;
    }

    this.notifyConfigChange({ bodyFont, headingFont, sourceUrl });
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
                .value=${this.sourceUrl || ''}
                placeholder="https://example.com"
              />

              <button class="theme-button theme-button--primary" type="submit">Analyseer</button>
            </div>
          </section>

        <form class="theme-sidebar__form" @submit=${this.handleThemeForm}>
          <theme-wizard-typography
            .headingFont=${this.headingFont}
            .bodyFont=${this.bodyFont}
          ></theme-wizard-typography>
        </form>

        <!-- Action Buttons -->
        <section class="theme-sidebar__section" aria-labelledby="actions-heading">
          <h2 class="theme-sidebar__heading" id="actions-heading">Acties</h2>

          <div class="theme-sidebar__actions">
            <button
              class="theme-button theme-button--primary theme-button--full"
              @click=${() =>
                exportDesignTokens({
                  bodyFont: this.bodyFont,
                  customCss: this.customCss,
                  headingFont: this.headingFont,
                  sourceUrl: this.sourceUrl,
                  themeClass: this.themeClass,
                })}
              type="button"
            >
              Exporteer Design Tokens
            </button>

            <button
              class="theme-button theme-button--primary theme-button--full"
              @click=${() => shareTheme()}
              type="button"
            >
              Deel Thema
            </button>

            <button
              class="theme-button theme-button--primary theme-button--full"
              @click=${() => this.resetToDefaults()}
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

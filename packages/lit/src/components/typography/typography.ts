/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { loadUrlParams } from '../../helpers';
import { buttonStyles } from '../../styles/button/index.css';
import typographyStyles from './typography.css';

type FontOption = { label: string; value: string };

const FONT_OPTIONS: FontOption[] = [
  { label: 'System UI', value: 'system-ui, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Courier New', value: "'Courier New', monospace" },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
];

const DEFAULT_TYPOGRAPHY = {
  bodyFont: 'system-ui, sans-serif',
  headingFont: 'system-ui, sans-serif',
};

@customElement('theme-wizard-typography')
export class LitTypography extends LitElement {
  @property() headingFont = DEFAULT_TYPOGRAPHY.headingFont;
  @property() bodyFont = DEFAULT_TYPOGRAPHY.bodyFont;

  private lastSourceUrl = '';

  static override readonly styles = [typographyStyles, buttonStyles];

  override connectedCallback() {
    super.connectedCallback();
    this.initializeFromURL();
    document.addEventListener('configChanged', this.onConfigChanged as EventListener);
  }

  private initializeFromURL() {
    const params = loadUrlParams(['headingFont', 'bodyFont', 'sourceUrl']);
    if (params.headingFont) this.headingFont = params.headingFont;
    if (params.bodyFont) this.bodyFont = params.bodyFont;
    if (params.sourceUrl) this.lastSourceUrl = params.sourceUrl;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('configChanged', this.onConfigChanged as EventListener);
  }

  private readonly onConfigChanged = (e: Event) => {
    const { bodyFont, headingFont, sourceUrl } = (e as CustomEvent).detail || {};
    if (sourceUrl && sourceUrl !== this.lastSourceUrl) {
      this.lastSourceUrl = sourceUrl;
      this.headingFont = headingFont ?? DEFAULT_TYPOGRAPHY.headingFont;
      this.bodyFont = bodyFont ?? DEFAULT_TYPOGRAPHY.bodyFont;
    }
  };

  private readonly handleChange = (e: Event) => {
    const { name, value } = e.target as HTMLSelectElement;
    const event = new CustomEvent('configChanged', {
      bubbles: true,
      composed: true,
      detail: { [name]: value },
    });
    document.dispatchEvent(event);
  };

  override render() {
    return html`
      <section class="theme-typography" aria-labelledby="typography-heading">
        <h2 class="theme-typography__heading" id="typography-heading">Typografie</h2>
        <div class="theme-form-field">
          <label for="headingFont" class="theme-form-field__label">Heading Font</label>
          <select
            id="headingFont"
            name="headingFont"
            class="theme-form-field__select"
            .value=${this.headingFont}
            @change=${this.handleChange}
          >
            ${FONT_OPTIONS.map(
              (opt) =>
                html`<option value=${opt.value} ?selected=${opt.value === this.headingFont}>${opt.label}</option>`,
            )}
          </select>
        </div>

        <div class="theme-form-field">
          <label for="bodyFont" class="theme-form-field__label">Body Font</label>
          <select
            id="bodyFont"
            name="bodyFont"
            class="theme-form-field__select"
            .value=${this.bodyFont}
            @change=${this.handleChange}
          >
            ${FONT_OPTIONS.map(
              (opt) => html`<option value=${opt.value} ?selected=${opt.value === this.bodyFont}>${opt.label}</option>`,
            )}
          </select>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-typography': LitTypography;
  }
}

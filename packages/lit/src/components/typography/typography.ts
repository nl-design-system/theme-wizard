/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { loadUrlParams } from '../../helpers';
import { buttonStyles } from '../../styles/button/index.css';
import typographyStyles from './typography.css';

type TypographyConfig = {
  headingFont: string;
  bodyFont: string;
};

type FontOption = { label: string; value: string };

const FONT_OPTIONS: FontOption[] = [
  { label: 'System UI', value: 'system-ui, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Courier New', value: "'Courier New', monospace" },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
];

const DEFAULT_TYPOGRAPHY: TypographyConfig = {
  bodyFont: 'system-ui, sans-serif',
  headingFont: 'system-ui, sans-serif',
};

@customElement('theme-wizard-typography')
export class LitTypography extends LitElement {
  @property({ reflect: true, type: String }) headingFont: string = DEFAULT_TYPOGRAPHY.headingFont || '';
  @property({ reflect: true, type: String }) bodyFont: string = DEFAULT_TYPOGRAPHY.bodyFont || '';

  @state() private currentConfig: TypographyConfig = { ...DEFAULT_TYPOGRAPHY };
  private lastSourceUrl: string = '';

  static override readonly styles = [typographyStyles, buttonStyles];

  override connectedCallback() {
    super.connectedCallback();
    // Initialize from URL so selects reflect persisted values on refresh
    const params = loadUrlParams(['headingFont', 'bodyFont', 'sourceUrl']);
    if (params.headingFont) this.headingFont = params.headingFont;
    if (params.bodyFont) this.bodyFont = params.bodyFont;
    if (params.sourceUrl) this.lastSourceUrl = params.sourceUrl;

    // Listen for config changes to reset when sourceUrl changes
    document.addEventListener('configChanged', this.onConfigChanged as EventListener);
    console.log('params', params);
    this.mergeWithProps();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('configChanged', this.onConfigChanged as EventListener);
  }

  override updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has('headingFont') || changed.has('bodyFont')) {
      this.mergeWithProps();
    }
  }

  private mergeWithProps(): void {
    this.currentConfig = {
      bodyFont: this.bodyFont || this.currentConfig.bodyFont,
      headingFont: this.headingFont || this.currentConfig.headingFont,
    };
  }

  private readonly handleInputChange = (event: Event): void => {
    const target = event.target as HTMLSelectElement;
    const { name, value } = target;
    if (!name || !value) return;
    const key = name as keyof TypographyConfig;
    this.currentConfig = { ...this.currentConfig, [key]: value };
  };

  private readonly handleFormSubmit = (event: Event): void => {
    event.preventDefault();
    this.notifyConfigChanged();
  };

  private readonly onConfigChanged = (e: Event): void => {
    const detail = (e as CustomEvent<{ sourceUrl?: string; headingFont?: string; bodyFont?: string }>).detail || {};
    if (typeof detail.sourceUrl === 'string' && detail.sourceUrl !== this.lastSourceUrl) {
      this.lastSourceUrl = detail.sourceUrl;
      // Reset fonts to provided values (defaults after sidebar reset) or fallback to local defaults
      this.headingFont = detail.headingFont ?? DEFAULT_TYPOGRAPHY.headingFont;
      this.bodyFont = detail.bodyFont ?? DEFAULT_TYPOGRAPHY.bodyFont;
      this.mergeWithProps();
      console.log('detail onConfigChanged', detail);
    }
  };

  private notifyConfigChanged(): void {
    const event = new CustomEvent('configChanged', {
      bubbles: true,
      composed: true,
      detail: {
        bodyFont: this.currentConfig.bodyFont,
        headingFont: this.currentConfig.headingFont,
      },
    });
    document.dispatchEvent(event);
  }

  private renderFontOptions(selected: string) {
    console.log('selected', selected);
    return FONT_OPTIONS.map(
      (opt) => html`<option value=${opt.value} ?selected=${selected === opt.value}>${opt.label}</option>`,
    );
  }

  override render() {
    return html`
      <section class="theme-typography" aria-labelledby="typography-heading">
        <h2 class="theme-typography__heading" id="typography-heading">Typografie</h2>
        <form class="theme-typography__form" @submit=${this.handleFormSubmit}>
          <div class="theme-form-field">
            <label for="headingFont" class="theme-form-field__label">Heading Font</label>
            <select
              id="headingFont"
              name="headingFont"
              class="theme-form-field__select"
              .value=${this.headingFont || ''}
              @change=${this.handleInputChange}
            >
              ${this.renderFontOptions(this.headingFont || '')}
            </select>
          </div>

          <div class="theme-form-field">
            <label for="bodyFont" class="theme-form-field__label">Body Font</label>
            <select
              id="bodyFont"
              name="bodyFont"
              class="theme-form-field__select"
              .value=${this.bodyFont || ''}
              @change=${this.handleInputChange}
            >
              ${this.renderFontOptions(this.bodyFont || '')}
            </select>
          </div>

          <button class="theme-button theme-button--primary theme-button--full" type="submit">Update Typografie</button>
        </form>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-typography': LitTypography;
  }
}

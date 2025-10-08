/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DEFAULT_TYPOGRAPHY, FONT_OPTIONS } from '../../constants';
import { dispatchTypographyChanged, EVENT_NAMES, loadUrlParams } from '../../helpers';
import { buttonStyles } from '../../styles/button/index.css';
import typographyStyles from './typography.css';

@customElement('theme-wizard-typography')
export class LitTypography extends LitElement {
  @property() headingFont = DEFAULT_TYPOGRAPHY.headingFont;
  @property() bodyFont = DEFAULT_TYPOGRAPHY.bodyFont;

  private lastSourceUrl = '';

  static override readonly styles = [typographyStyles, buttonStyles];

  override connectedCallback() {
    super.connectedCallback();
    this.initializeFromURL();
    document.addEventListener(EVENT_NAMES.SIDEBAR_CONFIG_CHANGED, this.handleParentConfigChange as EventListener);
  }

  /**
   * Initialize from URL parameters
   */
  private initializeFromURL() {
    const params = loadUrlParams(['headingFont', 'bodyFont', 'sourceUrl']);
    if (params.headingFont) this.headingFont = params.headingFont;
    if (params.bodyFont) this.bodyFont = params.bodyFont;
    if (params.sourceUrl) this.lastSourceUrl = params.sourceUrl;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(EVENT_NAMES.SIDEBAR_CONFIG_CHANGED, this.handleParentConfigChange as EventListener);
  }

  /**
   * Handle parent config changes and reset typography when source URL changes
   * @param e - Event
   */
  private readonly handleParentConfigChange = (e: Event) => {
    const { bodyFont, headingFont, sourceUrl } = (e as CustomEvent).detail || {};
    if (sourceUrl && sourceUrl !== this.lastSourceUrl) {
      this.lastSourceUrl = sourceUrl;
      this.headingFont = headingFont ?? DEFAULT_TYPOGRAPHY.headingFont;
      this.bodyFont = bodyFont ?? DEFAULT_TYPOGRAPHY.bodyFont;
    }
  };

  /**
   * Handle change event
   * @param e - Event
   */
  private readonly handleChange = (e: Event) => {
    const { name, value } = e.target as HTMLSelectElement;
    dispatchTypographyChanged({ [name]: value });
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

/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DEFAULT_TYPOGRAPHY, EVENT_NAMES, FONT_OPTIONS } from '../../constants';
import { buttonStyles } from '../../styles/button/index.css';
import typographyStyles from './typography.css';

@customElement('theme-wizard-typography')
export class LitTypography extends LitElement {
  @property() headingFont = DEFAULT_TYPOGRAPHY.headingFont;
  @property() bodyFont = DEFAULT_TYPOGRAPHY.bodyFont;

  static override readonly styles = [typographyStyles, buttonStyles];

  /**
   * Handle change event - dispatch to parent (sidebar)
   * @param e - Event
   */
  private readonly handleChange = (e: Event) => {
    const { name, value } = e.target as HTMLSelectElement;
    const event = new CustomEvent(EVENT_NAMES.TYPOGRAPHY_CHANGE, {
      bubbles: true,
      composed: true,
      detail: { [name]: value },
    });
    this.dispatchEvent(event);
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

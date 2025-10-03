/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import typographyStyles from './typography.css.ts';
import { buttonStyles } from '../../../styles/design-tokens.ts';
import { loadUrlParams, updateUrlParams } from '../../../helpers/index.ts';
import type { TypographyConfig, FontOption } from './types';

/**
 * Font options for typography selection
 */
const FONT_OPTIONS: FontOption[] = [
  { label: 'System UI', value: 'system-ui, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Courier New', value: "'Courier New', monospace" },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
];

/**
 * Default typography configuration
 */
const DEFAULT_TYPOGRAPHY: TypographyConfig = {
  bodyFont: 'system-ui, sans-serif',
  headingFont: 'system-ui, sans-serif',
};

/**
 * Lit component for typography configuration
 *
 * This component provides font selection for heading and body text,
 * with real-time preview updates and event dispatching for other components.
 *
 * @example
 * ```html
 * <lit-theme-typography
 *   heading-font="'Times New Roman', serif"
 *   body-font="system-ui, sans-serif">
 * </lit-theme-typography>
 * ```
 *
 * @fires typographyChanged - Dispatched when font configuration changes
 * @property {string} headingFont - Font family for headings
 * @property {string} bodyFont - Font family for body text
 */
@customElement('lit-theme-typography')
export class LitTypographyComponent extends LitElement {
  /**
   * Font family for headings
   * @default 'system-ui, sans-serif'
   */
  @property({ type: String, reflect: true })
  headingFont = DEFAULT_TYPOGRAPHY.headingFont || '';

  /**
   * Font family for body text
   * @default 'system-ui, sans-serif'
   */
  @property({ type: String, reflect: true })
  bodyFont = DEFAULT_TYPOGRAPHY.bodyFont || '';

  static readonly styles = [typographyStyles, buttonStyles];

  connectedCallback() {
    super.connectedCallback();
    this.loadFromUrlParams();
    // Listen for typography changes from sidebar (on document level)
    document.addEventListener('typographyChanged', this.handleTypographyChange);
  }

  private loadFromUrlParams() {
    const params = loadUrlParams(['headingFont', 'bodyFont']);

    // Apply loaded parameters to component properties
    if (params.headingFont) this.headingFont = params.headingFont;
    if (params.bodyFont) this.bodyFont = params.bodyFont;
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
  };

  /**
   * Gets the current typography configuration
   * @returns Current configuration with fallbacks
   * @private
   */
  private getCurrentConfig(): TypographyConfig {
    return {
      bodyFont: this.bodyFont || DEFAULT_TYPOGRAPHY.bodyFont,
      headingFont: this.headingFont || DEFAULT_TYPOGRAPHY.headingFont,
    };
  }

  /**
   * Handles input changes from font select dropdowns
   * @param event - The input change event
   * @private
   */
  private handleInputChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const field = target.name as keyof TypographyConfig;

    // Update the property directly
    (this as any)[field] = target.value;

    // Update the theme preview
    this.updateThemePreview();
  }

  /**
   * Handles form submission
   * @param event - The form submit event
   * @private
   */
  private handleFormSubmit(event: Event): void {
    event.preventDefault();
    this.updateThemePreview();
  }

  /**
   * Updates theme preview components with current typography configuration
   *
   * This method updates both Stencil and Lit preview components,
   * and dispatches a custom event for other components to listen to.
   *
   * @private
   */
  private updateThemePreview(): void {
    const config = this.getCurrentConfig();

    // Update Stencil theme-preview component
    const stencilPreview = document.querySelector('theme-preview') as HTMLElement;
    if (stencilPreview) {
      Object.assign(stencilPreview, {
        bodyFontFamily: config.bodyFont,
        headingFontFamily: config.headingFont,
      });
    }

    // Update Lit lit-theme-preview component
    const litPreview = document.querySelector('lit-theme-preview') as HTMLElement;
    if (litPreview) {
      Object.assign(litPreview, {
        bodyFontFamily: config.bodyFont,
        headingFontFamily: config.headingFont,
      });
    }

    // Dispatch custom event for other components
    const event = new CustomEvent('typographyChanged', {
      detail: config,
      bubbles: true,
      composed: true,
    });
    document.dispatchEvent(event);
  }

  /**
   * Renders font options for select dropdown
   * @param selectedValue - Currently selected font value
   * @returns Array of option elements
   * @private
   */
  private renderFontOptions(selectedValue: string) {
    return FONT_OPTIONS.map(
      (option) => html`
        <option value="${option.value}" ?selected=${selectedValue === option.value}>${option.label}</option>
      `,
    );
  }

  /**
   * Renders the typography configuration component
   * @returns The component template
   */
  render() {
    const config = this.getCurrentConfig();

    return html`
      <section class="theme-typography" aria-labelledby="typography-heading">
        <h2 class="theme-typography__heading" id="typography-heading">Typografie</h2>

        <form class="theme-typography__form" @submit=${this.handleFormSubmit}>
          <div class="theme-form-field">
            <label for="headingFont" class="theme-form-field__label"> Heading Font </label>
            <select
              id="headingFont"
              name="headingFont"
              class="theme-form-field__select"
              @change=${this.handleInputChange}
            >
              ${this.renderFontOptions(config.headingFont || '')}
            </select>
          </div>

          <div class="theme-form-field">
            <label for="bodyFont" class="theme-form-field__label"> Body Font </label>
            <select id="bodyFont" name="bodyFont" class="theme-form-field__select" @change=${this.handleInputChange}>
              ${this.renderFontOptions(config.bodyFont || '')}
            </select>
          </div>

          <button class="theme-button theme-button--primary theme-button--full" type="submit">Update Typografie</button>
        </form>
      </section>
    `;
  }
}

/**
 * TypeScript global type declaration for the custom element
 * @global
 */
declare global {
  interface HTMLElementTagNameMap {
    'lit-theme-typography': LitTypographyComponent;
  }
}

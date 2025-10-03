/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { Component, h, Prop, State, Watch } from '@stencil/core';

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

@Component({
  shadow: true,
  styleUrl: 'typography.css',
  tag: 'theme-typography',
})
export class TypographyComponent {
  @Prop({ reflect: true }) headingFont: string = DEFAULT_TYPOGRAPHY.headingFont || '';
  @Prop({ reflect: true }) bodyFont: string = DEFAULT_TYPOGRAPHY.bodyFont || '';

  @State() private currentConfig: TypographyConfig = { ...DEFAULT_TYPOGRAPHY };

  /**
   * Initialize component from props
   */
  componentWillLoad() {
    this.mergeWithProps();
  }

  /**
   * Watch for prop changes and update internal state
   */
  @Watch('headingFont')
  @Watch('bodyFont')
  onPropChange() {
    this.mergeWithProps();
  }

  /**
   * Merge current props with internal state
   * @private
   */
  private mergeWithProps(): void {
    this.currentConfig = {
      bodyFont: this.bodyFont || this.currentConfig.bodyFont,
      headingFont: this.headingFont || this.currentConfig.headingFont,
    };
  }

  /**
   * Handle input changes and update component state
   * @param event - Input change event
   * @private
   */
  private readonly handleInputChange = (event: Event): void => {
    const target = event.target as HTMLSelectElement;
    const { name, value } = target;

    if (!name || !value) return;

    // Update specific config property
    const configKey = name as keyof TypographyConfig;
    if (configKey in this.currentConfig) {
      this.currentConfig = {
        ...this.currentConfig,
        [configKey]: value,
      };
    }
  };

  /**
   * Handle form submission and update configuration
   * @param event - Form submit event
   * @private
   */
  private readonly handleFormSubmit = (event: Event): void => {
    event.preventDefault();

    // Update configuration
    this.updateConfiguration();
  };

  /**
   * Update configuration and notify other components
   * @private
   */
  private updateConfiguration(): void {
    try {
      this.updateThemePreview();
    } catch (error) {
      console.error('Failed to update typography:', error);
    }
  }

  /**
   * Update the theme preview component with current configuration
   * @private
   */
  private updateThemePreview(): void {
    const themePreview = document.querySelector('theme-preview') as any;

    if (!themePreview) {
      console.warn('Theme preview component not found');
      return;
    }

    // Update theme preview properties
    Object.assign(themePreview, {
      bodyFontFamily: this.currentConfig.bodyFont,
      headingFontFamily: this.currentConfig.headingFont,
    });
  }

  /**
   * Render font options for select elements
   * @param selectedValue - Currently selected value
   * @returns Array of option elements
   * @private
   */
  private renderFontOptions(selectedValue: string) {
    return FONT_OPTIONS.map((option) => (
      <option key={option.value} value={option.value} selected={selectedValue === option.value}>
        {option.label}
      </option>
    ));
  }

  render() {
    const { bodyFont, headingFont } = this.currentConfig;

    return (
      <section class="theme-typography" aria-labelledby="typography-heading">
        <h2 class="theme-typography__heading" id="typography-heading">
          Typografie
        </h2>

        <form class="theme-typography__form" onSubmit={this.handleFormSubmit}>
          <div class="theme-form-field">
            <label htmlFor="headingFont" class="theme-form-field__label">
              Heading Font
            </label>

            <select
              id="headingFont"
              name="headingFont"
              class="theme-form-field__select"
              onChange={this.handleInputChange}
            >
              {this.renderFontOptions(headingFont || '')}
            </select>
          </div>

          <div class="theme-form-field">
            <label htmlFor="bodyFont" class="theme-form-field__label">
              Body Font
            </label>
            <select id="bodyFont" name="bodyFont" class="theme-form-field__select" onChange={this.handleInputChange}>
              {this.renderFontOptions(bodyFont || '')}
            </select>
          </div>

          <button class="theme-button theme-button--primary theme-button--full" type="submit">
            Update Typografie
          </button>
        </form>
      </section>
    );
  }
}

/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { Component, h, Prop, State, Event, Watch } from '@stencil/core';

import type { SidebarConfig, NotificationType, FontOption, ThemePreviewElement } from './types';
import type { EventEmitter } from '@stencil/core';

/**
 * Font options for typography selection (hardcoded for now)
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

@Component({
  shadow: true,
  styleUrl: 'sidebar.css',
  tag: 'example-sidebar',
})
export class SidebarComponent {
  @Prop({ reflect: true }) sourceUrl: string = DEFAULT_CONFIG.sourceUrl;
  @Prop({ reflect: true }) headingFont: string = DEFAULT_CONFIG.headingFont;
  @Prop({ reflect: true }) bodyFont: string = DEFAULT_CONFIG.bodyFont;
  @Prop({ reflect: true }) themeClass: string = DEFAULT_CONFIG.themeClass;
  @Prop({ reflect: true }) customCss: string = DEFAULT_CONFIG.customCss;

  @State() private currentConfig: SidebarConfig = { ...DEFAULT_CONFIG };

  @Event() configChanged!: EventEmitter<SidebarConfig>;

  /**
   * Initialize component from URL parameters or props
   */
  componentWillLoad() {
    this.initializeFromURL();
    this.mergeWithProps();
  }

  /**
   * Watch for prop changes and update internal state
   */
  @Watch('sourceUrl')
  @Watch('headingFont')
  @Watch('bodyFont')
  @Watch('themeClass')
  @Watch('customCss')
  onPropChange() {
    this.mergeWithProps();
  }

  /**
   * Initialize component state from URL parameters
   * @private
   */
  private initializeFromURL(): void {
    try {
      const url = new URL(window.location.href);
      const urlConfig: Partial<SidebarConfig> = {};

      // Read URL parameters with validation
      const urlParam = url.searchParams.get('url');
      if (urlParam && this.isValidUrl(urlParam)) {
        urlConfig.sourceUrl = urlParam;
      }

      const headingFontParam = url.searchParams.get('headingFont');
      if (headingFontParam && this.isValidFont(headingFontParam)) {
        urlConfig.headingFont = headingFontParam;
      }

      const bodyFontParam = url.searchParams.get('bodyFont');
      if (bodyFontParam && this.isValidFont(bodyFontParam)) {
        urlConfig.bodyFont = bodyFontParam;
      }

      const themeClassParam = url.searchParams.get('themeClass');
      if (themeClassParam?.trim()) {
        urlConfig.themeClass = themeClassParam.trim();
      }

      const customCssParam = url.searchParams.get('customCss');
      if (customCssParam) {
        urlConfig.customCss = customCssParam;
      }

      // Merge URL config with current config
      this.currentConfig = { ...this.currentConfig, ...urlConfig };
    } catch (error) {
      console.warn('Failed to parse URL parameters:', error);
    }
  }

  /**
   * Merge current props with internal state
   * @private
   */
  private mergeWithProps(): void {
    this.currentConfig = {
      bodyFont: this.bodyFont || this.currentConfig.bodyFont,
      customCss: this.customCss || this.currentConfig.customCss,
      headingFont: this.headingFont || this.currentConfig.headingFont,
      sourceUrl: this.sourceUrl || this.currentConfig.sourceUrl,
      themeClass: this.themeClass || this.currentConfig.themeClass,
    };
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

  private isValidFont(font: string): boolean {
    return FONT_OPTIONS.some((option) => option.value === font);
  }

  /**
   * Handle input changes and update component state
   * @param event - Input change event
   * @private
   */
  private readonly handleInputChange = (event: Event): void => {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value } = target;

    if (!name || !value) return;

    // Update specific config property
    const configKey = name as keyof SidebarConfig;
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

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const sourceUrl = formData.get('sourceUrl') as string;

    // Validate URL if provided
    if (sourceUrl?.trim() && !this.isValidUrl(sourceUrl)) {
      this.showNotification('Ongeldige URL formaat', 'error');
      return;
    }

    // Update configuration
    this.updateConfiguration();
  };

  /**
   * Update configuration and notify other components
   * @private
   */
  private updateConfiguration(): void {
    try {
      // Update theme preview component
      this.updateThemePreview();

      // Update URL parameters
      this.updateURLParameters();

      // Emit event for external listeners
      this.configChanged.emit({ ...this.currentConfig });

      this.showNotification('Configuratie bijgewerkt', 'success');
    } catch (error) {
      console.error('Failed to update configuration:', error);
      this.showNotification('Fout bij bijwerken configuratie', 'error');
    }
  }

  /**
   * Update the theme preview component with current configuration
   * @private
   */
  private updateThemePreview(): void {
    const themePreview = document.querySelector('example-theme-preview') as ThemePreviewElement;

    if (!themePreview) {
      console.warn('Theme preview component not found');
      return;
    }

    // Update theme preview properties
    Object.assign(themePreview, {
      bodyFontFamily: this.currentConfig.bodyFont,
      customCss: this.currentConfig.customCss,
      headingFontFamily: this.currentConfig.headingFont,
      themeClass: this.currentConfig.themeClass,
      url: this.currentConfig.sourceUrl,
    });
  }

  /**
   * Update browser URL parameters with current configuration
   * @private
   */
  private updateURLParameters(): void {
    try {
      const url = new URL(window.location.href);
      const { bodyFont, customCss, headingFont, sourceUrl, themeClass } = this.currentConfig;

      // Only set non-default values to keep URL clean
      if (sourceUrl && sourceUrl !== DEFAULT_CONFIG.sourceUrl) {
        url.searchParams.set('url', sourceUrl);
      } else {
        url.searchParams.delete('url');
      }

      if (headingFont && headingFont !== DEFAULT_CONFIG.headingFont) {
        url.searchParams.set('headingFont', headingFont);
      } else {
        url.searchParams.delete('headingFont');
      }

      if (bodyFont && bodyFont !== DEFAULT_CONFIG.bodyFont) {
        url.searchParams.set('bodyFont', bodyFont);
      } else {
        url.searchParams.delete('bodyFont');
      }

      if (themeClass && themeClass !== DEFAULT_CONFIG.themeClass) {
        url.searchParams.set('themeClass', themeClass);
      } else {
        url.searchParams.delete('themeClass');
      }

      if (customCss) {
        url.searchParams.set('customCss', customCss);
      } else {
        url.searchParams.delete('customCss');
      }

      // Update browser URL without page reload
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      console.error('Failed to update URL parameters:', error);
    }
  }

  /**
   * Export current theme configuration as design tokens JSON file
   * @private
   */
  private exportDesignTokens(): void {
    try {
      const tokens = {
        $metadata: {
          exportedAt: new Date().toISOString(),
          sourceUrl: this.currentConfig.sourceUrl,
          version: '1.0.0',
        },
        example: {
          typography: {
            'font-family': {
              body: {
                value: this.currentConfig.bodyFont,
              },
              heading: {
                value: this.currentConfig.headingFont,
              },
            },
          },
        },
      };

      this.downloadFile(JSON.stringify(tokens, null, 2), 'theme-tokens.json', 'application/json');

      this.showNotification('Design tokens geëxporteerd', 'success');
    } catch (error) {
      console.error('Failed to export design tokens:', error);
      this.showNotification('Fout bij exporteren design tokens', 'error');
    }
  }

  /**
   * Download a file with the given content
   * @param content - File content
   * @param filename - File name
   * @param mimeType - MIME type
   * @private
   */
  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Share current theme configuration by copying URL to clipboard
   * @private
   */
  private async shareTheme(): Promise<void> {
    try {
      const url = window.location.href;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        this.showNotification('Link gekopieerd naar klembord', 'success');
      } else {
        this.fallbackShare();
      }
    } catch (error) {
      console.error('Failed to share theme:', error);
      this.fallbackShare();
    }
  }

  /**
   * Fallback share method when clipboard API is not available
   * @private
   */
  private fallbackShare(): void {
    this.showNotification('Clipboard niet beschikbaar. Kopieer de URL uit de adresbalk.', 'warning');
  }

  /**
   * Reset all configuration to default values
   * @private
   */
  private resetToDefaults(): void {
    // eslint-disable-next-line no-alert
    if (!confirm('Weet je zeker dat je alle wijzigingen wilt resetten naar de standaard waarden?')) {
      return;
    }

    try {
      // Reset to default values
      this.currentConfig = { ...DEFAULT_CONFIG };

      // Update theme preview
      this.updateThemePreview();

      // Update URL parameters
      this.updateURLParameters();

      // Emit reset event
      this.configChanged.emit({ ...this.currentConfig });

      this.showNotification('Huisstijl gereset naar standaard waarden', 'info');
    } catch (error) {
      console.error('Failed to reset to defaults:', error);
      this.showNotification('Fout bij resetten naar standaard waarden', 'error');
    }
  }

  /**
   * Show notification to user
   * @param message - Notification message
   * @param type - Notification type
   * @private
   */
  private showNotification(message: string, type: NotificationType = 'info'): void {
    try {
      const notification = document.createElement('div');
      notification.className = `example-notification example-notification--${type}`;
      notification.textContent = message;
      notification.setAttribute('role', 'alert');
      notification.setAttribute('aria-live', 'polite');

      document.body.appendChild(notification);

      // Show notification with animation
      requestAnimationFrame(() => {
        notification.classList.add('example-notification--visible');
      });

      // Auto-remove after 3 seconds
      setTimeout(() => {
        notification.classList.remove('example-notification--visible');
        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
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
    const { bodyFont, customCss, headingFont, sourceUrl, themeClass } = this.currentConfig;

    return (
      <aside class="example-sidebar" aria-label="Configuratie">
        <h1 class="example-sidebar__title">Theme Wizard</h1>
        <p class="example-sidebar__subtitle">Stencil</p>

        <form class="example-sidebar__form" onSubmit={this.handleFormSubmit}>
          <section class="example-sidebar__section" aria-labelledby="url-heading">
            <h2 class="example-sidebar__heading" id="url-heading">
              Huisstijl URL
            </h2>
            <div class="example-url-input">
              <label htmlFor="sourceUrl" class="example-url-input__label">
                Website URL
              </label>
              <input
                type="url"
                id="sourceUrl"
                name="sourceUrl"
                class="example-url-input__field"
                value={sourceUrl}
                onInput={this.handleInputChange}
                placeholder="Voer een URL in..."
                required
              />
              <button class="example-button example-button--primary" type="submit">
                Analyseer
              </button>
            </div>
          </section>

          <section class="example-sidebar__section" aria-labelledby="css-heading">
            <h2 class="example-sidebar__heading" id="css-heading">
              Design System CSS
            </h2>
            <div class="example-form-field">
              <label htmlFor="themeClass" class="example-form-field__label">
                Theme Class
              </label>
              <input
                type="text"
                id="themeClass"
                name="themeClass"
                class="example-url-input__field"
                value={themeClass}
                onInput={this.handleInputChange}
                placeholder="bijv. voorbeeld-theme"
              />
            </div>
            <div class="example-form-field">
              <label htmlFor="customCss" class="example-form-field__label">
                CSS Code
              </label>
              <textarea
                id="customCss"
                name="customCss"
                class="example-css-input"
                rows={6}
                value={customCss}
                onInput={this.handleInputChange}
                placeholder="Plak hier de gescrapede CSS..."
              />
            </div>
            <button class="example-button example-button--primary example-button--full" type="submit">
              CSS Toepassen
            </button>
          </section>

          <section class="example-sidebar__section" aria-labelledby="typography-heading">
            <h2 class="example-sidebar__heading" id="typography-heading">
              Typografie
            </h2>
            <div class="example-form-field">
              <label htmlFor="headingFont" class="example-form-field__label">
                Heading Font
              </label>
              <select
                id="headingFont"
                name="headingFont"
                class="example-form-field__select"
                onChange={this.handleInputChange}
              >
                {this.renderFontOptions(headingFont)}
              </select>
            </div>
            <div class="example-form-field">
              <label htmlFor="bodyFont" class="example-form-field__label">
                Body Font
              </label>
              <select
                id="bodyFont"
                name="bodyFont"
                class="example-form-field__select"
                onChange={this.handleInputChange}
              >
                {this.renderFontOptions(bodyFont)}
              </select>
            </div>
            <button class="example-button example-button--primary example-button--full" type="submit">
              Update Typografie
            </button>
          </section>
        </form>

        {/* Action Buttons */}
        <section class="example-sidebar__section" aria-labelledby="actions-heading">
          <h2 class="example-sidebar__heading" id="actions-heading">
            Acties
          </h2>
          <div class="example-sidebar__actions">
            <button
              class="example-button example-button--primary example-button--full"
              onClick={() => this.exportDesignTokens()}
              type="button"
            >
              Exporteer Design Tokens
            </button>
            <button
              class="example-button example-button--primary example-button--full"
              onClick={() => this.shareTheme()}
              type="button"
            >
              Deel Thema
            </button>
            <button
              class="example-button example-button--primary example-button--full"
              onClick={() => this.resetToDefaults()}
              type="button"
            >
              Reset naar Standaard
            </button>
          </div>
        </section>
      </aside>
    );
  }
}

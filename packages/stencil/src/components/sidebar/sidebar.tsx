/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import type { EventEmitter } from '@stencil/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Event, Prop, h } from '@stencil/core';
import { EVENT_NAMES } from '../../constants';
import { DEFAULT_CONFIG } from '../../constants/default';
import { exportDesignTokens, isValidUrl, shareTheme } from '../../utils';

@Component({
  shadow: true,
  styleUrl: 'sidebar.css',
  tag: 'theme-wizard-sidebar',
})
export class SidebarComponent {
  @Prop() sourceUrl: string = DEFAULT_CONFIG.sourceUrl;
  @Prop() headingFont: string = DEFAULT_CONFIG.headingFont;
  @Prop() bodyFont: string = DEFAULT_CONFIG.bodyFont;
  @Prop() themeClass: string = DEFAULT_CONFIG.themeClass;
  @Prop() customCss: string = DEFAULT_CONFIG.customCss;

  @Event({ eventName: EVENT_NAMES.CONFIG_CHANGE }) configChange!: EventEmitter<Partial<typeof DEFAULT_CONFIG>>;

  private readonly handleTypographyChange = (event: CustomEvent) => {
    const detail = event.detail || {};
    this.notifyConfigChange(detail);
  };

  private notifyConfigChange(config: Partial<typeof DEFAULT_CONFIG>) {
    this.configChange.emit(config);
  }

  /**
   * Handle form submission for URL analysis
   * @param event - Form submit event
   * @private
   */
  private readonly handleFormSubmit = (event: Event): void => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const sourceUrl = formData.get('sourceUrl') as string;
    const themeClass = formData.get('themeClass') as string;
    const customCss = formData.get('customCss') as string;
    const headingFont = formData.get('headingFont') as string;
    const bodyFont = formData.get('bodyFont') as string;

    if (sourceUrl?.trim() && !isValidUrl(sourceUrl)) {
      console.log('sourceUrl is not a valid URL');
      return;
    }

    this.notifyConfigChange({ bodyFont, customCss, headingFont, sourceUrl, themeClass });
  };

  /**
   * Reset all configuration to default values
   * @private
   */
  private readonly resetToDefaults = (): void => {
    this.notifyConfigChange(DEFAULT_CONFIG);
  };

  render() {
    return (
      <aside class="theme-sidebar" aria-label="Configuratie">
        <h1 class="theme-sidebar__title">Theme Wizard</h1>
        <p class="theme-sidebar__subtitle">Stencil</p>

        <form class="theme-sidebar__form" onSubmit={this.handleFormSubmit}>
          <section class="theme-sidebar__section" aria-labelledby="url-heading">
            <h2 class="theme-sidebar__heading" id="url-heading">
              Huisstijl URL
            </h2>
            <div class="theme-form-field">
              <label htmlFor="sourceUrl" class="theme-form-field__label">
                Website URL
              </label>
              <input
                type="url"
                id="sourceUrl"
                name="sourceUrl"
                class="theme-form-field__input"
                value={this.sourceUrl}
                placeholder="Voer een URL in..."
                required
              />
              <button class="theme-button theme-button--primary" type="submit">
                Analyseer
              </button>
            </div>
          </section>

          <section class="theme-sidebar__section" aria-labelledby="css-heading">
            <h2 class="theme-sidebar__heading" id="css-heading">
              Design System CSS
            </h2>
            <div class="theme-form-field">
              <label htmlFor="themeClass" class="theme-form-field__label">
                Theme Class
              </label>
              <input
                type="text"
                id="themeClass"
                name="themeClass"
                class="theme-form-field__input"
                value={this.themeClass}
                placeholder="bijv. voorbeeld-theme"
              />
              <small class="theme-form-field__help">bijv. utrecht-theme of voorbeeld-theme</small>
            </div>

            <div class="theme-form-field">
              <label htmlFor="customCss" class="theme-form-field__label">
                CSS Code
              </label>
              <textarea
                id="customCss"
                name="customCss"
                class="theme-form-field__input theme-css-input"
                rows={6}
                value={this.customCss}
                placeholder="Plak hier de gescrapede CSS..."
              />
            </div>
            <button class="theme-button theme-button--primary theme-button--full" type="submit">
              CSS Toepassen
            </button>
          </section>

          <theme-wizard-typography
            headingFont={this.headingFont}
            bodyFont={this.bodyFont}
            onTypographyChange={(e) => this.handleTypographyChange(e)}
          ></theme-wizard-typography>
        </form>

        {/* Action Buttons */}
        <section class="theme-sidebar__section" aria-labelledby="actions-heading">
          <h2 class="theme-sidebar__heading" id="actions-heading">
            Acties
          </h2>
          <div class="theme-sidebar__actions">
            <button
              class="theme-button theme-button--primary theme-button--full"
              onClick={() =>
                exportDesignTokens({
                  bodyFont: this.bodyFont,
                  customCss: this.customCss,
                  headingFont: this.headingFont,
                  sourceUrl: this.sourceUrl,
                  themeClass: this.themeClass,
                })
              }
              type="button"
            >
              Exporteer Design Tokens
            </button>

            <button
              class="theme-button theme-button--primary theme-button--full"
              onClick={() => shareTheme()}
              type="button"
            >
              Deel Thema
            </button>

            <button
              class="theme-button theme-button--primary theme-button--full"
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

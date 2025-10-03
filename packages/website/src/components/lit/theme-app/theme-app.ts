/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import appStyles from './theme-app.css.ts';

@customElement('lit-theme-app')
export class LitThemeApp extends LitElement {
  @property({ type: String })
  pageTitle = 'Live Voorbeeld';

  @property({ type: String })
  pageDescription = 'Hieronder zie je een live voorbeeld van de opgegeven website met de geselecteerde huisstijl.';

  static readonly styles = appStyles;

  render() {
    return html`
      <div class="theme-app">
        <slot name="sidebar"></slot>

        <main class="theme-preview-main" id="main-content" role="main">
          <h2 class="theme-preview-main__title">${this.pageTitle}</h2>
          <p class="theme-preview-main__description">${this.pageDescription}</p>

          <section class="theme-preview" aria-label="Live voorbeeld van toegepaste huisstijl">
            <slot name="preview"></slot>
          </section>
        </main>
      </div>
    `;
  }
}

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'lit-theme-app': LitThemeApp;
  }
}

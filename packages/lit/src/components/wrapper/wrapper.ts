/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import appStyles from './wrapper.css';

@customElement('theme-wizard-wrapper')
export class Wrapper extends LitElement {
  @property({ type: String })
  pageTitle = 'Live Voorbeeld';

  @property({ type: String })
  pageDescription = 'Hieronder zie je een live voorbeeld van de opgegeven website met de geselecteerde huisstijl.';

  static override readonly styles = [appStyles];

  override render() {
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

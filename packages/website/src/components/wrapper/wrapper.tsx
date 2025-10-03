/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Prop, h } from '@stencil/core';

@Component({
  shadow: true,
  styleUrl: 'wrapper.css',
  tag: 'theme-app',
})
export class AppWrapper {
  @Prop() pageTitle: string = 'Live Voorbeeld';
  @Prop() pageDescription: string =
    'Hieronder zie je een live voorbeeld van de opgegeven website met de geselecteerde huisstijl.';

  render() {
    return (
      <div class="theme-app">
        <slot name="sidebar"></slot>

        <main class="theme-preview-main" id="main-content" role="main">
          <h2 class="theme-preview-main__title">{this.pageTitle}</h2>
          <p class="theme-preview-main__description">{this.pageDescription}</p>

          <section class="theme-preview" aria-label="Live voorbeeld van toegepaste huisstijl">
            <slot name="preview"></slot>
          </section>
        </main>
      </div>
    );
  }
}

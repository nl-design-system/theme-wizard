/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { Component, h, Prop } from '@stencil/core';

@Component({
  shadow: true,
  styleUrl: 'index.scss',
  tag: 'example-app',
})
export class AppWrapper {
  @Prop() pageTitle: string = 'Live Voorbeeld';
  @Prop() pageDescription: string =
    'Hieronder zie je een live voorbeeld van de opgegeven website met de geselecteerde huisstijl.';

  render() {
    return (
      <div class="example-app">
        <slot name="sidebar"></slot>

        <main class="example-preview-main" id="main-content" role="main">
          <h2 class="example-preview-main__title">{this.pageTitle}</h2>
          <p class="example-preview-main__description">{this.pageDescription}</p>

          <section class="example-preview" aria-label="Live voorbeeld van toegepaste huisstijl">
            <slot name="preview"></slot>
          </section>
        </main>
      </div>
    );
  }
}

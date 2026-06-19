import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TemplatePresetTarget, presetTargetStyles } from '../template-preset-target';

@customElement('template-link')
export class TemplateLink extends TemplatePresetTarget {
  @property() href: string = '';

  protected override readonly presetComponentId = 'link';

  static override readonly styles = [presetTargetStyles, unsafeCSS(linkCss)];

  readonly #suppressNavigation = (event: Event) => event.preventDefault();

  override render() {
    return html`
      <a class="nl-link" href=${this.href} tabindex="-1" @click=${this.#suppressNavigation}>
        <slot></slot>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-link': TemplateLink;
  }
}

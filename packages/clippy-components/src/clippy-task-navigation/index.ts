import actionCss from '@gemeente-denhaag/action/index.css?inline';
import { safeCustomElement } from '@lib/decorators';
import linkStyles from '@nl-design-system-candidate/link-css/link.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'clippy-task-navigation';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTaskNavigation;
  }
}

@safeCustomElement(tag)
export class ClippyTaskNavigation extends LitElement {
  @property({ type: String }) href = '';

  static override readonly styles = [unsafeCSS(linkStyles), unsafeCSS(actionCss), styles];

  override render() {
    return html`
      <a class="nl-link denhaag-action denhaag-action--single" href=${this.href}>
        <slot name="iconStart"></slot>
        <div class="denhaag-action__content">
          <strong><slot></slot></strong>
        </div>
        <div class="denhaag-action__context">
          <div class="denhaag-action__details">
            <slot name="details"></slot>
          </div>
          <div class="denhaag-action__actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </a>
    `;
  }
}

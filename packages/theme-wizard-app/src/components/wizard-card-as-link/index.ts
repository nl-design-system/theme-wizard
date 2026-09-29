import { ClippyCardAsLink } from '@nl-design-system-community/clippy-components/clippy-card-as-link';
import IconArrowRight from '@tabler/icons/outline/arrow-right.svg?raw';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import styles from './styles';

const tag = 'wizard-card-as-link';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardCardAsLink;
  }
}

/**
 * A `clippy-card-as-link` (`variant="list-item"`) styled for the wizard's start page. Extends
 * `clippy-card-as-link` rather than wrapping it, so the empty-slot handling for pre-header/header/body,
 * the stretched-link overlay and focus behavior are all inherited instead of reimplemented.
 *
 * @slot link - The card's link — a direct-child `<a href>`; its text content is the accessible name
 * @slot pre-header - Content above the header, e.g. an icon
 * @slot header - Card heading region
 * @slot body - Main card content
 * @slot footer - Footer content. Defaults to an arrow-right icon when left empty
 *
 * @element wizard-card-as-link
 */
@customElement(tag)
export class WizardCardAsLink extends ClippyCardAsLink {
  static override readonly styles = [...ClippyCardAsLink.styles, styles];

  constructor() {
    super();
    this.variant = 'list-item';
  }

  protected override renderFooter() {
    return html`
      <div class="clippy-card__footer" part="footer">
        <slot name="footer" class="wizard-card-as-link__footer">
          <span aria-hidden="true">${unsafeSVG(IconArrowRight)}</span>
        </slot>
      </div>
    `;
  }

  /**
   * `clippy-card`'s `list-item` variant lays header/pre-header/body/footer out in a row, as
   * siblings — stack header and body in their own column so pre-header/footer stay pinned to
   * the row's start/end while the title and description stack above one another in the middle.
   */
  override render() {
    return html`
      <div class="wizard-card-as-link__header-body" ?hidden=${!this.hasHeader && !this.hasBody}>
        ${this.renderHeader()} ${this.renderBody()}
      </div>
      <slot name="link"></slot>
      ${this.renderPreHeader()} ${this.renderFooter()}
    `;
  }
}

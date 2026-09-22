import { safeCustomElement } from '@lib/decorators';
import { ClippyCard } from '@src/clippy-card';
import { property } from 'lit/decorators.js';
import styles, { focusVisibleAttribute } from './styles';

const tag = 'clippy-card-as-link';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyCardAsLink;
  }
}

/**
 * `clippy-card` made entirely clickable by a single `<a slot="link">` whose text content is the link's accessible name.
 * `clippy-card` already renders the `link` slot right after `header`;
 *
 * @slot link - The card's link — a direct-child `<a href>`; its text content is the accessible name
 * @slot pre-header - Content above the header, e.g. a status or category label
 * @slot header - Card heading region
 * @slot body - Main card content
 * @slot footer - Footer content, e.g. actions or metadata
 */
@safeCustomElement(tag)
export class ClippyCardAsLink extends ClippyCard {
  static override readonly styles = [...ClippyCard.styles, styles];

  @property({ reflect: true }) variant?: 'list-item';

  override connectedCallback() {
    super.connectedCallback();
    // Setup focus listeners so we can minic `:host(:has(:focus-within))`
    this.addEventListener('focusin', this.#handleFocusIn);
    this.addEventListener('focusout', this.#handleFocusOut);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focusin', this.#handleFocusIn);
    this.removeEventListener('focusout', this.#handleFocusOut);
  }

  readonly #handleFocusIn = (event: FocusEvent) => {
    const isFocusVisible = event.target instanceof HTMLElement && event.target.matches(':focus-visible');
    this.toggleAttribute(focusVisibleAttribute, isFocusVisible);
  };

  readonly #handleFocusOut = () => {
    this.removeAttribute(focusVisibleAttribute);
  };
}

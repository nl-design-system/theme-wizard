import { safeCustomElement } from '@lib/decorators';
import { ClippyCard } from '@src/clippy-card';
import { property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'clippy-card-as-link';

// Reflects "some descendant currently has :focus-visible" onto the host as an attribute, so CSS
// can style the whole card from it. Not a public property: `:host(:has(:focus-visible))` doesn't
// reliably re-invalidate across the shadow boundary on dynamic pseudo-class changes
// (w3c/csswg-drafts#5893), and `::slotted(a:focus-visible)` can only style the anchor itself.
const focusVisibleAttribute = 'link-focus-visible';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyCardAsLink;
  }
}

/**
 * `clippy-card` made entirely clickable by a single `<a slot="link">` — a direct child of the
 * host, whose text content is the link's accessible name. `clippy-card` already renders the
 * `link` slot right after `header`; this component adds no markup of its own beyond a small
 * focus listener. The CSS stretches that anchor (`position: absolute; inset: 0`) to cover the
 * whole card and visually hides its text (not `display: none` — assistive tech still reads it).
 * Any visible heading/icon/etc. goes in the regular `pre-header`/`header`/`body`/`footer` slots,
 * independent of the link, so its hover/active/focus-visible states read as "the whole card"
 * rather than an inline snippet.
 *
 * Set `variant="list-item"` for a compact, horizontal composition: header and footer sit side
 * by side in a single row instead of stacking.
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

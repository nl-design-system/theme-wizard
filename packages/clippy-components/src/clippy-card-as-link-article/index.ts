import { safeCustomElement } from '@lib/decorators';
import { ClippyCard } from '@src/clippy-card';
import cardAsLinkOverlay from '../lib/card-as-link-overlay';
import styles from './styles';

const tag = 'clippy-card-as-link-article';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyCardAsLinkArticle;
  }
}

/**
 * An article-style `clippy-card` composition: `pre-header` is edge-to-edge media (an image, a
 * status banner) — zero padding, rounded top corners baked in — stacked above `header`/`body`/
 * `footer`. Slot a real `<a>` as a direct child of `header` (with any heading nested inside it,
 * not the other way around) to make the whole card a single clickable link — a
 * `::slotted(a)::after` overlay stretches its hit area to cover the card, purely via CSS. See
 * `clippy-card-as-link-horizontal` for the compact, single-row variant.
 *
 * @slot pre-header - Edge-to-edge media, e.g. an image or status banner
 * @slot header - Card heading region — put your `<a>` here (as a direct child) for a heading link
 * @slot body - Main card content
 * @slot footer - Footer content, e.g. a trailing icon
 */
@safeCustomElement(tag)
export class ClippyCardAsLinkArticle extends ClippyCard {
  static override readonly styles = [...ClippyCard.styles, cardAsLinkOverlay, styles];
}

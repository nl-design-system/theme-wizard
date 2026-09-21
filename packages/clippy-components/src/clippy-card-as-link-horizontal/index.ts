import { safeCustomElement } from '@lib/decorators';
import { ClippyCard } from '@src/clippy-card';
import cardAsLinkOverlay from '../lib/card-as-link-overlay';
import styles from './styles';

const tag = 'clippy-card-as-link-horizontal';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyCardAsLinkHorizontal;
  }
}

/**
 * A compact, horizontal `clippy-card` composition: header and footer sit side by side in a
 * single row instead of stacking. Slot a real `<a>` as a direct child of `header` (with any
 * heading nested inside it, not the other way around) to make the whole row a single clickable
 * link — a `::slotted(a)::after` overlay stretches its hit area to cover the row, purely via
 * CSS. See `clippy-card-as-link-article` for the stacked, image-led variant.
 *
 * @slot header - Card heading region — put your `<a>` here (as a direct child) for a heading link
 * @slot footer - Trailing content, e.g. an icon
 */
@safeCustomElement(tag)
export class ClippyCardAsLinkHorizontal extends ClippyCard {
  static override readonly styles = [...ClippyCard.styles, cardAsLinkOverlay, styles];
}

import { safeCustomElement } from '@lib/decorators';
import { ClippyCardAsLink } from '@src/clippy-card-as-link';
import styles from './styles';

const tag = 'clippy-card-as-link-horizontal';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyCardAsLinkHorizontal;
  }
}

/**
 * A compact, horizontal `clippy-card-as-link` composition: header and footer sit side by side
 * in a single row instead of stacking. See `clippy-card-as-link` for the `link` slot that makes
 * the whole row clickable. See `clippy-card-as-link-article` for the stacked, image-led variant.
 *
 * @slot header - Card heading region
 * @slot footer - Trailing content, e.g. an icon
 */
@safeCustomElement(tag)
export class ClippyCardAsLinkHorizontal extends ClippyCardAsLink {
  static override readonly styles = [...ClippyCardAsLink.styles, styles];
}

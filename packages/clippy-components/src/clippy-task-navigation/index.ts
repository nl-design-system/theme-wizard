import { safeCustomElement } from '@lib/decorators';
import { ClippyCard } from '@src/clippy-card';
import cardAsLinkOverlay from '../lib/card-as-link-overlay';
import styles from './styles';

const tag = 'clippy-task-navigation';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTaskNavigation;
  }
}

/**
 * A compact, horizontal `clippy-card` composition for a single row in a task/step navigation
 * list: `header` and `footer` sit side by side in a row, with an optional `body` slot for
 * supplementary detail (e.g. a due date) between them. Slot a real `<a>` as a direct child of
 * `header` (with any icon/label nested inside it, not the other way around) to make the whole
 * row a single clickable link — a `::slotted(a)::after` overlay stretches its hit area to cover
 * the row, purely via CSS. See `clippy-card-as-link-horizontal`, which this is based on.
 *
 * @slot header - Task label region — put your `<a>` here (as a direct child) for the task link
 * @slot body - Supplementary detail, e.g. a due date
 * @slot footer - Trailing content, e.g. a chevron icon
 */
@safeCustomElement(tag)
export class ClippyTaskNavigation extends ClippyCard {
  static override readonly styles = [...ClippyCard.styles, cardAsLinkOverlay, styles];
}

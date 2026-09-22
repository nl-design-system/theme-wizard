import { safeCustomElement } from '@lib/decorators';
import { ClippyCardAsLink } from '@src/clippy-card-as-link';
import styles from './styles';

const tag = 'clippy-task-navigation';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTaskNavigation;
  }
}

/**
 * A compact, horizontal `clippy-card-as-link` composition for a single row in a task/step
 * navigation list: `header` and `footer` sit side by side in a row, with an optional `body`
 * slot for supplementary detail (e.g. a due date) between them. See `clippy-card-as-link` for
 * the `link` slot that makes the whole row clickable.
 *
 * @slot header - Task label region
 * @slot body - Supplementary detail, e.g. a due date
 * @slot footer - Trailing content, e.g. a chevron icon
 */
@safeCustomElement(tag)
export class ClippyTaskNavigation extends ClippyCardAsLink {
  static override readonly styles = [...ClippyCardAsLink.styles, styles];
}
